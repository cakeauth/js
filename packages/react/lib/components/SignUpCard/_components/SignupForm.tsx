"use client";

import { CakeAuthErrorResponse } from "@cakeauth/frontend";
import {
  GetSettingsResponseItem,
  PostAttemptSignupBody,
  PostAttemptSignupResponseItem,
  PostVerifySignupAttemptBody,
  PostVerifySignupAttemptParams,
} from "@cakeauth/frontend/types";
import { Tabs } from "@radix-ui/react-tabs";
import { useMutation } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeft,
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
import {
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../internals/ui/primitives/Tabs";
import { COOKIES } from "../../../internals/utils/constants";
import { snakeCaseToTitleCase } from "../../../internals/utils/string";
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

type SignupContactInformationValue = {
  type: "phone" | "email";
  value: string;
};

const SignupForm = ({ settings }: { settings: GetSettingsResponseItem }) => {
  const { cakeauth } = useConfig();
  const [, setCookie] = useCookies();
  const [verifyCount, setVerifyCount] = React.useState(0);
  const [data, setData] = React.useState<{
    provider: "phone" | "email" | "username" | null;
    value: string | null;
    verification_strategies: GetSettingsResponseItem["signup_forms"]["0"]["verification_strategies"];
    verification_strategy: string | null;
    attemptId: string | null;
    contact_informations: SignupContactInformationValue[];
    captchaToken: string | null;
  }>({
    provider: "phone",
    value: "",
    verification_strategies: [],
    verification_strategy: null,
    attemptId: null,
    contact_informations: [],
    captchaToken: null,
  });
  const [degree, setDegree] = React.useState<"first" | "second" | "third">(
    "first",
  );
  const [state, setState] = React.useState<StateStore["state"]>("idle");
  const [error, setError] = React.useState<string | null>(null);

  const verifySignupAttempt = useMutation({
    mutationKey: ["signin", "verifySignupAttempt"],
    mutationFn: async (data: {
      params: PostVerifySignupAttemptParams;
      body: PostVerifySignupAttemptBody;
    }) => cakeauth.signup.verifySignupAttempt(data.params, data.body),
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

  const createSignupAttemptMutation = useMutation({
    mutationKey: ["signin", "createSignupAttempt"],
    mutationFn: async (data: PostAttemptSignupBody) =>
      cakeauth.signup.createSignupAttempt(data),
    onSuccess: (res) => {
      setError(null);

      // TODO: rename user to session
      if (res.data.is_user_created && res.data.session) {
        const sessionExpires = res.data.session.expires_at
          ? new Date(res.data.session.expires_at)
          : new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

        setCookie(COOKIES.SESSION_ID, res?.data.session.id, {
          expires: sessionExpires,
          domain: res.data.session.token?.domain,
        });
        setCookie(COOKIES.USER_ID, res.data.session.user.id, {
          expires: sessionExpires,
          domain: res.data.session.token.domain,
        });
        setCookie(res.data.session.token.name, res.data.session.token.value, {
          expires: new Date(res.data.session.token.expires_at),
          domain: res.data.session.token.domain,
        });

        window.location.reload();
        return;
      }

      setState("idle");
      setVerifyCount(0);
      setDegree("third");
      setData({
        ...data,
        attemptId: res.data.attempt?.attempt_id || null,
      });
    },
    onError: (err: CakeAuthErrorResponse) => {
      setState("error");
      setError(err.error?.message || "Something went wrong!");
    },
  });

  if (degree === "first") {
    return (
      <FirstDegreeSignupForm
        settings={settings}
        error={error}
        state={state}
        onContinue={async (
          provider,
          value,
          password,
          contactInformations,
          captchaToken,
        ) => {
          setData({
            provider,
            value,
            verification_strategies: [],
            verification_strategy: null,
            attemptId: null,
            contact_informations: contactInformations,
            captchaToken,
          });

          setState("loading");
          setError(null);
          setVerifyCount(0);
          const verificationStrategies: GetSettingsResponseItem["signup_forms"]["0"]["verification_strategies"] =
            settings.signup_forms.find((i) => i.provider === provider)
              ?.verification_strategies || [];
          setData({ ...data, verification_strategies: verificationStrategies });

          if (verificationStrategies.length === 1) {
            const strategy = verificationStrategies[0].strategy;
            setData({
              ...data,
              provider,
              value,
              verification_strategy: strategy,
            });

            createSignupAttemptMutation.mutate({
              value: value,
              provider: provider,
              password: strategy?.includes("password") ? password : undefined,
              verification_strategy: strategy,
              contact_informations: contactInformations,
              captcha_token: captchaToken,
            });
            return;
          }

          setData({
            ...data,
            provider,
            value,
            verification_strategies: verificationStrategies,
            contact_informations: contactInformations,
            captchaToken,
          });
          setState("idle");
          setError(null);
          setVerifyCount(0);
          setDegree("second");
        }}
      />
    );
  }

  if (degree === "second") {
    return (
      <SecondDegreeSignupForm
        state={state}
        error={error}
        strategies={data.verification_strategies}
        onBack={() => {
          setData({
            provider: null,
            value: null,
            verification_strategies: [],
            verification_strategy: null,
            attemptId: null,
            contact_informations: [],
            captchaToken: null,
          });
          setVerifyCount(0);
          setState("idle");
          setError(null);
          setDegree("first");
        }}
        onSelectStrategy={(strategy) => {
          setState("loading");
          setError(null);
          setVerifyCount(0);
          setData({ ...data, verification_strategy: strategy });
          if (data?.provider && data?.value) {
            createSignupAttemptMutation.mutate({
              value: data.value,
              provider: data.provider,
              verification_strategy: strategy,
              contact_informations: data.contact_informations,
              captcha_token: data.captchaToken,
            });
          }
        }}
      />
    );
  }

  if (degree === "third") {
    return (
      <ThirdDegreeSignupForm
        isRateLimited={verifyCount > 3}
        attempt={createSignupAttemptMutation.data?.data}
        provider={data?.provider}
        state={state}
        value={data?.value}
        error={error}
        onCancel={() => {
          setData({
            provider: null,
            value: null,
            verification_strategies: [],
            verification_strategy: null,
            attemptId: null,
            contact_informations: [],
            captchaToken: null,
          });
          setVerifyCount(0);
          setState("idle");
          setError(null);
          setDegree("first");
        }}
        onVerify={(code: string | null) => {
          setState("loading");
          setError(null);
          if (data?.attemptId && code) {
            verifySignupAttempt.mutate({
              params: {
                attempt_id: data.attemptId,
              },
              body: {
                code,
              },
            });
          }
        }}
        onResend={() => {
          if (data?.provider && data?.value && data?.verification_strategy) {
            setState("loading");
            setError(null);
            setVerifyCount(0);
            createSignupAttemptMutation.mutate({
              value: data.value,
              provider: data.provider,
              verification_strategy: data.verification_strategy,
              contact_informations: data.contact_informations,
              captcha_token: data.captchaToken,
            });
          }
        }}
      />
    );
  }
};

const ThirdDegreeSignupForm = ({
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
  attempt: PostAttemptSignupResponseItem | undefined;
  error: string | null;
  onResend: () => void;
  onCancel: () => void;
  onVerify: (code: string | null, password: string | null) => void;
}) => {
  const [code, setCode] = React.useState("");
  const component = attempt?.attempt?.components?.[0] || null;
  const medium = attempt?.attempt?.verification_strategy?.includes("email")
    ? "email"
    : attempt?.attempt?.verification_strategy?.includes("whatsapp")
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
                {attempt?.attempt?.masked_target || value}
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
};

const SecondDegreeSignupForm = ({
  error,
  state,
  strategies,
  onSelectStrategy,
  onBack,
}: {
  error: string | null;
  state: StateStore["state"];
  strategies: GetSettingsResponseItem["signup_forms"]["0"]["verification_strategies"];
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
      className={cn(
        "flex flex-col items-center justify-center gap-2 relative -mt-4",
      )}
    >
      <div className="flex items-start justify-start w-full mb-2">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft />
          Back
        </Button>
      </div>
      {state === "loading" && (
        <div className="absolute bottom-0 left-0 z-10 flex items-center justify-center w-full h-full">
          <Loader2 className="animate-spin text-muted-foreground" />
        </div>
      )}
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 w-full",
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
        <div className="mt-4">
          <ErrorAlert error={error} />
        </div>
      </div>
    </div>
  );
};

const FirstDegreeSignupForm = ({
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
    password: string,
    contactInformations: SignupContactInformationValue[],
    captchaToken: string | null,
  ) => void;
}) => {
  const signupForms = settings.signup_forms.filter(
    (form) => form.group === "direct",
  );
  const [provider, setProvider] = React.useState<
    "email" | "username" | "phone"
  >(signupForms[0]?.provider as "email" | "username" | "phone");
  const [value, setValue] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [contactInformations, setContactInformations] = React.useState<
    SignupContactInformationValue[]
  >([]);
  const [captchaToken, setCaptchaToken] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onContinue(provider, value, password, contactInformations, captchaToken);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "space-y-4",
        state === "loading" && "pointer-events-none opacity-35",
      )}
    >
      {signupForms?.length > 1 ? (
        <Tabs
          defaultValue={signupForms?.[0]?.provider}
          className="w-full -mt-2"
          value={provider}
          onValueChange={(e) => {
            setProvider(e as "email" | "username" | "phone");
            setValue("");
            setPassword("");
            setContactInformations([]);
          }}
        >
          <TabsList className="w-full">
            {signupForms.map((item) => (
              <TabsTrigger
                value={item.provider}
                className="w-full"
                key={item.provider}
              >
                {snakeCaseToTitleCase(item.provider)}
              </TabsTrigger>
            ))}
          </TabsList>
          {signupForms.map((item) => (
            <TabsContent
              value={item.provider}
              key={item.provider}
              className="space-y-4 mt-8"
            >
              <FirstDegreeSignupFormContent
                state={state}
                settings={settings}
                item={item}
                valueState={[value, setValue]}
                passwordState={[password, setPassword]}
                captchaTokenState={[captchaToken, setCaptchaToken]}
                contactInformationsState={[
                  contactInformations,
                  setContactInformations,
                ]}
              />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <FirstDegreeSignupFormContent
          state={state}
          settings={settings}
          item={signupForms?.[0] || null}
          valueState={[value, setValue]}
          passwordState={[password, setPassword]}
          captchaTokenState={[captchaToken, setCaptchaToken]}
          contactInformationsState={[
            contactInformations,
            setContactInformations,
          ]}
        />
      )}
      <ErrorAlert error={error} />
    </form>
  );
};

const FirstDegreeSignupFormContent = ({
  captchaTokenState,
  contactInformationsState,
  item,
  passwordState,
  settings,
  state,
  valueState,
}: {
  captchaTokenState: [
    string | null,
    React.Dispatch<React.SetStateAction<string | null>>,
  ];
  contactInformationsState: [
    SignupContactInformationValue[],
    React.Dispatch<React.SetStateAction<SignupContactInformationValue[]>>,
  ];
  item: GetSettingsResponseItem["signup_forms"]["0"];
  passwordState: [string, React.Dispatch<React.SetStateAction<string>>];
  settings: GetSettingsResponseItem;
  state: StateStore["state"];
  valueState: [string, React.Dispatch<React.SetStateAction<string>>];
}) => {
  const [value, setValue] = valueState;
  const [password, setPassword] = passwordState;
  const [contactInformations, setContactInformations] =
    contactInformationsState;
  const [, setCaptchaToken] = captchaTokenState;

  if (!item || !item?.components?.length) {
    return null;
  }

  return (
    <>
      {item?.components?.map((component) => (
        <div key={component.type}>
          {component.type === "phone" ? (
            <PhoneInput
              className="w-full"
              name={component.type}
              id={component.type}
              placeholder={component.label}
              required={component.required}
              value={
                component.type === item.provider
                  ? value
                  : contactInformations.find((i) => i.type === component.type)
                      ?.value || ""
              }
              onChange={(e) => {
                if (component.type === item.provider) {
                  setValue(e);
                  return;
                }

                const contactInformation = contactInformations.find(
                  (i) => i.type === component.type,
                );
                if (contactInformation) {
                  setContactInformations(
                    contactInformations.map((i) => {
                      if (i.type === component.type) {
                        return {
                          ...i,
                          value: e,
                        };
                      }
                      return i;
                    }),
                  );
                } else {
                  setContactInformations([
                    ...contactInformations,
                    {
                      type: component.type as "phone" | "email",
                      value: e as string,
                    },
                  ]);
                }
              }}
            />
          ) : null}
          {component.component_kind === "input" &&
          component.type !== "phone" ? (
            <Input
              className="w-full"
              name={component.type}
              id={component.type}
              placeholder={component.label}
              type={component.type}
              required={component.required}
              value={
                component.type === item.provider
                  ? value
                  : component.type === "password"
                    ? password
                    : contactInformations.find((i) => i.type === component.type)
                        ?.value || ""
              }
              onChange={(e) => {
                if (component.type === item.provider) {
                  setValue(e.target.value);
                  return;
                }

                if (component.type === "password") {
                  setPassword(e.target.value);
                  return;
                }

                const contactInformation = contactInformations.find(
                  (i) => i.type === component.type,
                );
                if (contactInformation) {
                  setContactInformations(
                    contactInformations.map((i) => {
                      if (i.type === component.type) {
                        return {
                          ...i,
                          value: e.target.value,
                        };
                      }
                      return i;
                    }),
                  );
                } else {
                  setContactInformations([
                    ...contactInformations,
                    {
                      type: component.type as "phone" | "email",
                      value: e.target.value as string,
                    },
                  ]);
                }
              }}
            />
          ) : null}
        </div>
      ))}

      <Captcha
        type={settings.environment.configuration?.captcha?.type}
        siteKey={settings.environment.configuration?.captcha?.site_key}
        onVerify={(token) => setCaptchaToken(token)}
      />

      <Button
        type="submit"
        className="w-full !mt-8"
        disabled={state === "loading"} // || !value
      >
        Continue
        {state === "loading" ? (
          <Loader2 className="animate-spin" />
        ) : (
          <ArrowRight />
        )}
      </Button>
    </>
  );
};

export default SignupForm;
