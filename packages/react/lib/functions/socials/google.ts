export type GoogleOAuthStatePayload = {
  origin: string;
  csrf_token: string;
  provider: "google";
  user_agent?: string;
  public_key: string;
};

const getOAuthAttemptState = (opts: GoogleOAuthStatePayload) =>
  encodeURIComponent(JSON.stringify(opts));

export const getGoogleOAuthUrl = (opts: {
  clientId: string;
  redirectUri: string;
  scope?: string[];
  access_type?: "offline" | "online";
  config: GoogleOAuthStatePayload;
}): string => {
  const base = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  base.searchParams.set("client_id", opts.clientId);
  base.searchParams.set("redirect_uri", opts.redirectUri);
  base.searchParams.set("response_type", "code");
  base.searchParams.set("state", getOAuthAttemptState(opts.config));
  if (opts.scope) {
    base.searchParams.set("scope", opts.scope?.join(" "));
  } else {
    base.searchParams.set(
      "scope",
      "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
    );
  }
  base.searchParams.set("access_type", opts.access_type || "offline");

  return base.href;
};
