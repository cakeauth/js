"use client";

import { CakeAuthErrorResponse } from "@cakeauth/frontend";
import {
  GetSettingsResponseItem,
  PostAttemptResetPasswordBody,
} from "@cakeauth/frontend/types";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, ArrowRight, Inbox, Loader2 } from "lucide-react";
import React from "react";
import { useConfig } from "../../../internals/providers/ConfigProvider";
import { StateStore } from "../../../internals/store/state";
import { cn } from "../../../internals/ui/cn";
import { PhoneInput } from "../../../internals/ui/common/PhoneInput";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../internals/ui/primitives/Alert";
import { Button } from "../../../internals/ui/primitives/Button";
import { Input } from "../../../internals/ui/primitives/Input";
import { Label } from "../../../internals/ui/primitives/Label";
import { isValidEmail } from "../../../internals/utils/string";
import Captcha from "../../Captcha";

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

const PasswordResetForm = ({
  settings,
  url,
}: {
  settings: GetSettingsResponseItem;
  url: string;
}) => {
  const { config, cakeauth } = useConfig();
  const [state, setState] = React.useState<StateStore["state"]>("idle");
  const [error, setError] = React.useState<string | null>(null);

  const createPasswordResetAttempt = useMutation({
    mutationKey: ["password_reset", "createPasswordResetAttempt"],
    mutationFn: async (data: PostAttemptResetPasswordBody) =>
      cakeauth.resetPassword.createPasswordResetAttempt(data),
    onError: (err: CakeAuthErrorResponse) => {
      setState("error");
      setError(err.error?.message || "Something went wrong!");
    },
  });

  if (createPasswordResetAttempt.isSuccess) {
    const res = createPasswordResetAttempt.data?.data;

    return (
      <>
        <div className="flex flex-col items-center justify-center gap-2">
          <Inbox className="text-blue-800 w-6" />
          <div>
            <p className="large text-center">
              Please check your {res?.medium}!
            </p>
            <p className="muted text-center">
              We've sent you a link to reset your password via{" "}
              <span className="font-medium text-blue-800">{res?.medium}</span>{" "}
              to{" "}
              <span className="font-medium text-blue-800">
                {res?.masked_target}
              </span>
              .
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <FirstDegreeForm
      settings={settings}
      error={error}
      state={state}
      onContinue={async (provider, value, captchaToken) => {
        setState("loading");
        setError(null);
        createPasswordResetAttempt.mutate({
          value,
          provider,
          target_url: new URL(url).origin + config.pages.passwordReset,
          captcha_token: captchaToken || undefined,
        });
      }}
    />
  );
};

const FirstDegreeForm = ({
  settings,
  error,
  state,
  onContinue,
}: {
  error: string | null;
  settings: GetSettingsResponseItem;
  state: StateStore["state"];
  onContinue: (
    provider: "phone" | "email" | "username",
    value: string,
    captchaToken: string | null,
  ) => void;
}) => {
  const [provider, setProvider] = React.useState<"non_phone" | "phone">(
    "non_phone",
  );
  const [value, setValue] = React.useState("");
  const [captchaToken, setCaptchaToken] = React.useState<string | null>(null);

  const signinForms = settings.signin_forms.filter(
    (form) => form.group === "direct",
  );
  const email = signinForms.find((form) => form.provider === "email");
  const username = signinForms.find((form) => form.provider === "username");
  const phone = signinForms.find((form) => form.provider === "phone");

  const isEmailAndUsernameEnabledTogether = email && username;

  React.useEffect(() => {
    setValue("");
  }, [provider]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEmailAndUsernameEnabledTogether && provider === "non_phone") {
      if (isValidEmail(value)) {
        onContinue("email", value, captchaToken);
      } else {
        onContinue("username", value, captchaToken);
      }
      return;
    }

    if (provider === "phone") {
      onContinue("phone", value, captchaToken);
      return;
    }

    if (provider === "non_phone") {
      if (email) {
        onContinue("email", value, captchaToken);
        return;
      }
      onContinue("username", value, captchaToken);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "space-y-4",
        state === "loading" && "pointer-events-none opacity-35",
      )}
    >
      {phone && provider === "phone" && (
        <div className="grid w-full items-center gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="phone-input">Phone number</Label>
            {isEmailAndUsernameEnabledTogether && (
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-blue-800"
                onClick={() => setProvider("non_phone")}
              >
                Use email or username
              </Button>
            )}
            {email && !isEmailAndUsernameEnabledTogether && (
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-blue-800"
                onClick={() => setProvider("non_phone")}
              >
                Use email
              </Button>
            )}
            {username && !isEmailAndUsernameEnabledTogether && (
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-blue-800"
                onClick={() => setProvider("non_phone")}
              >
                Use username
              </Button>
            )}
          </div>
          <PhoneInput
            name="phone"
            id="phone-input"
            placeholder="Enter your phone number"
            onChange={(e) => setValue(e)}
            value={value || undefined}
            autoFocus
            required
          />
        </div>
      )}
      {isEmailAndUsernameEnabledTogether && provider === "non_phone" && (
        <div className="grid w-full items-center gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-username-input">Email or username</Label>
            {phone && (
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-blue-800"
                onClick={() => {
                  setValue("");
                  setProvider("phone");
                }}
              >
                Use phone number
              </Button>
            )}
          </div>
          <Input
            name="emailOrUsername"
            id="email-username-input"
            placeholder="Enter your email or username"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            required
          />
        </div>
      )}
      {!isEmailAndUsernameEnabledTogether && provider === "non_phone" && (
        <>
          {email && (
            <div className="grid w-full items-center gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-input">Email address</Label>
                {phone && (
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-blue-800"
                    onClick={() => {
                      setValue("");
                      setProvider("phone");
                    }}
                  >
                    Use phone number
                  </Button>
                )}
              </div>
              <Input
                name="email"
                id="email-input"
                type="email"
                placeholder="Enter your email"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoFocus
                required
              />
            </div>
          )}
          {username && (
            <div className="grid w-full items-center gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="username-input">Username</Label>
                {phone && (
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-blue-800"
                    onClick={() => {
                      setValue("");
                      setProvider("phone");
                    }}
                  >
                    Use phone number
                  </Button>
                )}
              </div>
              <Input
                name="username"
                id="username-input"
                placeholder="Enter your username"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoFocus
                required
              />
            </div>
          )}
        </>
      )}

      <Captcha
        type={settings.environment.configuration?.captcha?.type}
        siteKey={settings.environment.configuration?.captcha?.site_key}
        onVerify={(token) => setCaptchaToken(token)}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={state === "loading" || !value}
      >
        Send reset link
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

export default PasswordResetForm;
