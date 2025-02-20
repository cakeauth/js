"use client";

import React from "react";
import { useCookies } from "react-cookie";
import { revokeSession } from "../internals/functions";
import { useConfig } from "../internals/providers/ConfigProvider";
import { State } from "../internals/store/state";
import useUserStore from "../internals/store/user";
import { COOKIES } from "../internals/utils/constants";

const useSignout = () => {
  const { cakeauth } = useConfig();
  const [cookies, , deleteCookie] = useCookies();
  const { clear } = useUserStore(cookies?.[COOKIES.USER_ID], cookies)();
  const [state, setState] = React.useState<State>("idle");
  const [error, setError] = React.useState<Error | null>(null);

  const signout = async () => {
    if (!cakeauth) return;
    setState("loading");

    try {
      await revokeSession(cakeauth, cookies, deleteCookie);

      setState("unauthorized");
      setError(null);
      clear();
    } catch (e) {
      console.error("Signout Error:", e);
      setState("error");
      setError(e as Error);
      clear();
    }
  };

  return {
    state,
    error,
    signout,
  };
};

export default useSignout;
