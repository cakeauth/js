"use client";

import { useEffect, useState } from "react";
import useSession from "../hooks/useSession";

const SignedIn = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);
  const session = useSession();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !session.isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default SignedIn;
