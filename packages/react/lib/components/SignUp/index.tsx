"use client";

import { useConfig } from "../../internals/providers/ConfigProvider";
import { useCurrentUrl } from "../../internals/utils/hooks";
import { isPathMatch } from "../../internals/utils/url";
import SignUpCard from "../SignUpCard";

const SignUp = () => {
  const { config } = useConfig();
  const url = useCurrentUrl();
  if (
    !config ||
    !url ||
    !isPathMatch(url.pathname + url.search, config.pages.signup)
  ) {
    return null;
  }

  return (
    <main className="antialiased bg-stone-100 min-h-screen flex items-start justify-center">
      <div className="w-full max-w-md mt-24">
        <div>
          <h3 className="h3 text-center">Create an account</h3>
          <p className="text-center text-muted-foreground w-3/4 mx-auto">
            Welcome! Please enter your details to get started.
          </p>
        </div>
        <SignUpCard />
      </div>
    </main>
  );
};

export default SignUp;
