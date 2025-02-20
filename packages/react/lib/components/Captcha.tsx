import ReCAPTCHA from "react-google-recaptcha";
import Turnstile from "react-turnstile";

const Captcha = ({
  type,
  siteKey,
  onVerify,
}: {
  type: "turnstile" | "recaptcha" | null | undefined;
  siteKey: string | null | undefined;
  onVerify?: (token: string) => void;
}) => {
  if (!siteKey || !type) {
    return null;
  }

  if (type === "recaptcha") {
    return (
      <ReCAPTCHA
        sitekey={siteKey}
        onChange={(e) => {
          if (e) {
            onVerify?.(e);
          }
        }}
      />
    );
  }
  if (type === "turnstile") {
    return <Turnstile sitekey={siteKey} onVerify={onVerify} />;
  }
};

export default Captcha;
