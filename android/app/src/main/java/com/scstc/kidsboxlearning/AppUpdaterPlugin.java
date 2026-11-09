package com.scstc.kidsboxlearning;

import android.app.DownloadManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;
import androidx.activity.result.ActivityResult;
import androidx.core.content.FileProvider;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;
import java.io.FileInputStream;
import java.io.ByteArrayOutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.json.JSONArray;
import org.json.JSONObject;

@CapacitorPlugin(name = "AppUpdater")
public class AppUpdaterPlugin extends Plugin {
    private static final String REPO = "https://github.com/scstc/kids-box-learning";
    private final ExecutorService worker = Executors.newSingleThreadExecutor();
    private JSONObject latest;
    private boolean verifying = false;
    private SharedPreferences prefs() { return getContext().getSharedPreferences("app-updates", Context.MODE_PRIVATE); }
    private DownloadManager manager() { return (DownloadManager) getContext().getSystemService(Context.DOWNLOAD_SERVICE); }
    private File apk() { return new File(getContext().getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), "kids-box-learning-update.apk"); }
    private PackageInfo installed() throws Exception { return getContext().getPackageManager().getPackageInfo(getContext().getPackageName(), 0); }
    private long code(PackageInfo info) { return Build.VERSION.SDK_INT >= 28 ? info.getLongVersionCode() : info.versionCode; }
    private boolean allowed() { return Build.VERSION.SDK_INT < 26 || getContext().getPackageManager().canRequestPackageInstalls(); }
    private String read(String url) throws Exception {
        HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
        connection.setConnectTimeout(15000); connection.setReadTimeout(20000);
        connection.setRequestProperty("User-Agent", "KidsBoxLearning-Updater");
        connection.setRequestProperty("Accept", "application/vnd.github+json");
        try {
            int status = connection.getResponseCode();
            if (status == 404) throw new Exception("No release is available on GitHub yet.");
            if (status != 200) throw new Exception("GitHub could not be reached (" + status + "). Please try again later.");
            ByteArrayOutputStream bytes = new ByteArrayOutputStream();
            try (java.io.InputStream input = connection.getInputStream()) {
                byte[] buffer = new byte[8192]; int length;
                while ((length = input.read(buffer)) != -1) {
                    bytes.write(buffer, 0, length);
                    if (bytes.size() > 1024 * 1024) throw new Exception("Release information is too large. Try again later.");
                }
            }
            return bytes.toString("UTF-8");
        } finally { connection.disconnect(); }
    }
    @PluginMethod public void getInfo(PluginCall call) {
        try {
            JSObject result = new JSObject();
            result.put("version", installed().versionName); result.put("versionCode", code(installed())); result.put("canInstall", allowed());
            call.resolve(result);
        } catch (Exception error) { call.reject("Could not read the installed version.", error); }
    }
    @PluginMethod public void check(PluginCall call) {
        worker.execute(() -> {
            try {
                JSONObject release;
                try { release = new JSONObject(read("https://api.github.com/repos/scstc/kids-box-learning/releases/latest")); }
                catch (Exception apiError) { release = new JSONObject(read(REPO + "/releases/latest/download/update.json")); }
                String tag = release.getString("tag_name");
                Matcher match = Pattern.compile("^v(\\d{2})\\.([1-4])\\.([1-9]\\d{0,3})$").matcher(tag);
                if (!match.matches() || release.optBoolean("draft") || release.optBoolean("prerelease")) throw new Exception("Invalid release version format.");
                long versionCode = Long.parseLong(match.group(1)) * 100000 + Long.parseLong(match.group(2)) * 10000 + Long.parseLong(match.group(3));
                String version = tag.substring(1), name = "kids-box-learning-" + version + ".apk";
                JSONArray assets = release.getJSONArray("assets"); JSONObject asset = null;
                for (int i = 0; i < assets.length(); i++) if (name.equals(assets.getJSONObject(i).optString("name"))) asset = assets.getJSONObject(i);
                if (asset == null) throw new Exception("No APK is available for this version yet. Try again later.");
                String url = asset.getString("browser_download_url");
                if (!url.equals(REPO + "/releases/download/" + tag + "/" + name)) throw new Exception("The APK address does not match this release.");
                String digest = asset.optString("digest", "");
                if (!digest.matches("sha256:[a-fA-F0-9]{64}")) {
                    digest = "sha256:" + read(url + ".sha256").trim().split("\\s+")[0];
                }
                if (!digest.matches("sha256:[a-fA-F0-9]{64}")) throw new Exception("The APK verification information is missing.");
                latest = new JSONObject(); latest.put("version", version); latest.put("versionCode", versionCode);
                latest.put("size", asset.getLong("size")); latest.put("url", url); latest.put("sha256", digest.substring(7).toLowerCase());
                latest.put("notes", release.optString("body")); latest.put("releaseUrl", REPO + "/releases/tag/" + tag);
                JSObject result = JSObject.fromJSONObject(latest); result.put("available", versionCode > code(installed()));
                call.resolve(result);
            } catch (Exception error) { call.reject(error.getMessage() == null ? "Could not check for updates. Check your connection and try again." : error.getMessage(), error); }
        });
    }
    @PluginMethod public void download(PluginCall call) {
        worker.execute(() -> {
            try {
                if (latest == null || latest.getLong("versionCode") <= code(installed())) throw new Exception("Please check for a new version first.");
                long old = prefs().getLong("id", -1);
                if (old != -1) manager().remove(old);
                File target = apk();
                if (target.exists() && !target.delete()) throw new Exception("Could not remove the old APK. Please try again.");
                DownloadManager.Request request = new DownloadManager.Request(Uri.parse(latest.getString("url")))
                    .setTitle("Kids Box " + latest.getString("version"))
                    .setDescription("When the download finishes, confirm installation in Kids Box App updates.")
                    .setMimeType("application/vnd.android.package-archive")
                    .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                    .setDestinationInExternalFilesDir(getContext(), Environment.DIRECTORY_DOWNLOADS, target.getName());
                long id = manager().enqueue(request);
                prefs().edit().putLong("id", id).putString("release", latest.toString()).remove("verified").remove("error").apply();
                call.resolve(status());
            } catch (Exception error) { call.reject("Could not start download: " + error.getMessage(), error); }
        });
    }
    private Signature[] signatures(PackageInfo info) {
        if (Build.VERSION.SDK_INT >= 28) return info.signingInfo == null ? null : info.signingInfo.getApkContentsSigners();
        return info.signatures;
    }
    private void verify(long id) {
        if (verifying) return;
        verifying = true;
        worker.execute(() -> {
            try {
                JSONObject release = new JSONObject(prefs().getString("release", "{}"));
                File file = apk();
                if (file.length() != release.getLong("size")) throw new Exception("The APK is incomplete. Please download it again.");
                MessageDigest sha = MessageDigest.getInstance("SHA-256");
                try (FileInputStream input = new FileInputStream(file)) {
                    byte[] buffer = new byte[1024 * 128]; int length;
                    while ((length = input.read(buffer)) != -1) sha.update(buffer, 0, length);
                }
                StringBuilder hash = new StringBuilder(); for (byte b : sha.digest()) hash.append(String.format("%02x", b & 255));
                if (!hash.toString().equals(release.getString("sha256"))) throw new Exception("APK verification failed. Please download it again.");
                int flags = Build.VERSION.SDK_INT >= 28 ? PackageManager.GET_SIGNING_CERTIFICATES : PackageManager.GET_SIGNATURES;
                PackageManager pm = getContext().getPackageManager();
                PackageInfo archive = pm.getPackageArchiveInfo(file.getAbsolutePath(), flags);
                PackageInfo current = pm.getPackageInfo(getContext().getPackageName(), flags);
                if (archive == null || !getContext().getPackageName().equals(archive.packageName) || code(archive) != release.getLong("versionCode") || code(archive) <= code(current)) throw new Exception("The APK version or application does not match.");
                Signature[] a = signatures(archive), b = signatures(current);
                if (a == null || b == null || !Arrays.equals(a, b)) throw new Exception("The APK signature does not match. Installation stopped to protect your data.");
                if (prefs().getLong("id", -1) == id) prefs().edit().putLong("verified", id).remove("error").apply();
            } catch (Exception error) { if (prefs().getLong("id", -1) == id) prefs().edit().putString("error", error.getMessage()).apply(); }
            finally { verifying = false; }
        });
    }
    private JSObject status() throws Exception {
        JSObject result = new JSObject(); result.put("state", "idle");
        long id = prefs().getLong("id", -1); if (id == -1) return result;
        JSONObject release = new JSONObject(prefs().getString("release", "{}"));
        if (release.optLong("versionCode") <= code(installed())) { manager().remove(id); prefs().edit().clear().apply(); return result; }
        result.put("version", release.optString("version")); result.put("size", release.optLong("size"));
        if (prefs().contains("error")) { result.put("state", "error"); result.put("message", prefs().getString("error", "Download failed. Please try again.")); return result; }
        try (Cursor cursor = manager().query(new DownloadManager.Query().setFilterById(id))) {
            if (cursor == null || !cursor.moveToFirst()) { result.put("state", "error"); result.put("message", "The download was removed. Please download it again."); return result; }
            int state = cursor.getInt(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_STATUS));
            result.put("downloaded", cursor.getLong(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_BYTES_DOWNLOADED_SO_FAR)));
            long total = cursor.getLong(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_TOTAL_SIZE_BYTES));
            result.put("total", total > 0 ? total : release.getLong("size"));
            if (state == DownloadManager.STATUS_SUCCESSFUL) {
                boolean valid = prefs().getLong("verified", -2) == id;
                result.put("state", valid ? "ready" : "verifying"); if (!valid) verify(id);
            } else if (state == DownloadManager.STATUS_FAILED) {
                result.put("state", "error"); result.put("message", "Download failed. Check your connection and free storage, then try again.");
            } else result.put("state", state == DownloadManager.STATUS_PAUSED ? "paused" : "downloading");
        }
        return result;
    }
    @PluginMethod public void getStatus(PluginCall call) {
        worker.execute(() -> { try { call.resolve(status()); } catch (Exception error) { call.reject("Could not read download status.", error); } });
    }
    @PluginMethod public void cancel(PluginCall call) {
        worker.execute(() -> { long id = prefs().getLong("id", -1); if (id != -1) manager().remove(id); prefs().edit().clear().apply(); call.resolve(); });
    }
    private void openInstaller(PluginCall call) {
        try {
            long id = prefs().getLong("id", -1);
            if (id == -1 || prefs().getLong("verified", -2) != id || !apk().isFile()) throw new Exception("Please finish downloading and verifying first.");
            Uri uri = FileProvider.getUriForFile(getContext(), getContext().getPackageName() + ".fileprovider", apk());
            Intent intent = new Intent(Intent.ACTION_VIEW).setDataAndType(uri, "application/vnd.android.package-archive")
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            getActivity().startActivity(intent);
            JSObject result = new JSObject(); result.put("state", "installer-opened"); call.resolve(result);
        } catch (Exception error) { call.reject("Could not open the system installer: " + error.getMessage(), error); }
    }
    @PluginMethod public void install(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            try {
                if (prefs().getLong("verified", -2) != prefs().getLong("id", -1)) throw new Exception("Please finish downloading and verifying first.");
                if (!allowed()) {
                    Intent intent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:" + getContext().getPackageName()));
                    startActivityForResult(call, intent, "installPermissionResult");
                } else openInstaller(call);
            } catch (Exception error) { call.reject("Allow Kids Box to install updates in system settings.", error); }
        });
    }
    @ActivityCallback private void installPermissionResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (allowed()) openInstaller(call);
        else { JSObject value = new JSObject(); value.put("state", "permission-required"); call.resolve(value); }
    }
    @Override protected void handleOnDestroy() { worker.shutdownNow(); }
}
