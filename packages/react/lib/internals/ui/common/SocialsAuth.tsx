"use client";

import { GetSettingsResponseItem } from "@cakeauth/frontend/types";
import getOAuthUrl from "../../../functions/socials/getOAuthUrl";
import { useConfig } from "../../providers/ConfigProvider";
import { Button } from "../primitives/Button";

const SocialsAuth = ({ settings }: { settings: GetSettingsResponseItem }) => {
  const { config: storedConfig } = useConfig();
  const socials = settings.signin_forms.filter((i) => i.group === "social");
  const google = socials.find((i) => i.provider === "google");
  const github = socials.find((i) => i.provider === "github");

  if (!socials.length) {
    return null;
  }

  return (
    <div>
      <div className="flex flex-row items-center justify-center gap-4">
        {google?.components.map((config) => (
          <Button
            key={config.type}
            variant="outline"
            className="w-full"
            onClick={() => {
              const url = getOAuthUrl({
                provider: config.type,
                clientId: config.configuration?.client_id,
                redirectUri: config.configuration?.redirect_uri,
                scopes: config.configuration?.scopes || [],
                publicKey: storedConfig?.publicKey!,
              });

              if (url) {
                window.location.href = url;
              }
            }}
          >
            {config.logo && (
              <img src={config.logo} alt={config.type} width={16} height={16} />
            )}
            {config.label}
          </Button>
        ))}
        {github?.components.map((config) => (
          <Button
            key={config.type}
            variant="outline"
            className="w-full"
            onClick={() => {
              const url = getOAuthUrl({
                provider: config.type,
                clientId: config.configuration?.client_id,
                redirectUri: config.configuration?.redirect_uri,
                scopes: config.configuration?.scopes || [],
                publicKey: storedConfig?.publicKey!,
              });

              if (url) {
                window.location.href = url;
              }
            }}
          >
            {config.logo && (
              <img src={config.logo} alt={config.type} width={16} height={16} />
            )}
            {config.label}
          </Button>
        ))}
      </div>
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            OR CONTINUE WITH
          </span>
        </div>
      </div>
    </div>
  );
};

export default SocialsAuth;
