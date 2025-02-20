"use client";

import { CakeAuthErrorResponse } from "@cakeauth/frontend";
import {
  GetSettingsResponseItem,
  PostAttemptSigninBody,
  PostAttemptSigninResponseItem,
  PostGetAvailableSigninStrategiesBody,
  PostGetAvailableSigninStrategiesResponseItem,
  PostVerifySigninAttemptBody,
  PostVerifySigninAttemptParams,
} from "@cakeauth/frontend/types";
import { useMutation } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  Loader2,
  PencilLine,
  X,
} from "lucide-react";
import React from "react";
import { useCookies } from "react-cookie";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../../../internals/ui/primitives/InputOTP";
import { Label } from "../../../internals/ui/primitives/Label";
import { COOKIES } from "../../../internals/utils/constants";
import {
  isValidEmail,
  snakeCaseToTitleCase,
} from "../../../internals/utils/string";
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

const SigninForm = ({ settings }: { settings: GetSettingsResponseItem }) => {
  const { cakeauth } = useConfig();
  const [, setCookie] = useCookies();
  const [verifyCount, setVerifyCount] = React.useState(0);
  const [data, setData] = React.useState<{
    provider: "phone" | "email" | "username" | null;
    value: string | null;
    authentication_strategy: string | null;
    attemptId: string | null;
    captchaToken: string | null;
  }>({
    provider: "phone",
    value: "",
    authentication_strategy: null,
    attemptId: null,
    captchaToken: null,
  });
  const [degree, setDegree] = React.useState<"first" | "second" | "third">(
    "first",
  );
  const [state, setState] = React.useState<StateStore["state"]>("idle");
  const [error, setError] = React.useState<string | null>(null);

  const verifySigninAttempt = useMutation({
    mutationKey: ["signin", "verifySigninAttempt"],
    mutationFn: async (data: {
      params: PostVerifySigninAttemptParams;
      body: PostVerifySigninAttemptBody;
    }) => cakeauth.signin.verifySigninAttempt(data.params, data.body),
    onSuccess: (response) => {
      setError(null);
      const sessionExpires = response.data.expires_at
        ? new Date(response.data.expires_at)
        : new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

      setCookie(COOKIES.SESSION_ID, response?.data?.id, {
        expires: sessionExpires,
        domain: response?.data?.token?.domain,
      });
      setCookie(COOKIES.USER_ID, response?.data?.user?.id, {
        expires: sessionExpires,
        domain: response?.data?.token?.domain,
      });
      setCookie(response.data.token.name, response.data.token.value, {
        expires: new Date(response.data.token.expires_at),
        domain: response?.data?.token?.domain,
      });

      window.location.reload();
    },
    onError: (err: CakeAuthErrorResponse) => {
      setVerifyCount(verifyCount + 1);
      setState("error");
      setError(err.error?.message || "Something went wrong!");
    },
  });

  const createSigninAttempt = useMutation({
    mutationKey: ["signin", "createSigninAttempt"],
    mutationFn: async (data: PostAttemptSigninBody) =>
      cakeauth.signin.createSigninAttempt(data),
    onSuccess: (res) => {
      setState("idle");
      setError(null);
      setVerifyCount(0);
      setDegree("third");
      setData({
        ...data,
        attemptId: res.data.attempt_id,
      });
    },
    onError: (err: CakeAuthErrorResponse) => {
      setState("error");
      setError(err.error?.message || "Something went wrong!");
    },
  });

  const getAvailableSigninStrategies = useMutation({
    mutationKey: ["signin", "getAvailableSigninStrategies"],
    mutationFn: async (data: PostGetAvailableSigninStrategiesBody) =>
      cakeauth.signin.getAvailableSigninStrategies(data),
    onSuccess: (res) => {
      if (res.data.length === 1 && data?.provider && data?.value) {
        setData({ ...data, authentication_strategy: res.data[0].strategy });
        // directly create a signin attempt
        createSigninAttempt.mutate({
          value: data.value,
          provider: data.provider,
          authentication_strategy: res.data[0].strategy,
          captcha_token: data.captchaToken,
        });
      } else {
        setState("idle");
        setError(null);
        setVerifyCount(0);
        setDegree("second");
      }
    },
    onError: (err: CakeAuthErrorResponse) => {
      setState("error");
      setError(err.error?.message || "Something went wrong!");
    },
  });

  if (degree === "first") {
    return (
      <FirstDegreeSigninForm
        settings={settings}
        error={error}
        state={state}
        onContinue={async (provider, value, captchaToken) => {
          setData({
            provider,
            value,
            authentication_strategy: null,
            attemptId: null,
            captchaToken,
          });
          setState("loading");
          setError(null);
          setVerifyCount(0);
          getAvailableSigninStrategies.mutate({
            provider,
            value,
          });
        }}
      />
    );
  }

  if (degree === "second") {
    return (
      <SecondDegreeSigninForm
        state={state}
        error={error}
        strategies={getAvailableSigninStrategies.data?.data || []}
        onSelectStrategy={(strategy) => {
          setState("loading");
          setError(null);
          setVerifyCount(0);
          setData({ ...data, authentication_strategy: strategy });
          if (data?.provider && data?.value) {
            createSigninAttempt.mutate({
              value: data.value,
              provider: data.provider,
              authentication_strategy: strategy,
              captcha_token: data.captchaToken,
            });
          }
        }}
        onBack={() => {
          setData({
            provider: null,
            value: null,
            authentication_strategy: null,
            attemptId: null,
            captchaToken: null,
          });
          setVerifyCount(0);
          setState("idle");
          setError(null);
          setDegree("first");
        }}
      />
    );
  }

  if (degree === "third") {
    return (
      <ThirdDegreeSigninForm
        isRateLimited={verifyCount > 3}
        attempt={createSigninAttempt.data?.data}
        provider={data?.provider}
        state={state}
        value={data?.value}
        error={error}
        onCancel={() => {
          setData({
            provider: null,
            value: null,
            authentication_strategy: null,
            attemptId: null,
            captchaToken: null,
          });
          setVerifyCount(0);
          setState("idle");
          setError(null);
          setDegree("first");
        }}
        onVerify={(code: string | null, password: string | null) => {
          setState("loading");
          setError(null);
          if (data?.attemptId) {
            verifySigninAttempt.mutate({
              params: {
                attempt_id: data.attemptId,
              },
              body: {
                code: code || undefined,
                password: password || undefined,
              },
            });
          }
        }}
        onResend={() => {
          if (data?.provider && data?.value && data?.authentication_strategy) {
            setState("loading");
            setError(null);
            setVerifyCount(0);
            createSigninAttempt.mutate({
              value: data.value,
              provider: data.provider,
              authentication_strategy: data.authentication_strategy,
              captcha_token: data.captchaToken,
            });
          }
        }}
      />
    );
  }
};

const ThirdDegreeSigninForm = ({
  state,
  isRateLimited,
  attempt,
  value,
  error,
  onResend,
  onCancel,
  onVerify,
}: {
  state: StateStore["state"];
  isRateLimited: boolean;
  provider: "phone" | "email" | "username" | null;
  value: string | null;
  attempt: PostAttemptSigninResponseItem | undefined;
  error: string | null;
  onResend: () => void;
  onCancel: () => void;
  onVerify: (code: string | null, password: string | null) => void;
}) => {
  const { config } = useConfig();
  const [code, setCode] = React.useState("");
  const [password, setPassword] = React.useState("");
  const component = attempt?.components?.[0] || null;
  const medium = attempt?.authentication_strategy?.includes("email")
    ? "email"
    : attempt?.authentication_strategy?.includes("whatsapp")
      ? "whatsapp"
      : "sms";

  React.useEffect(() => {
    if (code && code.length === 6) {
      onVerify(code, null);
    }
  }, [code]);

  const handleOTPSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code) {
      onVerify(code, null);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onVerify(null, password);
  };

  if (!config) {
    return null;
  }

  if (value && !attempt && !error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin text-muted-foreground w-6" />
        <p className="muted text-center">Resending the code...</p>
      </div>
    );
  }

  if (isRateLimited) {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <X className="text-destructive w-6" />
        <p className="muted text-center">
          You have exceeded the maximum number of attempts. Please try!
        </p>
        <Button variant="link" onClick={onCancel}>
          Try again
        </Button>
      </div>
    );
  }

  if (!attempt || !component) {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <X className="text-destructive w-6" />
        <p className="muted text-center">
          Attempt is expired, please try again!
        </p>
        <Button variant="link" onClick={onCancel}>
          Try again
        </Button>
      </div>
    );
  }

  if (component.type === "code") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 -mt-4 relative w-full",
        )}
      >
        {state === "loading" && (
          <div className="absolute bottom-0 left-0 z-10 flex items-center justify-center w-full h-full">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        )}
        <form
          onSubmit={handleOTPSubmit}
          className={cn(
            "flex flex-col items-center justify-center gap-2 w-full",
            state === "loading" && "pointer-events-none opacity-40",
          )}
        >
          <div className="mb-4 space-y-1 w-full">
            <h3 className="h3 text-center">Enter the code</h3>
            <div className="flex flex-col items-center justify-center gap-1">
              <p className="small text-center text-muted-foreground leading-5">
                We've sent you a one-time code via{" "}
                <span className="font-medium text-blue-800">
                  {snakeCaseToTitleCase(medium)}
                </span>{" "}
                to:
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="small font-medium text-blue-800 hover:underline"
                  onClick={onCancel}
                >
                  {attempt?.masked_target || value}
                </button>
                <PencilLine className="h-4 w-4 text-blue-800" />
              </div>
            </div>
          </div>
          <InputOTP
            maxLength={6}
            value={code}
            onChange={setCode}
            name="otp"
            autoFocus
            required
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <div className="my-5">
            <p className="muted">
              Didn't receive the code?{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto"
                onClick={onResend}
              >
                Resend
              </Button>
            </p>
          </div>
          <ErrorAlert error={error} />
        </form>
      </div>
    );
  }

  if (component.type === "password") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 -mt-4 relative w-full",
        )}
      >
        {state === "loading" && (
          <div className="absolute bottom-0 left-0 z-10 flex items-center justify-center w-full h-full">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        )}
        <form
          onSubmit={handlePasswordSubmit}
          className={cn(
            "flex flex-col items-center justify-center gap-2 w-full",
            state === "loading" && "pointer-events-none opacity-40",
          )}
        >
          <div className="mb-4 space-y-1 w-full">
            <h3 className="h3 text-center">Enter your password</h3>
            <div className="flex flex-col items-center justify-center gap-1">
              <p className="small text-center text-muted-foreground">
                Please enter your password to continue.
              </p>
              <div className="flex items-center gap-1">
                <p className="small text-center text-muted-foreground">
                  Forgot your password?{" "}
                  <a
                    href={config.pages.passwordReset}
                    className="small font-medium text-blue-800 hover:underline"
                  >
                    Reset password
                  </a>
                </p>
              </div>
            </div>
          </div>
          <Input
            className="w-full py-4 mt-4"
            name="password"
            id="password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
          />
          <Button
            type="submit"
            className="w-full mt-4 mb-5"
            disabled={state === "loading"}
          >
            Sign in
            <ArrowRight />
          </Button>
          <ErrorAlert error={error} />
        </form>
      </div>
    );
  }
};

const SecondDegreeSigninForm = ({
  error,
  state,
  strategies,
  onSelectStrategy,
  onBack,
}: {
  error: string | null;
  state: StateStore["state"];
  strategies: PostGetAvailableSigninStrategiesResponseItem[];
  onSelectStrategy: (strategy: string) => void;
  onBack: () => void;
}) => {
  if (!strategies.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <X className="text-destructive w-6" />
        <p className="muted text-center">
          No verification strategies available.
        </p>
        <Button variant="link" onClick={onBack}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-2 relative")}
    >
      {state === "loading" && (
        <div className="absolute bottom-0 left-0 z-10 flex items-center justify-center w-full h-full">
          <Loader2 className="animate-spin text-muted-foreground" />
        </div>
      )}
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2",
          state === "loading" && "pointer-events-none opacity-40",
        )}
      >
        {strategies.map((strategy) => (
          <Button
            key={strategy.strategy}
            variant="outline"
            onClick={() => onSelectStrategy(strategy.strategy)}
            className="w-full flex flex-col items-start justify-start h-auto gap-1 text-wrap py-3"
          >
            <p className="text-left font-medium leading-none">
              {strategy.title}
            </p>
            <p className="text-left text-sm muted leading-none font-normal">
              {strategy.subtitle}
            </p>
          </Button>
        ))}
        <ErrorAlert error={error} />
      </div>
    </div>
  );
};

const FirstDegreeSigninForm = ({
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
        Continue
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

export default SigninForm;
