"use client";

import useStateStore from "../internals/store/state";

const CakeAuthLoading = ({ children }: { children: React.ReactNode }) => {
  const { state } = useStateStore();

  if (state === "loading") {
    return <>{children}</>;
  }

  return null;
};

export default CakeAuthLoading;
