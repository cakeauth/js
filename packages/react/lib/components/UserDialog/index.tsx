"use client";

import { Loader2, LogOut, MonitorSmartphone, User } from "lucide-react";
import React from "react";
import useSignout from "../../hooks/useSignout";
import { cn } from "../../internals/ui/cn";
import { Icons } from "../../internals/ui/icons";
import { Button } from "../../internals/ui/primitives/Button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../internals/ui/primitives/Dialog";
import Profile from "./_components/Profile";
import Sessions from "./_components/Sessions";

const SidebarItem = ({
  icon,
  label,
  onClick,
  isActive,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
}) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "group flex items-center justify-start gap-2 h-auto rounded-sm px-2 py-2.5 hover:bg-stone-200",
        isActive && "bg-stone-200",
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      <p
        className={cn(
          "group-hover:text-primary extra-muted font-normal ",
          isActive && "text-primary",
        )}
      >
        {label}
      </p>
    </Button>
  );
};

const UserDialog = ({
  open,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"profile" | "sessions">(
    "profile",
  );
  const signoutHook = useSignout();

  const handleSignout = React.useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await signoutHook.signout();
    } catch (error) {
      console.error("Signout error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, signoutHook]);

  const showLoader =
    isLoading ||
    signoutHook.state === "loading" ||
    signoutHook.state === "unauthorized";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-stone-100 grid grid-cols-8 top-[30%] max-w-full w-full lg:w-3/4 xl:w-1/2 rounded-md p-2">
        <DialogTitle className="hidden" />
        <div className="col-span-2 p-1 h-[480px] flex flex-col items-start justify-between">
          <div>
            <p className="p text-lg font-medium text-primary">Your Account</p>
            <p className="extra-muted">Manage your data, sessions, and more.</p>
            <div className="flex flex-col gap-2 mt-4">
              <SidebarItem
                icon={
                  <User className="w-5 text-muted-foreground group-hover:text-primary" />
                }
                label="Profile"
                onClick={() => setActiveTab("profile")}
                isActive={activeTab === "profile"}
              />
              <SidebarItem
                icon={
                  <MonitorSmartphone className="w-5 text-muted-foreground group-hover:text-primary" />
                }
                label="Sessions"
                onClick={() => setActiveTab("sessions")}
                isActive={activeTab === "sessions"}
              />
              <SidebarItem
                icon={
                  showLoader ? (
                    <Loader2 className="w-5 text-muted-foreground group-hover:text-destructive animate-spin" />
                  ) : (
                    <LogOut className="w-5 text-muted-foreground group-hover:text-destructive" />
                  )
                }
                label="Sign Out"
                onClick={handleSignout}
                disabled={showLoader}
              />
            </div>
          </div>
          <div className="py-2.5 items-center justify-center mt-2 border-t border-t-gray-100 w-full">
            <div className="flex items-center justify-center gap-2">
              <p className="text-center text-muted-foreground/60 muted">
                Secured with
              </p>
              <div className="flex items-center justify-center gap-1">
                <Icons.Logo className="w-5 opacity-80" />
                <a
                  href="https://cakeauth.com/&utm_campaign=secured_by"
                  className="hover:underline text-center small text-muted-foreground font-medium"
                  target="_blank"
                >
                  CakeAuth
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-6 bg-background border border-border rounded-md p-4">
          {activeTab === "profile" && <Profile />}
          {activeTab === "sessions" && <Sessions />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
