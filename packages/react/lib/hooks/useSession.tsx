"use client";

import { useCookies } from "react-cookie";
import { State } from "../internals/store/state";
import { COOKIES } from "../internals/utils/constants";

const useSession = (): {
  isAuthenticated: boolean;
  state: State;
  error: Error | null;
  value: {
    sessionId: string;
    userId: string;
    accessToken: string;
  } | null;
} => {
  const [cookies] = useCookies();
  const sessionId = cookies?.[COOKIES.SESSION_ID];

  if (!sessionId) {
    return {
      isAuthenticated: false,
      state: "unauthorized",
      error: null,
      value: null,
    };
  }

  let userId = cookies?.[COOKIES.USER_ID];
  let accessToken = cookies?.[COOKIES.ACCESS_TOKEN(sessionId)];

  if (!sessionId) {
    return {
      isAuthenticated: false,
      state: "unauthorized",
      error: null,
      value: null,
    };
  }

  return {
    isAuthenticated: true,
    state: "idle",
    error: null,
    value: {
      sessionId,
      userId: userId as string,
      accessToken: accessToken as string,
    },
  };
};

export default useSession;
