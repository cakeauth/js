import { CakeAuth, CakeAuthErrorResponse } from "@cakeauth/frontend";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { State } from "../internals/store/state";
import { COOKIES, SEARCH_PARAMS } from "../internals/utils/constants";

// URL manipulation utilities
const updateURLParams = (updates: {
  remove?: string[];
  set?: { [key: string]: string };
}) => {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);

  // Remove specified parameters
  updates.remove?.forEach((param) => {
    url.searchParams.delete(param);
  });

  // Set new parameter values
  if (updates.set) {
    Object.entries(updates.set).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  window.history.replaceState({}, "", url.toString());
  window.location.reload();
};

const useHandshakeExchange = ({ cakeauth }: { cakeauth: CakeAuth }) => {
  const [, setCookie] = useCookies();
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<Error | null>(null);

  const handleSuccessfulResponse = (response: any) => {
    const sessionExpires = response.data.expires_at
      ? new Date(response.data.expires_at)
      : new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    // Set cookies
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

    // Clear handshake and error params
    updateURLParams({
      remove: [SEARCH_PARAMS.HANDSHAKE_ID, SEARCH_PARAMS.ERROR],
    });
  };

  const handleError = (error: unknown) => {
    const e = error as CakeAuthErrorResponse;
    setState("error");
    setError(error as Error);
    updateURLParams({
      remove: [SEARCH_PARAMS.HANDSHAKE_ID],
      set: {
        [SEARCH_PARAMS.ERROR]: e?.error?.message || "Something went wrong",
      },
    });
  };

  const handshake = React.useCallback(
    async (handshakeId: string) => {
      if (!handshakeId) return;

      setState("loading");
      setError(null);

      try {
        const response = await cakeauth.sessions.exchangeHandshakeId({
          handshake_id: handshakeId,
        });

        if (response.data) {
          handleSuccessfulResponse(response);

          setError(null);
        } else {
          handleError(response.error);
        }
      } catch (e) {
        handleError(e);
      }
    },
    [setCookie],
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const handshakeId = params.get(SEARCH_PARAMS.HANDSHAKE_ID);
      if (handshakeId) {
        handshake(handshakeId);
      }
    }
  }, [handshake]);

  return {
    state,
    error,
  };
};

export default useHandshakeExchange;
