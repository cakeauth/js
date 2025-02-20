import React from "react";
import { useCookies } from "react-cookie";
import { useConfig } from "../internals/providers/ConfigProvider";
import useUserStore from "../internals/store/user";
import { COOKIES } from "../internals/utils/constants";

const useUser = (() => {
  let hasFetched = false; // Shared state across all instances of the hook.

  return () => {
    const { cakeauth } = useConfig();
    const [cookies] = useCookies();
    const userId = cookies?.[COOKIES.USER_ID];
    const store = useUserStore(userId, cookies);
    const { initialized, value, state, error, fetch } = store();

    React.useEffect(() => {
      const performFetch = async () => {
        if (initialized && !hasFetched && cakeauth) {
          hasFetched = true;
          try {
            await fetch(cakeauth);
          } finally {
            hasFetched = false;
          }
        }
      };

      performFetch();
    }, [initialized, fetch]);

    return { value, state, error };
  };
})();

export default useUser;
