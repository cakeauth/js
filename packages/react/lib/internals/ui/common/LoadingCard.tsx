import { Loader2 } from "lucide-react";
import { Card } from "../primitives/Card";
import SecuredBy from "./SecuredBy";

const LoadingCard = () => {
  return (
    <div className="w-full max-w-md mt-24 static">
      <Card className="mt-6 shadow-md px-4 pt-6 pb-8 space-y-4 w-full flex flex-col items-center justify-center">
        <Loader2 className="animate-spin w-4 h-4 text-muted-foreground/70" />
        <p className="small text-center text-muted-foreground leading-4">
          Loading...
        </p>
      </Card>
      <SecuredBy projectName="" page="signin" />
    </div>
  );
};

export default LoadingCard;
