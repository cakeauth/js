import { Icons } from "../icons";

const SecuredBy = ({
  projectName,
  page,
}: {
  projectName?: string;
  page?: string;
}) => {
  return (
    <div className="rounded-b-lg bg-muted py-3.5 border-t-0 shadow-md items-center justify-center border">
      <div className="flex items-center justify-center gap-2">
        <p className="text-center text-muted-foreground small">Secured with</p>
        <div className="flex items-center justify-center gap-1">
          <Icons.Logo className="w-5" />
          <a
            href={`https://cakeauth.com/?utm_source=${projectName}&utm_medium=${page}&utm_campaign=secured_by`}
            className="hover:underline text-center small text-primary font-medium"
            target="_blank"
          >
            CakeAuth
          </a>
        </div>
      </div>
    </div>
  );
};

export default SecuredBy;
