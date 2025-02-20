"use client";

import { CakeAuthErrorResponse } from "@cakeauth/frontend";
import { create } from "zustand";

export type State = "loading" | "idle" | "error" | "unauthorized";
export type StateStore = {
  state: State;
  error: CakeAuthErrorResponse | null;
  setState: (states: State[]) => void;
  setError: (error: CakeAuthErrorResponse | null) => void;
};

export const useStateStore = create<StateStore>((set, get) => ({
  state: "idle",
  error: null,
  setState: (states: State[]) => {
    const state = get();
    // Ensure valid states are passed
    const grouped = states.reduce<Record<State, number>>(
      (acc, curr) => {
        if (acc[curr] !== undefined) acc[curr]++;
        return acc;
      },
      { idle: 0, loading: 0, error: 0, unauthorized: 0 },
    );

    if (grouped.error > 0) {
      if (state.state === "error") return;
      return set({ state: "error" });
    }

    if (grouped.unauthorized > 0) {
      if (state.state === "unauthorized") return;
      return set({ state: "unauthorized" });
    }

    if (grouped.loading > 0) {
      if (state.state === "loading") return;
      return set({ state: "loading" });
    }

    if (state.state === "idle") return;
    return set({ state: "idle" });
  },
  setError: (error: CakeAuthErrorResponse | null) => set({ error }),
}));

export default useStateStore;
