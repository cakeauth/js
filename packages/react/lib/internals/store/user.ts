"use client";
import { CakeAuth, CakeAuthErrorResponse } from "@cakeauth/frontend";
import { GetMeResponseItem } from "@cakeauth/frontend/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CacheStore } from "../types";
import { CACHE_KEYS, CACHE_TTL, COOKIES } from "../utils/constants";

// Create the store once, outside of the function
export const createUserStore = (
  userId: string,
  cookies: {
    [x: string]: any;
  },
) =>
  create(
    persist<CacheStore<GetMeResponseItem>>(
      (set, get) => ({
        value: null,
        state: "idle",
        error: null,
        initialized: false,
        setInitialized: (value: boolean) => set({ initialized: value }),
        timestamp: null,
        clear: () => {
          const currentName = CACHE_KEYS.USER(userId || "anonymous");
          if (currentName) {
            sessionStorage.removeItem(currentName);
          }
        },
        fetch: async (cakeauth: CakeAuth) => {
          const state = get();

          if (
            state.value &&
            state.timestamp &&
            Date.now() - state.timestamp < CACHE_TTL
          ) {
            return;
          }

          set({ state: "loading" });

          try {
            const sessionId = cookies?.[COOKIES.SESSION_ID];
            const accessToken = cookies?.[COOKIES.ACCESS_TOKEN(sessionId)];

            const user = await cakeauth.me.getInfo({
              accessToken,
            });

            if (user.data) {
              set({
                value: user.data,
                state: "idle",
                error: null,
                timestamp: Date.now(),
              });
            } else {
              set({
                value: null,
                state: "error",
                error: {
                  ...user,
                  error: user?.error!,
                  data: null,
                },
                timestamp: Date.now(),
              });
            }
          } catch (e) {
            const error = e as CakeAuthErrorResponse;
            set({
              error,
              value: null,
              state: "error",
              timestamp: Date.now(),
            });
          }
        },
      }),
      {
        name: CACHE_KEYS.USER(userId || "anonymous"),
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

// Maintain a single instance of the store
let userStore: ReturnType<typeof createUserStore> | null = null;

// Hook to access the store
export const useUserStore = (userId: string, cookies: { [x: string]: any }) => {
  if (
    !userStore ||
    userStore?.persist?.getOptions().name !==
      CACHE_KEYS.USER(userId || "anonymous")
  ) {
    userStore = createUserStore(userId, cookies);
  }
  return userStore;
};

export default useUserStore;
