"use client";

import useStateStore from "../internals/store/state";

const CakeAuthLoaded = ({ children }: { children: React.ReactNode }) => {
  const { state } = useStateStore();

  if (state !== "loading") {
    return <>{children}</>;
  }

  return null;
};

export default CakeAuthLoaded;
