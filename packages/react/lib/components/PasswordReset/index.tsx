import { useConfig } from "../../internals/providers/ConfigProvider";
import { useCurrentUrl } from "../../internals/utils/hooks";
import { isPathMatch } from "../../internals/utils/url";
import PasswordResetCard from "../PasswordResetCard";

const PasswordReset = () => {
  const { config } = useConfig();
  const url = useCurrentUrl();

  if (
    !config ||
    !url ||
    !isPathMatch(url.pathname + url.search, config.pages.passwordReset)
  ) {
    return null;
  }

  return (
    <main className="antialiased bg-stone-100 min-h-screen flex items-start justify-center">
      <div className="w-full max-w-md mt-24">
        <div>
          <h3 className="h3 text-center">Reset your password</h3>
          <p className="text-center text-muted-foreground w-3/4 mx-auto">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>
        <PasswordResetCard />
      </div>
    </main>
  );
};

export default PasswordReset;
