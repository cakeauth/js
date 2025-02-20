import { CakeAuth, CakeAuthErrorResponse } from "@cakeauth/frontend";
import { State } from "./store/state";

export type CacheEntry<T> = {
  value: T | null;
  timestamp: number;
};

export type CacheStore<T, U = CakeAuthErrorResponse> = {
  value: T | null;
  initialized: boolean;
  setInitialized: (value: boolean) => void;
  timestamp: number | null;
  state: State;
  error: U | null;
  fetch: (cakeauth: CakeAuth) => Promise<void>;
  clear: () => void;
};
