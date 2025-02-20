"use client";

import useUser from "../../../hooks/useUser";
import { Icons } from "../../../internals/ui/icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../internals/ui/primitives/Avatar";
import ResetPassword from "./ResetPassword";

const Profile = () => {
  const user = useUser();
  const currentIdentifier = user?.value?.identifiers?.find((i) => i.is_current);

  return (
    <div className="flex flex-col items-start justify-between h-full">
      <div className="w-full">
        <p className="p text-lg font-medium text-primary">Profile</p>
        <p className="extra-muted">All about your account</p>

        <div className="mt-6">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={undefined} />
              <AvatarFallback>
                <Icons.User className="w-4 h-4 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col items-start justify-center">
                <p className="p font-medium leading-none">
                  {currentIdentifier?.value}
                </p>
                <p className="muted">
                  Login via{" "}
                  <span className="text-blue-800">
                    {currentIdentifier?.provider}
                  </span>
                </p>
              </div>

              <div className="flex flex-col items-end justify-center">
                <p className="muted text-right">Joined since:</p>
                <p className="muted text-right text-blue-800">
                  {user?.value?.created_at
                    ? new Date(user?.value?.created_at).toLocaleString()
                    : "unknown"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* <Separator className="mt-6" /> */}
        {/**/}
        {/* <p className="p text-lg font-medium text-primary mt-0">Connected Accounts</p> */}
        {/* <p className="extra-muted">Connected providers to this account</p> */}
      </div>

      <div className="flex items-end justify-end w-full">
        {currentIdentifier?.is_password_enabled && <ResetPassword />}
      </div>
    </div>
  );
};

export default Profile;
