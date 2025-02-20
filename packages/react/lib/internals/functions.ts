"use client";

import { CakeAuth } from "@cakeauth/frontend";
import { COOKIES } from "./utils/constants";

const deleteCookies = (
  cookies: {
    [x: string]: any;
  },
  deleteCookie: (key: string) => void,
) => {
  const sessionId = cookies?.[COOKIES.SESSION_ID];
  deleteCookie(COOKIES.SESSION_ID);
  deleteCookie(COOKIES.USER_ID);
  deleteCookie(COOKIES.ACCESS_TOKEN(sessionId || ""));
};

export const revokeSession = async (
  cakeauth: CakeAuth,
  cookies: {
    [x: string]: any;
  },
  deleteCookie: (key: string) => void,
): Promise<void> => {
  try {
    // FIXME: assuming those cookies exist
    const sessionId = cookies?.[COOKIES.SESSION_ID];
    const accessToken = cookies?.[COOKIES.ACCESS_TOKEN(sessionId)];

    if (!accessToken) {
      deleteCookies(cookies, deleteCookie);
      return;
    }

    await cakeauth.sessions.revokeSession({
      accessToken,
    });
    deleteCookies(cookies, deleteCookie);
  } catch (e) {
    deleteCookies(cookies, deleteCookie);
  }
};

// FIXME: hooks unsync
export const refreshToken = async (
  cakeauth: CakeAuth,
  setCookie: (name: string, value: any, options?: any) => void,
) => {
  try {
    const response = await cakeauth.sessions.refreshAccessToken();

    if (response.status !== 200) {
      throw new Error(response.error.message);
    }

    if (response.data) {
      const sessionExpires = response.data.expires_at
        ? new Date(response.data.expires_at)
        : new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

      setCookie(COOKIES.SESSION_ID, response?.data?.id, {
        expires: sessionExpires,
        domain: response?.data?.token?.domain,
      });
      setCookie(COOKIES.USER_ID, response?.data?.user?.id, {
        expires: sessionExpires,
        domain: response?.data?.token?.domain,
      });
      setCookie(response.data.token.name, response.data.token.value, {
        expires: new Date(response.data.token.expires_at),
        domain: response?.data?.token?.domain,
      });

      return response;
    } else {
      throw new Error(response.error?.message);
    }
  } catch (e) {
    throw e;
  }
};
