import { CakeAuth } from "@cakeauth/frontend";
import React from "react";
import { useCookies } from "react-cookie";
import { refreshToken as refreshTokenFn } from "../internals/functions";
import { State } from "../internals/store/state";
import { COOKIES } from "../internals/utils/constants";

const REFRESH_INTERVAL = 45 * 1000;
const MAX_FAILED_ATTEMPTS = 3;

const useRefreshAccessToken = ({ cakeauth }: { cakeauth: CakeAuth }) => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const sessionId = cookies?.[COOKIES.SESSION_ID];
  const accessToken = cookies?.[COOKIES.ACCESS_TOKEN(sessionId)];
  const userId = cookies?.[COOKIES.USER_ID];

  const [state, setState] = React.useState<State>("idle");
  const [error, setError] = React.useState<Error | null>(null);
  const [failedAttempts, setFailedAttempts] = React.useState(0);

  const signout = React.useCallback(async () => {
    try {
      const accessToken = cookies?.[COOKIES.ACCESS_TOKEN(sessionId)];
      if (accessToken) {
        await cakeauth.sessions.revokeSession({ accessToken });
      }

      removeCookie(COOKIES.ACCESS_TOKEN(sessionId));
      removeCookie(COOKIES.SESSION_ID);
      removeCookie(COOKIES.USER_ID);

      setState("unauthorized");
      setError(null);
    } catch (e) {
      removeCookie(COOKIES.ACCESS_TOKEN(sessionId));
      removeCookie(COOKIES.SESSION_ID);
      removeCookie(COOKIES.USER_ID);

      setState("unauthorized");
      setError(e as Error);
    }
  }, [cookies, cakeauth, removeCookie, sessionId]);

  const refreshToken = React.useCallback(async () => {
    if (state === "loading") return;

    setState("loading");
    setError(null);

    try {
      await refreshTokenFn(cakeauth, setCookie);

      setState("idle");
      setError(null);
      setFailedAttempts(0);
    } catch (e) {
      setState("error");
      setError(e as Error);

      setFailedAttempts((prev) => prev + 1);

      if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
        await signout();
      }
    }
  }, [state, setCookie, signout, failedAttempts, cakeauth]);

  React.useEffect(() => {
    if (sessionId && (!userId || !accessToken)) {
      refreshToken();
    }
  }, [sessionId, refreshToken, userId, accessToken]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      if (state !== "loading" && sessionId) {
        refreshToken();
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [state, sessionId, accessToken, userId, refreshToken]);

  return {
    state,
    error,
  };
};

export default useRefreshAccessToken;
