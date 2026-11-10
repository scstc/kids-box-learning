package com.scstc.kidsboxlearning;

import android.Manifest;
import android.app.Activity;
import android.content.ClipData;
import android.content.Intent;
import android.media.projection.MediaProjectionManager;
import android.net.Uri;
import android.os.Build;
import android.util.DisplayMetrics;
import androidx.activity.result.ActivityResult;
import androidx.core.content.ContextCompat;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.concurrent.atomic.AtomicLong;

@CapacitorPlugin(name = "ScreenRecorder", permissions = {
    @Permission(alias = "microphone", strings = { Manifest.permission.RECORD_AUDIO })
})
public class ScreenRecorderPlugin extends Plugin {
    private static volatile boolean pending;
    private static volatile boolean cancelled;
    private static final AtomicLong generation = new AtomicLong();
    private long ownedGeneration;
    static boolean serviceLaunched(long request) {
        if (!pending || cancelled || generation.get() != request) return false;
        pending = false;
        return true;
    }

    private boolean learnerId(String id) { return id != null && id.matches("[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"); }
    private JSObject bridgeStatus(JSONObject state) {
        try { return JSObject.fromJSONObject(state); }
        catch (Exception error) {
            JSObject failed = new JSObject(); failed.put("state", "error"); failed.put("message", "Recording details could not be read. Your video files have been kept.");
            return failed;
        }
    }
    private JSObject currentStatus() {
        JSONObject state = ScreenRecordingService.status(getContext());
        if (ScreenRecordingService.busy(getContext()) && !ScreenRecordingService.running() && !pending) {
            ScreenRecordingService.cleanInterrupted(getContext());
            state = ScreenRecordingService.object("state", "error");
            try { state.put("message", "The previous recording was interrupted. Start a new recording."); } catch (Exception ignored) { }
            ScreenRecordingService.setStatus(getContext(), state);
        }
        JSONObject kept = ScreenRecordingService.pendingRecording(getContext());
        if (kept != null && !ScreenRecordingService.running() && !pending) {
            state = ScreenRecordingService.object("state", "error");
            try { state.put("recording", kept); state.put("message", "The video is safe, but its details still need to be saved. Please retry."); } catch (Exception ignored) { }
            ScreenRecordingService.setStatus(getContext(), state);
        }
        return bridgeStatus(state);
    }

    @PluginMethod public void getInfo(PluginCall call) {
        JSObject result = new JSObject();
        result.put("supported", true); result.put("mic", true); result.put("playbackAudio", false);
        result.put("saveLocation", Build.VERSION.SDK_INT >= 29 ? "Movies/Kids Box" : "Kids Box app files");
        call.resolve(result);
    }
    @PluginMethod public void getStatus(PluginCall call) { call.resolve(currentStatus()); }

    @PluginMethod public void start(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (!learnerId(call.getString("learnerId"))) { call.reject("Choose a learner before recording."); return; }
            currentStatus();
            if (ScreenRecordingService.pendingRecording(getContext()) != null) { call.reject("Save the previous recording's details before starting another recording."); return; }
            if (pending || ScreenRecordingService.busy(getContext()) || ScreenRecordingService.running()) { call.reject("A screen recording is already starting or finishing. Please try again in a moment."); return; }
            pending = true; cancelled = false;
            ownedGeneration = generation.incrementAndGet();
            call.getData().put("recordingGeneration", ownedGeneration);
            JSONObject state = ScreenRecordingService.object("state", "starting");
            try { state.put("learnerId", call.getString("learnerId")); } catch (Exception ignored) { }
            ScreenRecordingService.setStatus(getContext(), state);
            try {
                if (getPermissionState("microphone") != PermissionState.GRANTED) requestPermissionForAlias("microphone", call, "microphoneResult");
                else requestScreen(call);
            } catch (Exception error) { resetPending("Could not request microphone permission."); call.reject("Could not request microphone permission.", error); }
        });
    }

    @PermissionCallback private void microphoneResult(PluginCall call) {
        if (call == null) { if (pending && ownedGeneration == generation.get()) resetPending("The recording permission request was interrupted."); return; }
        if (!currentRequest(call)) { call.resolve(currentStatus()); return; }
        if (cancelled) { cancelCall(call); return; }
        if (getPermissionState("microphone") != PermissionState.GRANTED) {
            resetPending("Microphone permission is needed to record your voice.");
            call.reject("Microphone permission is needed to record your voice.");
        } else requestScreen(call);
    }

    private void requestScreen(PluginCall call) {
        try {
            MediaProjectionManager manager = (MediaProjectionManager) getContext().getSystemService(android.content.Context.MEDIA_PROJECTION_SERVICE);
            startActivityForResult(call, manager.createScreenCaptureIntent(), "screenResult");
        } catch (Exception error) { resetPending("Screen recording is not available on this device."); call.reject("Screen recording is not available on this device.", error); }
    }

    @ActivityCallback private void screenResult(PluginCall call, ActivityResult result) {
        if (call == null) { if (pending && ownedGeneration == generation.get()) resetPending("The recording permission request was interrupted."); return; }
        if (!currentRequest(call)) { call.resolve(currentStatus()); return; }
        if (cancelled) { cancelCall(call); return; }
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null) {
            pending = false;
            JSONObject state = ScreenRecordingService.object("state", "idle");
            try { state.put("message", "Screen recording was cancelled."); } catch (Exception ignored) { }
            ScreenRecordingService.setStatus(getContext(), state);
            call.resolve(bridgeStatus(state));
            return;
        }
        try {
            DisplayMetrics metrics = new DisplayMetrics();
            getActivity().getWindowManager().getDefaultDisplay().getRealMetrics(metrics);
            double scale = Math.min(1.0, 1280.0 / Math.max(metrics.widthPixels, metrics.heightPixels));
            int width = Math.max(160, ((int) (metrics.widthPixels * scale) / 16) * 16);
            int height = Math.max(160, ((int) (metrics.heightPixels * scale) / 16) * 16);
            Intent intent = new Intent(getContext(), ScreenRecordingService.class).setAction(ScreenRecordingService.ACTION_START)
                .putExtra("projectionData", result.getData()).putExtra("resultCode", result.getResultCode())
                .putExtra("recordingGeneration", ownedGeneration)
                .putExtra("width", width).putExtra("height", height).putExtra("density", metrics.densityDpi)
                .putExtra("learnerId", call.getString("learnerId")).putExtra("learnerName", call.getString("learnerName", "Learner"));
            ContextCompat.startForegroundService(getContext(), intent);
            call.resolve(bridgeStatus(ScreenRecordingService.status(getContext())));
        } catch (Exception error) { resetPending("Could not start screen recording. Please try again."); call.reject("Could not start screen recording. Please try again.", error); }
    }

    private void resetPending(String message) {
        pending = false;
        JSONObject state = ScreenRecordingService.object("state", "error");
        try { state.put("message", message); } catch (Exception ignored) { }
        ScreenRecordingService.setStatus(getContext(), state);
    }
    private boolean currentRequest(PluginCall call) {
        return pending && call.getData().optLong("recordingGeneration", -1) == generation.get();
    }
    private void cancelCall(PluginCall call) {
        pending = false;
        ScreenRecordingService.setStatus(getContext(), ScreenRecordingService.object("state", "idle"));
        call.resolve(currentStatus());
    }

    @PluginMethod public void stop(PluginCall call) {
        if (!ScreenRecordingService.running() && !pending) {
            try { ScreenRecordingService.retryPending(getContext()); }
            catch (Exception error) { call.reject(error.getMessage() == null ? "Recording details could not be saved. Please retry." : error.getMessage(), error); return; }
        }
        if (pending && !ScreenRecordingService.running()) {
            cancelled = true;
            ScreenRecordingService.setStatus(getContext(), ScreenRecordingService.object("state", "idle"));
        } else ScreenRecordingService.stopCurrent();
        call.resolve(currentStatus());
    }

    @PluginMethod public void listRecordings(PluginCall call) {
        String learner = call.getString("learnerId");
        if (!learnerId(learner)) { call.reject("Choose a learner to view recordings."); return; }
        try {
            JSObject result = new JSObject();
            result.put("recordings", new JSArray(ScreenRecordingService.recordings(getContext(), learner).toString()));
            call.resolve(result);
        } catch (Exception error) { call.reject("Saved recordings could not be read. Your video files have been kept.", error); }
    }

    private JSONObject recording(PluginCall call) throws Exception {
        String learner = call.getString("learnerId"), id = call.getString("id");
        if (!learnerId(learner) || !learnerId(id)) throw new Exception("Choose a saved recording.");
        JSONArray items = ScreenRecordingService.recordings(getContext(), learner);
        for (int i = 0; i < items.length(); i++) if (id.equals(items.getJSONObject(i).optString("id"))) return items.getJSONObject(i);
        throw new Exception("This recording could not be found for the selected learner.");
    }
    private void showRecording(PluginCall call, boolean share) {
        getActivity().runOnUiThread(() -> {
            try {
                if (ScreenRecordingService.busy(getContext())) throw new Exception("Stop recording before opening a saved video.");
                JSONObject item = recording(call);
                Uri uri = Uri.parse(item.getString("uri"));
                try (android.content.res.AssetFileDescriptor descriptor = getContext().getContentResolver().openAssetFileDescriptor(uri, "r")) {
                    if (descriptor == null) throw new Exception("This video is no longer available on the device.");
                }
                Intent intent = new Intent(share ? Intent.ACTION_SEND : Intent.ACTION_VIEW).setType("video/mp4").addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                intent.setClipData(ClipData.newRawUri("Kids Box recording", uri));
                if (share) { intent.putExtra(Intent.EXTRA_STREAM, uri); intent.putExtra(Intent.EXTRA_TITLE, item.getString("name")); }
                else intent.setDataAndType(uri, "video/mp4");
                getActivity().startActivity(share ? Intent.createChooser(intent, "Share recording") : intent);
                call.resolve();
            } catch (Exception error) { call.reject(error.getMessage() == null ? "No app could open this video." : error.getMessage(), error); }
        });
    }
    @PluginMethod public void open(PluginCall call) { showRecording(call, false); }
    @PluginMethod public void share(PluginCall call) { showRecording(call, true); }
    @PluginMethod public void remove(PluginCall call) {
        try {
            currentStatus();
            if (pending || ScreenRecordingService.running() || ScreenRecordingService.busy(getContext()))
                throw new Exception("Stop recording before deleting a video.");
            JSONObject item = recording(call);
            ScreenRecordingService.removeRecording(getContext(), item.getString("id"), call.getString("learnerId"));
            call.resolve();
        } catch (Exception error) {
            call.reject(error.getMessage() == null ? "The video could not be deleted. Please try again." : error.getMessage(), error);
        }
    }
    @Override protected void handleOnStop() { if (ScreenRecordingService.running()) ScreenRecordingService.stopCurrent(); }
    @Override protected void handleOnDestroy() {
        if (pending && !ScreenRecordingService.running()) {
            generation.incrementAndGet(); cancelled = true; pending = false;
            ScreenRecordingService.setStatus(getContext(), ScreenRecordingService.object("state", "idle"));
        }
        if (ScreenRecordingService.running()) ScreenRecordingService.stopCurrent();
    }
}
