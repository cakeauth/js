"use client";

import React from "react";
import { useConfig } from "../internals/providers/ConfigProvider";
import useSettingsStore from "../internals/store/settings";

const useSettings = (() => {
  let hasFetched = false; // Shared state across all instances of the hook.

  return () => {
    const { cakeauth } = useConfig();
    const { initialized, value, state, error, fetch } = useSettingsStore();

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

export default useSettings;
