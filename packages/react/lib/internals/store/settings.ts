"use client";

import { CakeAuth, CakeAuthErrorResponse } from "@cakeauth/frontend";
import { GetSettingsResponse } from "@cakeauth/frontend/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CacheStore } from "../types";
import { CACHE_KEYS, CACHE_TTL } from "../utils/constants";

export const useSettingsStore = create(
  persist<CacheStore<GetSettingsResponse>>(
    (set, get) => ({
      value: null,
      state: "idle",
      error: null,
      initialized: false,
      setInitialized: (value: boolean) => set({ initialized: value }),
      timestamp: null,
      clear: () => {
        const currentName = useSettingsStore?.persist?.getOptions().name;
        if (currentName) {
          sessionStorage.removeItem(currentName);
        }
      },
      fetch: async (cakeauth: CakeAuth) => {
        const state = get();

        if (
          state.state === "loading" ||
          (state.state === "idle" &&
            state.timestamp &&
            Date.now() - state.timestamp < CACHE_TTL)
        ) {
          return;
        }

        try {
          const settings = await cakeauth.settings.list();

          if (settings.data) {
            set({ ...state, state: "loading" });
            useSettingsStore.persist.setOptions({
              name: CACHE_KEYS.SETTINGS,
            });
            set({
              ...state,
              value: settings,
              state: "idle",
              timestamp: Date.now(),
            });
            return;
          }

          set({ ...state, state: "idle" });
        } catch (e) {
          const error = e as CakeAuthErrorResponse;
          set({ ...state, error, state: "error", timestamp: Date.now() });
        }
      },
    }),
    {
      name: CACHE_KEYS.SETTINGS,
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Check if rehydrated data is stale
          if (state.timestamp && Date.now() - state.timestamp >= CACHE_TTL) {
            // Reset the store if data is stale
            state.value = null;
            state.state = "idle";
            state.error = null;
            state.timestamp = null;
          }

          state.setInitialized(true);
        }
      },
    },
  ),
);

export default useSettingsStore;
