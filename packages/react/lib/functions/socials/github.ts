export type GitHubOAuthStatePayload = {
  origin: string;
  csrf_token: string;
  provider: "github";
  user_agent?: string;
  public_key: string;
};

const getOAuthAttemptState = (opts: GitHubOAuthStatePayload) =>
  encodeURIComponent(JSON.stringify(opts));

export const getGitHubOAuthUrl = (opts: {
  clientId: string;
  redirectUri: string;
  scope?: string[];
  config: GitHubOAuthStatePayload;
}): string => {
  const base = new URL("https://github.com/login/oauth/authorize");
  base.searchParams.set("client_id", opts.clientId);
  base.searchParams.set("redirect_uri", opts.redirectUri);
  base.searchParams.set("response_type", "code");

  // Set scopes with defaults if not provided
  if (opts.scope) {
    base.searchParams.set("scope", opts.scope.join(" "));
  } else {
    base.searchParams.set("scope", "user:email read:user");
  }

  base.searchParams.set("state", getOAuthAttemptState(opts.config));

  return base.href;
};
