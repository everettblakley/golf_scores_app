import { valueOrNull } from "~/app/shared/utils/utils";

describe("Value Or Null Method", () => {
  it("returns number if assigned", () => {
    let n: number;
    let result = valueOrNull(n);
    expect(result).toBeNull();
    n = 10;
    result = valueOrNull(n);
    expect(result).toEqual(10);
  });

  it("returns string if assigned", () => {
    let s: string;
    let result = valueOrNull(s);
    expect(result).toBeNull();
    s = "test";
    result = valueOrNull(s);
    expect(result).toEqual("test");
  });

  it("returns value for falsy values", () => {
    let result = valueOrNull({});
    expect(result).toEqual({});
    result = valueOrNull("");
    expect(result).toEqual("");
    result = valueOrNull(false);
    expect(result).toEqual(false);
    result = valueOrNull(0);
    expect(result).toEqual(0);
  });

  it("returns null for undefined", () => {
    let u = undefined;
    const result = valueOrNull(u);
    expect(result).toBeNull();
  })
})