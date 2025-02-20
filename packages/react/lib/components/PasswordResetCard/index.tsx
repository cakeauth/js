import useSettings from "../../hooks/useSettings";
import { useConfig } from "../../internals/providers/ConfigProvider";
import CardCTAFooter from "../../internals/ui/common/CardCTAFooter";
import ErrorAlert from "../../internals/ui/common/ErrorAlert";
import ErrorCard from "../../internals/ui/common/ErrorCard";
import LoadingCard from "../../internals/ui/common/LoadingCard";
import SecuredBy from "../../internals/ui/common/SecuredBy";
import { Card, CardContent } from "../../internals/ui/primitives/Card";
import { SEARCH_PARAMS } from "../../internals/utils/constants";
import { useCurrentUrl } from "../../internals/utils/hooks";
import NewPasswordForm from "./_components/NewPasswordForm";
import PasswordResetForm from "./_components/PasswordResetForm";

const PasswordResetCard = () => {
  const { config } = useConfig();

  const { value: settings, state } = useSettings();
  const settingsData = settings?.data;

  const url = useCurrentUrl();
  const isValidDomain = settingsData?.domains?.find(
    (domain) => domain.domain === url?.origin,
  );
  const attemptId = url?.searchParams.get(SEARCH_PARAMS.ATTEMPT);
  const token = url?.searchParams.get(SEARCH_PARAMS.TOKEN);

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
        <CardContent className="p-0">
          {attemptId && token ? (
            <NewPasswordForm attemptId={attemptId} token={token} />
          ) : (
            <PasswordResetForm
              settings={settingsData}
              url={url?.origin || ""}
            />
          )}
        </CardContent>
      </Card>
      <CardCTAFooter
        label="Ready to sign in?"
        href={config.pages.signin}
        cta="Sign In"
      />
      <SecuredBy projectName={settingsData?.project.name} page="signin" />
    </>
  );
};

export default PasswordResetCard;
