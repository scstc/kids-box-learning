package com.scstc.kidsboxlearning;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.pm.ServiceInfo;
import android.database.Cursor;
import android.hardware.display.DisplayManager;
import android.hardware.display.VirtualDisplay;
import android.media.MediaMetadataRetriever;
import android.media.MediaRecorder;
import android.media.projection.MediaProjection;
import android.media.projection.MediaProjectionManager;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.provider.MediaStore;
import android.system.ErrnoException;
import android.system.Os;
import android.system.OsConstants;
import android.view.Surface;
import androidx.core.app.NotificationCompat;
import androidx.core.content.FileProvider;
import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;
import org.json.JSONArray;
import org.json.JSONObject;

public class ScreenRecordingService extends Service {
    static final String ACTION_START = "com.scstc.kidsboxlearning.RECORD_START";
    static final String ACTION_STOP = "com.scstc.kidsboxlearning.RECORD_STOP";
    private static final String CHANNEL = "kids-box-screen-recording";
    private static final int NOTIFICATION = 42;
    private static volatile ScreenRecordingService instance;
    private static volatile JSONObject pendingRecord;
    private static volatile JSONObject deletingRecord;
    private final ExecutorService worker = Executors.newSingleThreadExecutor();
    private final AtomicBoolean stopping = new AtomicBoolean(false);
    private final Handler main = new Handler(Looper.getMainLooper());
    private MediaProjection projection;
    private MediaRecorder recorder;
    private VirtualDisplay display;
    private Surface surface;
    private File file;
    private String learnerId, learnerName, recordingId, filename;
    private long startedAt;
    private boolean recording;
    private boolean accepted;
    private boolean screenReceiverRegistered;

    private static SharedPreferences preferences(Context context) {
        return context.getSharedPreferences("screen-recordings", Context.MODE_PRIVATE);
    }

    static synchronized JSONObject status(Context context) {
        try { return new JSONObject(preferences(context).getString("status", "{\"state\":\"idle\"}")); }
        catch (Exception ignored) { return object("state", "idle"); }
    }

    static synchronized void setStatus(Context context, JSONObject value) {
        preferences(context).edit().putString("status", value.toString()).apply();
    }

    static JSONObject object(String key, Object value) {
        JSONObject result = new JSONObject();
        try { result.put(key, value); } catch (Exception ignored) { }
        return result;
    }

    static boolean busy(Context context) {
        String state = status(context).optString("state");
        return state.equals("starting") || state.equals("recording") || state.equals("stopping");
    }

    static boolean running() { return instance != null; }

    static synchronized void cleanInterrupted(Context context) {
        SharedPreferences saved = preferences(context);
        String path = saved.getString("pending-file", null);
        String id = saved.getString("pending-id", "");
        boolean indexed = false;
        try {
            JSONArray all = new JSONArray(saved.getString("recordings", "[]"));
            for (int i = 0; i < all.length(); i++) if (id.equals(all.getJSONObject(i).optString("id"))) indexed = true;
            if (path != null && !indexed) {
                File movies = context.getExternalFilesDir(Environment.DIRECTORY_MOVIES);
                if (movies != null) {
                    File folder = new File(movies, "Kids Box").getCanonicalFile();
                    File partial = new File(path).getCanonicalFile();
                    if (folder.equals(partial.getParentFile())) {
                        long duration = videoDuration(partial);
                        if (duration > 0 && pendingRecording(context) == null) {
                            JSONObject details = new JSONObject(saved.getString("pending-details", "{}"));
                            if (id.equals(details.optString("id")) && !details.optString("learnerId").isEmpty()) {
                                details.put("uri", FileProvider.getUriForFile(context, context.getPackageName() + ".fileprovider", partial).toString());
                                details.put("duration", duration); details.put("size", partial.length()); details.put("appFiles", true);
                                keepPending(context, details);
                            }
                        } else if (duration < 0 && !saved.getBoolean("pending-finalized", false)) partial.delete();
                    }
                }
            }
        } catch (Exception ignored) { /* Keep files if their saved ownership cannot be checked. */ }
        if (Build.VERSION.SDK_INT >= 29) {
            // Only unfinished rows created by this app are removed; published videos stay intact.
            String selection = MediaStore.Video.Media.RELATIVE_PATH + "=? AND " + MediaStore.Video.Media.IS_PENDING + "=1 AND " + MediaStore.MediaColumns.OWNER_PACKAGE_NAME + "=?";
            try (Cursor rows = context.getContentResolver().query(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, new String[] { MediaStore.Video.Media._ID }, selection, new String[] { Environment.DIRECTORY_MOVIES + "/Kids Box/", context.getPackageName() }, null)) {
                if (rows != null) while (rows.moveToNext()) context.getContentResolver().delete(android.content.ContentUris.withAppendedId(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, rows.getLong(0)), null, null);
            } catch (Exception ignored) { /* A later recovery can retry unavailable device storage. */ }
        }
        saved.edit().remove("pending-file").remove("pending-id").remove("pending-finalized").remove("pending-details").apply();
    }

    private static long videoDuration(File file) {
        MediaMetadataRetriever metadata = new MediaMetadataRetriever();
        try {
            metadata.setDataSource(file.getAbsolutePath());
            return Long.parseLong(metadata.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION));
        } catch (Exception ignored) { return -1; }
        finally { try { metadata.release(); } catch (Exception ignored) { } }
    }

    static synchronized JSONObject pendingRecording(Context context) {
        try {
            JSONObject item = pendingRecord;
            if (item == null) {
                String value = preferences(context).getString("pending-recording", null);
                item = value == null ? null : new JSONObject(value);
            }
            JSONObject deleting = pendingDeletion(context);
            return item != null && sameRecording(deleting, item.optString("id"), item.optString("learnerId")) ? null : item;
        } catch (Exception ignored) { return null; }
    }

    private static boolean sameRecording(JSONObject item, String id, String learner) {
        return item != null && id.equals(item.optString("id")) && learner.equals(item.optString("learnerId"));
    }

    private static JSONObject pendingDeletion(Context context) {
        if (deletingRecord != null) return deletingRecord;
        try {
            String value = preferences(context).getString("pending-deletion", null);
            return value == null ? null : new JSONObject(value);
        } catch (Exception ignored) { return null; }
    }

    private static synchronized void keepPending(Context context, JSONObject item) {
        pendingRecord = item;
        preferences(context).edit().putString("pending-recording", item.toString()).commit();
    }

    private static synchronized void clearPending(Context context) {
        pendingRecord = null;
        preferences(context).edit().remove("pending-recording").remove("pending-file").remove("pending-id").remove("pending-finalized").remove("pending-details").commit();
    }

    static synchronized boolean retryPending(Context context) throws Exception {
        JSONObject item = pendingRecording(context);
        if (item == null) return false;
        remember(context, item);
        clearPending(context);
        JSONObject state = object("state", "saved");
        state.put("recording", item);
        state.put("message", item.optBoolean("appFiles") ? "Recording saved in Kids Box app files." : "Recording saved on this device.");
        setStatus(context, state);
        return true;
    }

    static synchronized JSONArray recordings(Context context, String learner) throws Exception {
        JSONArray all = new JSONArray(preferences(context).getString("recordings", "[]"));
        JSONArray result = new JSONArray();
        JSONObject pending = pendingRecording(context);
        boolean pendingListed = false;
        for (int i = all.length() - 1; i >= 0; i--) {
            JSONObject item = all.optJSONObject(i);
            if (item != null && learner.equals(item.optString("learnerId"))) result.put(item);
            if (item != null && pending != null && item.optString("id").equals(pending.optString("id"))) pendingListed = true;
        }
        if (!pendingListed && pending != null && learner.equals(pending.optString("learnerId"))) result.put(pending);
        JSONObject deleting = pendingDeletion(context);
        if (deleting != null && learner.equals(deleting.optString("learnerId"))) {
            boolean listed = false;
            for (int i = 0; i < result.length(); i++) if (deleting.optString("id").equals(result.getJSONObject(i).optString("id"))) listed = true;
            if (!listed) result.put(deleting);
        }
        return result;
    }

    static synchronized void removeRecording(Context context, String id, String learner) throws Exception {
        if (running() || busy(context)) throw new Exception("Stop recording before deleting a video.");
        SharedPreferences saved = preferences(context);
        JSONObject deleting = pendingDeletion(context);
        if (saved.contains("pending-deletion") && deleting == null)
            throw new Exception("The previous deletion details could not be read. Your video files have been kept.");
        JSONObject selected = null;
        JSONArray own = recordings(context, learner);
        for (int i = 0; i < own.length(); i++) if (sameRecording(own.getJSONObject(i), id, learner)) selected = own.getJSONObject(i);
        if (selected == null) throw new Exception("This recording could not be found for the selected learner.");
        // Parse the whole index before deleting a file; unreadable metadata must not be replaced.
        JSONArray all = new JSONArray(saved.getString("recordings", "[]"));
        boolean previousDeletion = deleting != null && !sameRecording(deleting, id, learner);
        if (previousDeletion) {
            boolean indexed = false;
            for (int i = 0; i < all.length(); i++) if (sameRecording(all.optJSONObject(i), deleting.optString("id"), deleting.optString("learnerId"))) indexed = true;
            if (!indexed) all.put(deleting);
        }
        JSONArray remaining = new JSONArray();
        for (int i = 0; i < all.length(); i++) {
            Object item = all.get(i);
            if (!(item instanceof JSONObject) || !sameRecording((JSONObject) item, id, learner)) remaining.put(item);
        }
        JSONObject pending = pendingRecord;
        if (pending == null) {
            String value = saved.getString("pending-recording", null);
            if (value != null) pending = new JSONObject(value);
        }
        boolean deletingPending = sameRecording(pending, id, learner);
        // Reject unavailable/unowned storage before creating a deletion journal.
        removeVideoFile(context, selected, false);
        deletingRecord = selected;
        // Preserve a previous deletion's retry entry in the index before replacing
        // its journal, including when another learner deletes their own video.
        SharedPreferences.Editor prepared = saved.edit().putString("recordings", all.toString()).putString("pending-deletion", selected.toString());
        if (previousDeletion && sameRecording(pending, deleting.optString("id"), deleting.optString("learnerId"))) {
            prepared.remove("pending-recording");
            pendingRecord = null;
            if (deleting.optString("id").equals(saved.getString("pending-id", "")))
                prepared.remove("pending-file").remove("pending-id").remove("pending-finalized").remove("pending-details");
        }
        JSONObject previousStatus = status(context);
        boolean deletingLast = sameRecording(previousStatus.optJSONObject("recording"), id, learner)
            || (previousDeletion && sameRecording(previousStatus.optJSONObject("recording"), deleting.optString("id"), deleting.optString("learnerId")));
        if (deletingLast) prepared.putString("status", object("state", "idle").toString());
        if (!prepared.commit()) throw new Exception("Deletion could not be prepared. The video has been kept. Please retry.");
        removeVideoFile(context, selected, true);
        SharedPreferences.Editor finished = saved.edit().putString("recordings", remaining.toString()).remove("pending-deletion");
        if (deletingPending) finished.remove("pending-recording");
        if (id.equals(saved.getString("pending-id", "")))
            finished.remove("pending-file").remove("pending-id").remove("pending-finalized").remove("pending-details");
        if (deletingLast) finished.putString("status", object("state", "idle").toString());
        // Keep the journal in memory/on disk until this commit succeeds, so a failed
        // index write can be retried even after the physical file is already gone.
        if (!finished.commit()) throw new Exception("The video was deleted, but the list could not be updated. Tap Delete again to finish.");
        if (deletingPending) pendingRecord = null;
        deletingRecord = null;
    }

    private static void removeVideoFile(Context context, JSONObject item, boolean deleting) throws Exception {
        if (!Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState()))
            throw new Exception("Device video storage is not available for deletion. Please try again.");
        Uri uri = Uri.parse(item.getString("uri"));
        if (!"content".equals(uri.getScheme())) throw new Exception("This video address could not be verified.");
        String authority = context.getPackageName() + ".fileprovider";
        if (authority.equals(uri.getAuthority())) {
            File movies = context.getExternalFilesDir(Environment.DIRECTORY_MOVIES);
            if (movies == null || !Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState(movies)))
                throw new Exception("Device video storage is not available for deletion. Please try again.");
            File folder = new File(movies, "Kids Box").getCanonicalFile();
            File video = new File(folder, item.getString("name")).getCanonicalFile();
            if (!folder.equals(video.getParentFile()) || !uri.equals(FileProvider.getUriForFile(context, authority, video)))
                throw new Exception("This video address could not be verified.");
            try {
                if (!OsConstants.S_ISREG(Os.lstat(video.getAbsolutePath()).st_mode)) throw new Exception("The saved video is not a regular file.");
                if (deleting) Os.remove(video.getAbsolutePath());
            } catch (ErrnoException error) {
                if (error.errno != OsConstants.ENOENT && error.errno != OsConstants.ENOTDIR)
                    throw new Exception("The video could not be deleted. Check device storage and try again.", error);
            }
            return;
        }
        java.util.List<String> parts = uri.getPathSegments();
        if (Build.VERSION.SDK_INT < 29 || !"media".equals(uri.getAuthority()) || parts.size() != 4
            || !("external".equals(parts.get(0)) || "external_primary".equals(parts.get(0)))
            || !"video".equals(parts.get(1)) || !"media".equals(parts.get(2)) || !parts.get(3).matches("[0-9]+"))
            throw new Exception("This video address could not be verified.");
        try (Cursor row = context.getContentResolver().query(uri, new String[] { MediaStore.MediaColumns.OWNER_PACKAGE_NAME }, null, null, null)) {
            if (row == null) throw new Exception("The saved video could not be checked. Please retry.");
            if (!row.moveToFirst()) return; // Removed in the device gallery: clear its stale list entry.
            if (!context.getPackageName().equals(row.getString(0))) throw new Exception("This video no longer belongs to Kids Box and was not deleted.");
        }
        if (!deleting) return;
        if (context.getContentResolver().delete(uri, null, null) > 0) return;
        try (Cursor row = context.getContentResolver().query(uri, new String[] { MediaStore.Video.Media._ID }, null, null, null)) {
            if (row == null || row.moveToFirst()) throw new Exception("The video could not be deleted. Please retry.");
        }
    }

    static synchronized void remember(Context context, JSONObject item) throws Exception {
        JSONArray all = new JSONArray(preferences(context).getString("recordings", "[]"));
        boolean exists = false;
        for (int i = 0; i < all.length(); i++) if (item.getString("id").equals(all.getJSONObject(i).optString("id"))) exists = true;
        if (!exists) all.put(item);
        if (!preferences(context).edit().putString("recordings", all.toString()).commit())
            throw new Exception("The video was saved, but its details could not be added to the recording list.");
    }

    static void stopCurrent() {
        ScreenRecordingService current = instance;
        if (current != null) current.finish(null);
    }

    private final MediaProjection.Callback projectionCallback = new MediaProjection.Callback() {
        @Override public void onStop() { finish(null); }
    };
    private final BroadcastReceiver screenReceiver = new BroadcastReceiver() {
        @Override public void onReceive(Context context, Intent intent) { finish(null); }
    };

    @Override public void onCreate() {
        super.onCreate();
        instance = this;
        IntentFilter filter = new IntentFilter(Intent.ACTION_SCREEN_OFF);
        filter.addAction(Intent.ACTION_SHUTDOWN);
        if (Build.VERSION.SDK_INT >= 33) registerReceiver(screenReceiver, filter, Context.RECEIVER_NOT_EXPORTED);
        else registerReceiver(screenReceiver, filter);
        screenReceiverRegistered = true;
    }

    @Override public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null || ACTION_STOP.equals(intent.getAction())) {
            if (accepted) finish(null); else stopSelf(startId);
            return START_NOT_STICKY;
        }
        if (!ACTION_START.equals(intent.getAction()) || recorder != null) return START_NOT_STICKY;
        if (!ScreenRecorderPlugin.serviceLaunched(intent.getLongExtra("recordingGeneration", -1))) { stopSelf(startId); return START_NOT_STICKY; }
        accepted = true;
        try {
            NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            if (Build.VERSION.SDK_INT >= 26) manager.createNotificationChannel(new NotificationChannel(CHANNEL, "Screen recording", NotificationManager.IMPORTANCE_LOW));
            if (Build.VERSION.SDK_INT >= 29) {
                int type = ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PROJECTION;
                if (Build.VERSION.SDK_INT >= 30) type |= ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE;
                startForeground(NOTIFICATION, notification(), type);
            } else startForeground(NOTIFICATION, notification());
            worker.execute(() -> begin(intent));
        } catch (Exception error) { finish(error.getMessage() == null ? "Could not start screen recording." : error.getMessage()); }
        return START_NOT_STICKY;
    }

    private Notification notification() {
        Intent open = new Intent(this, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent content = PendingIntent.getActivity(this, 0, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        Intent stop = new Intent(this, ScreenRecordingService.class).setAction(ACTION_STOP);
        PendingIntent action = PendingIntent.getService(this, 1, stop, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        return new NotificationCompat.Builder(this, CHANNEL)
            .setSmallIcon(android.R.drawable.presence_video_online).setContentTitle("Kids Box is recording")
            .setContentText("Screen and microphone. Tap Stop to save the video.")
            .setContentIntent(content).setOngoing(true).setOnlyAlertOnce(true)
            .addAction(android.R.drawable.ic_media_pause, "Stop recording", action).build();
    }

    private void begin(Intent intent) {
        try {
            if (stopping.get()) return;
            learnerId = intent.getStringExtra("learnerId");
            learnerName = intent.getStringExtra("learnerName");
            recordingId = UUID.randomUUID().toString();
            String name = (learnerName == null ? "Learner" : learnerName).replaceAll("[^\\p{L}\\p{N} ._-]", "_");
            if (name.length() > 32) name = name.substring(0, 32);
            filename = "Kids Box - " + name + " - " + new SimpleDateFormat("yyyyMMdd-HHmmss", Locale.US).format(new Date()) + "-" + recordingId.substring(0, 8) + ".mp4";
            File movies = getExternalFilesDir(Environment.DIRECTORY_MOVIES);
            if (movies == null) throw new Exception("Device storage is not available.");
            File folder = new File(movies, "Kids Box");
            if (!folder.isDirectory() && !folder.mkdirs()) throw new Exception("Could not create the recording folder.");
            if (folder.getUsableSpace() < 50L * 1024 * 1024) throw new Exception("Free some space on this device before recording.");
            file = new File(folder, filename);
            JSONObject attempt = object("id", recordingId);
            attempt.put("name", filename); attempt.put("learnerId", learnerId); attempt.put("createdAt", System.currentTimeMillis()); attempt.put("playbackAudio", false);
            if (!preferences(this).edit().putString("pending-file", file.getAbsolutePath()).putString("pending-id", recordingId).putString("pending-details", attempt.toString()).putBoolean("pending-finalized", false).commit()) throw new Exception("Recording details could not be saved on this device.");
            MediaProjectionManager manager = (MediaProjectionManager) getSystemService(MEDIA_PROJECTION_SERVICE);
            Intent permission = intent.getParcelableExtra("projectionData");
            projection = manager.getMediaProjection(intent.getIntExtra("resultCode", 0), permission);
            if (projection == null) throw new Exception("Screen recording permission was not granted.");
            projection.registerCallback(projectionCallback, main);
            int width = intent.getIntExtra("width", 720), height = intent.getIntExtra("height", 1280);
            recorder = Build.VERSION.SDK_INT >= 31 ? new MediaRecorder(this) : new MediaRecorder();
            recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
            recorder.setVideoSource(MediaRecorder.VideoSource.SURFACE);
            recorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);
            recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
            recorder.setAudioChannels(1);
            recorder.setAudioSamplingRate(44100);
            recorder.setAudioEncodingBitRate(96000);
            recorder.setVideoEncoder(MediaRecorder.VideoEncoder.H264);
            recorder.setVideoSize(width, height);
            recorder.setVideoFrameRate(30);
            recorder.setVideoEncodingBitRate(4_000_000);
            recorder.setOutputFile(file.getAbsolutePath());
            recorder.setOnErrorListener((value, what, extra) -> finish("The recorder stopped because this device could not continue recording."));
            recorder.prepare();
            surface = recorder.getSurface();
            display = projection.createVirtualDisplay("Kids Box recording", width, height, intent.getIntExtra("density", 160), DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR, surface, null, main);
            if (display == null) throw new Exception("Could not open the screen capture surface.");
            if (stopping.get()) return;
            recorder.start();
            recording = true;
            startedAt = System.currentTimeMillis();
            JSONObject state = object("state", "recording");
            state.put("startedAt", startedAt); state.put("learnerId", learnerId); state.put("playbackAudio", false);
            setStatus(this, state);
        } catch (Exception error) {
            finish("Could not start recording. " + (error.getMessage() == null ? "Check microphone and screen permissions, then try again." : error.getMessage()));
        }
    }

    private void finish(String failure) {
        if (!stopping.compareAndSet(false, true)) return;
        JSONObject state = status(this);
        try { state.put("state", "stopping"); } catch (Exception ignored) { }
        setStatus(this, state);
        worker.execute(() -> {
            String error = failure;
            boolean usable = false;
            try {
                if (recording && recorder != null) {
                    recorder.stop(); usable = true;
                    preferences(this).edit().putBoolean("pending-finalized", true).commit();
                }
            } catch (RuntimeException invalid) { error = "The recording was too short or interrupted. Please record for a little longer."; }
            recording = false;
            releaseCapture();
            if (!usable && file != null && file.isFile() && videoDuration(file) > 0) usable = true;
            JSONObject saved = null;
            String savedMessage = error == null ? "Recording saved on this device." : "Recording stopped early. The available video was saved.";
            if (usable && file != null && file.length() > 0) {
                try {
                    long duration = Math.max(0, System.currentTimeMillis() - startedAt);
                    MediaMetadataRetriever metadata = new MediaMetadataRetriever();
                    try {
                        metadata.setDataSource(file.getAbsolutePath());
                        String value = metadata.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION);
                        if (value != null) duration = Long.parseLong(value);
                    } catch (Exception ignored) { /* MediaRecorder.stop already finalized this video. */ }
                    finally { try { metadata.release(); } catch (Exception ignored) { } }
                    Uri uri;
                    boolean exported = false;
                    try { uri = publish(); exported = Build.VERSION.SDK_INT >= 29; }
                    catch (Exception exportError) {
                        uri = FileProvider.getUriForFile(this, getPackageName() + ".fileprovider", file);
                        savedMessage = "Saved in Kids Box app files; could not add to Movies.";
                    }
                    saved = object("id", recordingId);
                    saved.put("name", filename); saved.put("uri", uri.toString()); saved.put("createdAt", startedAt);
                    saved.put("duration", duration); saved.put("size", file.length()); saved.put("learnerId", learnerId); saved.put("playbackAudio", false); saved.put("appFiles", !exported);
                    keepPending(this, saved);
                    remember(this, saved);
                    clearPending(this);
                    if (exported) file.delete();
                    error = null;
                } catch (Exception saveError) { error = saveError.getMessage() == null ? "The recording could not be saved." : saveError.getMessage(); }
            } else if (error == null) error = "No usable recording was created. Try recording for a little longer.";
            if (!usable && file != null) file.delete();
            JSONObject result = object("state", error == null ? "saved" : "error");
            try {
                if (saved != null) result.put("recording", saved);
                result.put("message", error == null ? savedMessage : error);
            } catch (Exception ignored) { }
            setStatus(this, result);
            if (saved == null && !usable) preferences(this).edit().remove("pending-file").remove("pending-id").remove("pending-finalized").remove("pending-details").apply();
            main.post(() -> { stopForeground(true); stopSelf(); });
        });
    }

    private Uri publish() throws Exception {
        if (Build.VERSION.SDK_INT < 29) return FileProvider.getUriForFile(this, getPackageName() + ".fileprovider", file);
        ContentValues values = new ContentValues();
        values.put(MediaStore.Video.Media.DISPLAY_NAME, filename);
        values.put(MediaStore.Video.Media.MIME_TYPE, "video/mp4");
        values.put(MediaStore.Video.Media.RELATIVE_PATH, Environment.DIRECTORY_MOVIES + "/Kids Box");
        values.put(MediaStore.Video.Media.IS_PENDING, 1);
        Uri uri = getContentResolver().insert(MediaStore.Video.Media.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY), values);
        if (uri == null) throw new Exception("Could not save the video to Movies/Kids Box.");
        try {
            try (FileInputStream input = new FileInputStream(file); OutputStream output = getContentResolver().openOutputStream(uri)) {
                if (output == null) throw new Exception("Could not write the recorded video.");
                byte[] buffer = new byte[128 * 1024]; int length;
                while ((length = input.read(buffer)) != -1) output.write(buffer, 0, length);
            }
            values.clear(); values.put(MediaStore.Video.Media.IS_PENDING, 0);
            if (getContentResolver().update(uri, values, null, null) != 1) throw new Exception("The recorded video could not be finalized.");
            return uri;
        } catch (Exception error) { getContentResolver().delete(uri, null, null); throw error; }
    }

    private void releaseCapture() {
        if (display != null) { try { display.release(); } catch (Exception ignored) { } display = null; }
        if (recorder != null) { try { recorder.release(); } catch (Exception ignored) { } recorder = null; }
        if (surface != null) { try { surface.release(); } catch (Exception ignored) { } surface = null; }
        if (projection != null) {
            try { projection.unregisterCallback(projectionCallback); projection.stop(); } catch (Exception ignored) { }
            projection = null;
        }
    }

    @Override public void onTaskRemoved(Intent rootIntent) { finish(null); }
    @Override public void onDestroy() {
        if (screenReceiverRegistered) { unregisterReceiver(screenReceiver); screenReceiverRegistered = false; }
        if (accepted && !stopping.get()) finish("Screen recording was interrupted.");
        instance = null;
        worker.shutdown();
        super.onDestroy();
    }
    @Override public IBinder onBind(Intent intent) { return null; }
}
