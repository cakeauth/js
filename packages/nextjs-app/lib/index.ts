import { createRouteMatcher } from "./server/createRouteMatcher";
import cakeauthMiddleware from "./server/middleware";

export {
  CakeAuthLoaded,
  CakeAuthLoading,
  CakeAuthProvider,
  Captcha,
  PasswordReset,
  PasswordResetCard,
  SignIn,
  SignInCard,
  SignUp,
  SignUpCard,
  SignedIn,
  SignedOut,
  UserButton,
  UserDialog,
  getGitHubOAuthUrl,
  getGoogleOAuthUrl,
  getOAuthUrl,
  redirectTo,
  useHandshakeExchange,
  useRefreshAccessToken,
  useSession,
  useSettings,
  useSignout,
  useUser,
} from "@cakeauth/react";

export { createRouteMatcher, cakeauthMiddleware };
