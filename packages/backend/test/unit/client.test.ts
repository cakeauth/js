import { describe, expect, it } from "vitest";
import { CakeAuth } from "../../src/client";

describe("CakeAuth", () => {
  describe("keys", async () => {
    it("should throw error when using public key", () => {
      expect(
        () =>
          new CakeAuth({
            privateKey: "pub_test_xxxx",
          }),
      ).toThrowError(
        "You are using a public key (`pub_...`) for interacting with the backend APIs. Please use a private key (`sec_...`) instead!",
      );
    });

    it("should not throw error when using private key", () => {
      expect(
        () =>
          new CakeAuth({
            privateKey: "sec_test_xxxx",
          }),
      ).not.toThrow();
    });
  });
});
