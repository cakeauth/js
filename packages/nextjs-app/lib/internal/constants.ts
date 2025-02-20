export const SEARCH_PARAMS = {
  ATTEMPT: "__cakeauth_attempt",
  TOKEN: "__cakeauth_token",
  HANDSHAKE_ID: "__cakeauth_handshake",
  ERROR: "error",
};

export const COOKIES = {
  SESSION_ID: "__session",
  USER_ID: "__uid",
  ACCESS_TOKEN: (id: string) => `__client.${id}`,
};

export const CACHE_TTL = 59 * 1000;
export const CACHE_KEYS = {
  USER: (id: string) => `user.${id}`,
  SETTINGS: "settings",
};
