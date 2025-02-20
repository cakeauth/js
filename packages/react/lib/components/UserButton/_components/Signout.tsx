"use client";
import React from "react";
import { Loader2, LogOut } from "lucide-react";
import useSignout from "../../../hooks/useSignout";
import { DropdownMenuItem } from "../../../internals/ui/primitives/DropdownMenu";

const Signout = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const signoutHook = useSignout(); // Keep this outside of any callback or condition
  const { state: signoutState, signout } = signoutHook; // Destructure directly here

  const handleSignout = React.useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      if (isLoading) return;
      setIsLoading(true);
      try {
        await signout();
      } catch (error) {
        console.error("Signout error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, signout], // Use signout directly as the dependency
  );

  const showLoader =
    isLoading || signoutState === "loading" || signoutState === "unauthorized";

  return (
    <DropdownMenuItem
      onClick={handleSignout}
      className="cursor-pointer px-3 py-3 text-muted-foreground group"
    >
      {showLoader ? (
        <Loader2 className="w-5 text-muted-foreground group-hover:text-destructive animate-spin" />
      ) : (
        <LogOut className="w-5 text-muted-foreground group-hover:text-destructive" />
      )}
      Sign Out
    </DropdownMenuItem>
  );
};

export default Signout;
