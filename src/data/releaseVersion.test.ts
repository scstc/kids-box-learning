import { describe, expect, it } from "vitest";
import appVersion from "../../app-version.json";
import { nextReleaseVersion, parseReleaseVersion } from "./releaseVersion";

describe("按年份、季度、发版序号升级", () => {
  it("版本必须是有效季度和正序号，Android版本号与页面使用同一份配置", () => {
    expect(parseReleaseVersion(appVersion.version)).toEqual(appVersion);
    for (const value of ["26.0.1", "26.5.1", "26.4.0", "26.4.10000", "1.5", "26.4.1-extra"]) expect(parseReleaseVersion(value)).toBeNull();
  });
  it("按数字比较版本，避免第十次发版被当成比第二次旧", () => {
    const code=(value:string)=>parseReleaseVersion(value)!.versionCode;
    expect(code("26.4.10")).toBeGreaterThan(code("26.4.2"));
    expect(code("27.1.1")).toBeGreaterThan(code("26.4.9999"));
    expect(code("26.4.1")).toBeGreaterThan(6); // Existing 1.5 installations must accept the new scheme.
  });
  it("中国时区进入新季度会从第一次发版开始，同一季度则递增", () => {
    expect(nextReleaseVersion("26.4.1",new Date("2026-11-08T12:00:00Z"))).toBe("26.4.2");
    expect(nextReleaseVersion("26.3.9",new Date("2026-09-30T16:00:00Z"))).toBe("26.4.1");
    expect(nextReleaseVersion("26.4.9",new Date("2026-12-31T16:00:00Z"))).toBe("27.1.1");
  });
});
