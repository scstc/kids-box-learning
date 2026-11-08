import { describe, expect, it } from "vitest";
import { matchesSpelling } from "./spelling";

describe("关闭字母提示后按输入检查，而不是要求与提示长度相同", () => {
  it("忽略大小写、边缘空白和教材复合词分隔符", () => {
    expect(matchesSpelling(" GIRAFFE ", "giraffe")).toBe(true);
    expect(matchesSpelling("tshirt", "T-shirt")).toBe(true);
    expect(matchesSpelling("icecream", "ice cream")).toBe(true);
    expect(matchesSpelling("living room", "living room")).toBe(true);
  });
  it("漏字母、多字母和混入其他字符仍是拼写错误", () => {
    expect(matchesSpelling("girafe", "giraffe")).toBe(false);
    expect(matchesSpelling("giraffee", "giraffe")).toBe(false);
    expect(matchesSpelling("giraffe!", "giraffe")).toBe(false);
    expect(matchesSpelling("giraff3e", "giraffe")).toBe(false);
    expect(matchesSpelling("", "giraffe")).toBe(false);
  });
});
