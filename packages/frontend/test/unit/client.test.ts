import { describe, expect, it } from "vitest";
import { CakeAuth } from "../../src/client";

describe("CakeAuth", () => {
  describe("keys", async () => {
    it("should throw error when using private key", () => {
      expect(
        () =>
          new CakeAuth({
            publicKey: "sec_test_xxxx",
            url: "https://test.cakeauth.app",
          }),
      ).toThrowError(
        "You are using a private key (`sec_...`) for interacting with the frontend APIs. Please use a public key (`pub_...`) instead!",
      );
    });

    it("should not throw error when using public key", () => {
      expect(
        () =>
          new CakeAuth({
            publicKey: "pub_test_xxxx",
            url: "https://test.cakeauth.app",
          }),
      ).not.toThrow();
    });
  });
});
