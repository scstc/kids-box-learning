import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { readFileSync, createReadStream, writeFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { parseReleaseVersion } from "../src/data/releaseVersion.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const release = process.argv.includes("--release");
const version = JSON.parse(readFileSync(path.join(root, "app-version.json"), "utf8"));
if (parseReleaseVersion(version.version)?.versionCode !== version.versionCode) throw new Error("app-version.json has an invalid versionCode.");
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
    ? ["/c", "gradlew.bat", release ? "assembleRelease" : "assembleDebug", "--no-daemon"]
    : [release ? "assembleRelease" : "assembleDebug", "--no-daemon"],
  { cwd: path.join(root, "android"), env, stdio: "inherit" },
);
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
const directory = path.join(root, "downloads");
mkdirSync(directory, { recursive: true });
const output = path.join(directory, release ? `kids-box-learning-${version.version}.apk` : "kids-box-learning-debug.apk");
copyFileSync(
  path.join(root, `android/app/build/outputs/apk/${release ? "release/app-release" : "debug/app-debug"}.apk`),
  output,
);
console.log(`Android APK: ${output}`);
if (release) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(output)) hash.update(chunk);
  const sha256 = hash.digest("hex");
  writeFileSync(`${output}.sha256`, `${sha256}  ${path.basename(output)}\n`);
  const { size } = statSync(output);
  writeFileSync(path.join(directory, "update.json"), JSON.stringify({
    tag_name: `v${version.version}`, draft: false, prerelease: false,
    body: readFileSync(path.join(root, "releases/notes.md"), "utf8"),
    assets: [{ name: path.basename(output), size, digest: `sha256:${sha256}`, browser_download_url: `https://github.com/scstc/kids-box-learning/releases/download/v${version.version}/${path.basename(output)}` }],
  }, null, 2) + "\n");
}
