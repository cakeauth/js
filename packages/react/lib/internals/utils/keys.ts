// let clientConfig: CakeAuthConfig | null = null;

// export const createConfigs = (configs: {
//   publicKey: string;
//   url: string;
//   pages?: Partial<CakeAuthConfig["pages"]>;
// }): CakeAuthConfig => {
//   const { publicKey, url } = configs;

//   if (!publicKey) {
//     throw new Error("CakeAuth: Public key is missing");
//   }
//   if (!url) {
//     throw new Error("CakeAuth: URL is missing");
//   }

//   clientConfig = {
//     ...configs,
//     pages: {
//       signin: configs?.pages?.signin || "/",
//       signup: configs?.pages?.signup || "/?flow=signup",
//       passwordReset: configs?.pages?.passwordReset || "/?flow=password_reset",
//     },
//   };
//   return clientConfig;
// };
