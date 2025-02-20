"use client";

import useUser from "../../hooks/useUser";
import { cn } from "../../internals/ui/cn";
import { Icons } from "../../internals/ui/icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../internals/ui/primitives/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../internals/ui/primitives/DropdownMenu";
import { snakeCaseToTitleCase } from "../../internals/utils/string";
import ManageAccount from "./_components/ManageAccount";
import Signout from "./_components/Signout";

type UserButtonProps = {
  align?: "center" | "end" | "start" | undefined;
  className?: string;
};
const UserButton = ({ align, className }: UserButtonProps) => {
  const { value } = useUser();
  const currentIdentifier =
    value?.identifiers?.find((i) => i.is_current) ||
    value?.identifiers?.[0] ||
    null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer">
          <AvatarImage src={undefined} />
          <AvatarFallback>
            <Icons.User className="w-4 h-4 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className={cn("min-w-72 border-gray-100 shadow-lg", className)}
      >
        <div className="flex p-1.5 gap-4">
          <Avatar>
            <AvatarImage src={undefined} />
            <AvatarFallback>
              <Icons.User className="w-4 h-4 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start justify-center mb-1">
            {currentIdentifier ? (
              <p className="text-gray-800 font-sm">
                {currentIdentifier?.value}
              </p>
            ) : (
              <p className="small text-muted-foreground leading-none italic">
                {value?.external_id}
              </p>
            )}
            <p className="small text-muted-foreground leading-none italic">
              {currentIdentifier
                ? snakeCaseToTitleCase(currentIdentifier?.provider)
                : ""}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <ManageAccount />
        <Signout />
        <div className="rounded-b-md bg-gray-50 py-2.5 items-center justify-center -mx-1 -mb-1 mt-2 border-t border-t-gray-100">
          <div className="flex items-center justify-center gap-2">
            <p className="text-center text-muted-foreground/60 muted">
              Secured with
            </p>
            <div className="flex items-center justify-center gap-1">
              <Icons.Logo className="w-5 opacity-80" />
              <a
                href={`https://cakeauth.com/&utm_campaign=secured_by`}
                className="hover:underline text-center small text-muted-foreground font-medium"
                target="_blank"
              >
                CakeAuth
              </a>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
