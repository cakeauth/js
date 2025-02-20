import { CakeAuth } from "@cakeauth/frontend";
import React, { createContext, useContext } from "react";

export type CakeAuthConfig = {
  publicKey: string;
  url?: string;
  pages: {
    signin: string;
    signup: string;
    passwordReset: string;
  };
};

interface ConfigContextType {
  config: CakeAuthConfig;
  cakeauth: CakeAuth;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{
  children: React.ReactNode;
  config: CakeAuthConfig;
}> = ({ children, config }) => {
  const cakeauth = new CakeAuth({
    publicKey: config.publicKey,
    url: config?.url || undefined,
  });

  return (
    <ConfigContext.Provider value={{ config, cakeauth }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};
