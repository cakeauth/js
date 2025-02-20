"use client";

import { CakeAuthErrorResponse } from "@cakeauth/frontend";
import {
  PostVerifyResetPasswordAttemptBody,
  PostVerifyResetPasswordAttemptParams,
} from "@cakeauth/frontend/types";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, ArrowRight, Inbox, Loader2 } from "lucide-react";
import React from "react";
import { useConfig } from "../../../internals/providers/ConfigProvider";
import { StateStore } from "../../../internals/store/state";
import { cn } from "../../../internals/ui/cn";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../internals/ui/primitives/Alert";
import {
  Button,
  buttonVariants,
} from "../../../internals/ui/primitives/Button";
import { Input } from "../../../internals/ui/primitives/Input";

const ErrorAlert = ({ error }: { error: string | null }) => {
  if (error) {
    return (
      <Alert variant="destructive" className="-mt-2">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>{error || "Something went wrong!"}</AlertDescription>
      </Alert>
    );
  }
};

const NewPasswordForm = ({
  attemptId,
  token,
}: {
  attemptId: string;
  token: string;
}) => {
  const { config, cakeauth } = useConfig();

  const [state, setState] = React.useState<StateStore["state"]>("idle");
  const [error, setError] = React.useState<string | null>(null);

  const verifyPasswordResetAttempt = useMutation({
    mutationKey: ["password_reset", "verifyPasswordResetAttempt"],
    mutationFn: async (opts: {
      params: PostVerifyResetPasswordAttemptParams;
      body: PostVerifyResetPasswordAttemptBody;
    }) =>
      cakeauth.resetPassword.verifyPasswordResetAttempt(opts.params, opts.body),
    onError: (err: CakeAuthErrorResponse) => {
      setState("error");
      setError(err.error?.message || "Something went wrong!");
    },
  });

  if (!config) {
    return null;
  }

  if (verifyPasswordResetAttempt.isSuccess) {
    const pages = config.pages;

    return (
      <>
        <div className="flex flex-col items-center justify-center gap-2">
          <Inbox className="text-blue-800 w-6" />
          <div>
            <p className="large text-center">Your password has been reset 🎉</p>
            <p className="muted text-center">
              You have successfully reset your password. You can now sign in to
              your account.
            </p>
            <div className="flex flex-col items-center justify-center mt-4">
              <a
                href={pages.signin}
                className={cn(buttonVariants({ variant: "link" }))}
              >
                Go to sign in
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <FirstDegreeForm
      error={error}
      state={state}
      onContinue={async (password, retryPassword) => {
        if (password !== retryPassword) {
          setError("Passwords do not match");
          setState("error");
          return;
        }

        setState("loading");
        setError(null);
        verifyPasswordResetAttempt.mutate({
          params: {
            attempt_id: attemptId,
          },
          body: {
            new_password: password,
            token,
          },
        });
      }}
    />
  );
};

const FirstDegreeForm = ({
  error,
  state,
  onContinue,
}: {
  error: string | null;
  state: StateStore["state"];
  onContinue: (password: string, retryPassword: string) => void;
}) => {
  const [password, setPassword] = React.useState("");
  const [retryPassword, setRetryPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onContinue(password, retryPassword);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "space-y-4",
        state === "loading" && "pointer-events-none opacity-35",
      )}
    >
      <Input
        placeholder="New password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        placeholder="Repeat new password"
        type="password"
        value={retryPassword}
        onChange={(e) => setRetryPassword(e.target.value)}
      />

      <Button type="submit" className="w-full" disabled={state === "loading"}>
        Reset password
        {state === "loading" ? (
          <Loader2 className="animate-spin" />
        ) : (
          <ArrowRight />
        )}
      </Button>
      <ErrorAlert error={error} />
    </form>
  );
};

export default NewPasswordForm;
