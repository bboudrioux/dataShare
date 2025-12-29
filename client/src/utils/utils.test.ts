import { getExpiryLabel } from "./date";
import formatBytes from "./formatBytes";

describe("Utils - formatBytes", () => {
  it("doit formater les octets correctement", () => {
    expect(formatBytes(0)).toBe("0 Bytes");
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(1048576)).toBe("1 MB");
  });
});

describe("Utils - date", () => {
  it("doit retourner le bon label d'expiration", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const past = new Date();
    past.setDate(past.getDate() - 1);

    expect(getExpiryLabel(tomorrow.toISOString())).toContain("Expire");
    expect(getExpiryLabel(past.toISOString())).toBe("Expiré");
  });
});
