"use client";

import { getGitHubOAuthUrl } from "./github";
import { getGoogleOAuthUrl } from "./google";

const getOAuthUrl = (opts: {
  provider: string;
  clientId: string | null | undefined;
  redirectUri: string | null | undefined;
  scopes: string[];
  publicKey: string;
}): string | null => {
  const { provider, clientId, redirectUri, scopes } = opts;
  if (!provider || !clientId || !redirectUri || !scopes) {
    return null;
  }

  if (provider === "google") {
    const target = getGoogleOAuthUrl({
      clientId: clientId,
      redirectUri: redirectUri,
      scope: scopes,
      config: {
        origin: window.location.origin,
        csrf_token: crypto.randomUUID(),
        provider: "google",
        user_agent: navigator.userAgent,
        public_key: opts.publicKey,
      },
    });

    return target;
  }

  if (provider === "github") {
    const target = getGitHubOAuthUrl({
      clientId: clientId,
      redirectUri: redirectUri,
      scope: scopes,
      config: {
        origin: window.location.origin,
        csrf_token: crypto.randomUUID(),
        provider: "github",
        user_agent: navigator.userAgent,
        public_key: opts.publicKey,
      },
    });

    return target;
  }

  return null;
};

export default getOAuthUrl;
