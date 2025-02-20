"use client";

import useSettings from "../../hooks/useSettings";
import { useConfig } from "../../internals/providers/ConfigProvider";
import CardCTAFooter from "../../internals/ui/common/CardCTAFooter";
import ErrorAlert from "../../internals/ui/common/ErrorAlert";
import ErrorCard from "../../internals/ui/common/ErrorCard";
import LoadingCard from "../../internals/ui/common/LoadingCard";
import SecuredBy from "../../internals/ui/common/SecuredBy";
import SocialsAuth from "../../internals/ui/common/SocialsAuth";
import { Card, CardContent } from "../../internals/ui/primitives/Card";
import { useCurrentUrl } from "../../internals/utils/hooks";
import SigninForm from "./_components/SigninForm";

const SigninCard = () => {
  const { config } = useConfig();
  const { value: settings, state } = useSettings();
  const settingsData = settings?.data;
  const allowSignUp = settingsData?.environment.configuration?.allow_signup;
  const url = useCurrentUrl();
  const isValidDomain = settingsData?.domains?.find(
    (domain) => domain.domain === url?.origin,
  );

  if (!config || state === "loading" || !settingsData) {
    return <LoadingCard />;
  }
  if (!isValidDomain) {
    return (
      <ErrorCard
        error={`
          Domain ${url?.origin} is not an authorized domain. If you're an admin, please adjust it in the CakeAuth dashboard.
          `}
      />
    );
  }

  return (
    <>
      <Card className="mt-6 shadow-md px-4 pt-6 pb-8 space-y-4 rounded-b-none">
        <ErrorAlert />
        <SocialsAuth settings={settingsData} />
        <CardContent className="p-0">
          <SigninForm settings={settingsData} />
        </CardContent>
      </Card>
      {allowSignUp && (
        <CardCTAFooter
          label="Don't have an account?"
          href={config.pages.signup}
          cta="Sign Up"
        />
      )}
      <SecuredBy projectName={settingsData.project.name} page="signin" />
    </>
  );
};

export default SigninCard;
