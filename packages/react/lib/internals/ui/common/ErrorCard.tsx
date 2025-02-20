import { Card } from "../primitives/Card";
import CardCTAFooter from "./CardCTAFooter";
import SecuredBy from "./SecuredBy";

const ErrorCard = ({ error }: { error: unknown }) => {
  return (
    <div className="w-full max-w-md mt-24 static">
      <Card className="mt-6 shadow-md px-4 pt-6 pb-8 space-y-4 w-s">
        <h3 className="h3 text-center">Something went wrong!</h3>
        <p className="small text-center text-muted-foreground leading-4">
          {(error as Error)?.message || (error as string)}
        </p>
      </Card>
      <CardCTAFooter
        label="Need some assistance?"
        href="#"
        cta="Contact support"
      />
      <SecuredBy projectName="" page="signin" />
    </div>
  );
};

export default ErrorCard;
