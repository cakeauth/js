"use client";

import { CakeAuth } from "@cakeauth/frontend";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useHandshakeExchange, useRefreshAccessToken } from "../hooks";
import {
  CakeAuthConfig,
  ConfigProvider,
} from "../internals/providers/ConfigProvider";
import "../styles.css";

const CakeAuthProvider = ({
  children,
  config,
}: {
  children: React.ReactNode;
  config: {
    publicKey: string;
    url?: string;
    pages?: Partial<CakeAuthConfig["pages"]>;
  };
}) => {
  const [client] = React.useState(new QueryClient());

  const cakeauth = React.useMemo(
    () =>
      new CakeAuth({
        ...config,
      }),
    [config],
  );

  useHandshakeExchange({ cakeauth });
  useRefreshAccessToken({ cakeauth });

  return (
    <QueryClientProvider client={client}>
      <ConfigProvider
        config={{
          publicKey: config.publicKey,
          url: config?.url || undefined,
          pages: {
            signin: config?.pages?.signin || "/",
            signup: config?.pages?.signup || "/?flow=signup",
            passwordReset:
              config?.pages?.passwordReset || "/?flow=password_reset",
          },
        }}
      >
        {children}
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default CakeAuthProvider;
