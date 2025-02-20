"use client";
import { CakeAuthErrorResponse } from "@cakeauth/frontend";
import { PostMeResetPasswordBody } from "@cakeauth/frontend/types";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, Lock, PartyPopper, PencilLine } from "lucide-react";
import React from "react";
import useSession from "../../../hooks/useSession";
import { useConfig } from "../../../internals/providers/ConfigProvider";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../internals/ui/primitives/Alert";
import { Button } from "../../../internals/ui/primitives/Button";
import { Checkbox } from "../../../internals/ui/primitives/Checkbox";
import { Input } from "../../../internals/ui/primitives/Input";

const ResetPassword = () => {
  const { cakeauth } = useConfig();
  const session = useSession();
  const [open, setOpen] = React.useState(false);
  const [revokeOtherSession, setRevokeOtherSession] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isResetted, setIsResetted] = React.useState(false);

  React.useEffect(() => {
    if (isResetted) {
      const timer = setTimeout(() => {
        setIsResetted(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isResetted]);

  const resetPassword = useMutation({
    mutationKey: ["signin", "resetPassword"],
    mutationFn: async (opts: {
      authorization: {
        accessToken: string;
      };
      body: PostMeResetPasswordBody;
    }) => cakeauth.me.resetPassword(opts.body, opts.authorization),
    onSuccess: () => {
      setIsResetted(true);
      setOpen(false);
      setError(null);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setRevokeOtherSession(false);
      resetPassword.reset();
    },
    onError: (err: CakeAuthErrorResponse) => {
      setError(err.error?.message || "Something went wrong!");
    },
  });

  if (open) {
    return (
      <div className="bg-muted w-full rounded p-2 border border-border">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              {error || "Something went wrong!"}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2 mb-4">
          <Input
            placeholder="Current Password"
            className="bg-white"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <div className="flex items-center justify-between space-x-2">
            <Input
              placeholder="New Password"
              className="bg-white"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              placeholder="Confirm Password"
              className="bg-white"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 bg-white p-2 rounded border border-border">
            <Checkbox
              id="revoke"
              checked={revokeOtherSession}
              onCheckedChange={(e) => setRevokeOtherSession(e as boolean)}
            />
            <label
              htmlFor="revoke"
              className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
            >
              Revoke other sessions
            </label>
          </div>

          <div className="flex items-end justify-end gap-2">
            <Button
              variant="outline"
              disabled={resetPassword.isPending}
              onClick={() => {
                setOpen(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setRevokeOtherSession(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border border-destructive/70 text-destructive hover:text-destructive hover:bg-destructive/5 py-1.5 h-auto"
              disabled={resetPassword.isPending}
              onClick={() => {
                if (!currentPassword) {
                  setError("Please enter your current password!");
                  return;
                }

                if (newPassword !== confirmPassword) {
                  setError("Passwords do not match!");
                  return;
                }

                setError(null);

                resetPassword.mutate({
                  authorization: {
                    accessToken: session?.value?.accessToken!,
                  },
                  body: {
                    new_password: newPassword,
                    current_password: currentPassword,
                    revoke_other_sessions: true,
                  },
                });
              }}
            >
              <PencilLine className="text-destructive-foreground-foreground/70 w-3" />
              Reset My Password
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!open) {
    return (
      <div>
        <Button variant="outline" onClick={() => setOpen(true)}>
          {isResetted ? (
            <PartyPopper className="text-blue-800/70" />
          ) : (
            <Lock className="text-muted-foreground/70" />
          )}
          {isResetted ? "Password Successfully Resetted" : "Reset Password"}
        </Button>
      </div>
    );
  }
};

export default ResetPassword;
