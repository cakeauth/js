import { CakeAuth } from "@cakeauth/backend";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIES } from "./constants";

export const getPages = () => {
  return {
    signin: process.env.NEXT_PUBLIC_CAKEAUTH_SIGNOUT_PATH || "/",
    signup: process.env.NEXT_PUBLIC_CAKEAUTH_SIGNOUT_PATH || "/?flow=signup",
    passwordReset:
      process.env.NEXT_PUBLIC_CAKEAUTH_PASSWORD_RESET_PATH ||
      "/?flow=password_reset",
  };
};

export const getPrivateKeyOnServer = () => {
  // TODO: support custom env name
  const key = process.env.CAKEAUTH_PRIVATE_KEY;
  if (!key) {
    throw new Error("CakeAuth: Private key is missing");
  }
  return key;
};

export const redirectToSignin = async (
  url: URL,
  opts?: {
    clearSearchParams?: boolean;
  },
) => {
  const pages = getPages();
  const targetURL = new URL(pages.signin, url.href);
  if (!opts?.clearSearchParams) {
    targetURL.search = url.search;
  }
  return NextResponse.redirect(targetURL, {
    headers: {
      "x-cakeauth-url": url.toString(),
    },
  });
};

export const refreshToken = async () => {
  const cakeauthServer = new CakeAuth({
    privateKey: getPrivateKeyOnServer(),
  });

  // Using Next.js native cookies API
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIES.SESSION_ID)?.value;

  if (!sessionId) {
    return null;
  }

  try {
    const refreshedAccessToken =
      await cakeauthServer.sessions.refreshSessionToken({
        session_id: sessionId,
      });

    if (!refreshedAccessToken.data.token) {
      return null;
    }

    return refreshedAccessToken;
  } catch (e) {
    return null;
  }
};
