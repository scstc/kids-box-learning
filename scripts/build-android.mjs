import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const env = { ...process.env };
if (env.ANDROID_JAVA_HOME) env.JAVA_HOME = env.ANDROID_JAVA_HOME;
if (process.platform === "win32" && !env.ANDROID_JAVA_HOME) {
  const bundled = path.join(
    env.USERPROFILE ?? "",
    "scoop/apps/temurin21-jdk/current",
  );
  if (existsSync(path.join(bundled, "bin/java.exe"))) env.JAVA_HOME = bundled;
}
const pathKey =
  Object.keys(env).find((key) => key.toLowerCase() === "path") ?? "PATH";
if (env.JAVA_HOME)
  env[pathKey] =
    path.join(env.JAVA_HOME, "bin") + path.delimiter + (env[pathKey] ?? "");
const windowsShell =
  env.ComSpec ?? path.join(env.SystemRoot ?? "C:/Windows", "System32/cmd.exe");
const result = spawnSync(
  process.platform === "win32" ? windowsShell : "./gradlew",
  process.platform === "win32"
    ? ["/c", "gradlew.bat", "assembleDebug", "--no-daemon"]
    : ["assembleDebug", "--no-daemon"],
  { cwd: path.join(root, "android"), env, stdio: "inherit" },
);
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
const directory = path.join(root, "downloads");
mkdirSync(directory, { recursive: true });
const output = path.join(directory, "kids-box-learning-debug.apk");
copyFileSync(
  path.join(root, "android/app/build/outputs/apk/debug/app-debug.apk"),
  output,
);
console.log(`Android APK: ${output}`);
