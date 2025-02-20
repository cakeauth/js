import { MeClient } from "./api/me";
import { ResetPasswordClient } from "./api/reset_password";
import { SessionsClient } from "./api/sessions";
import { SettingsClient } from "./api/settings";
import { SigninClient } from "./api/signin";
import { SignupClient } from "./api/signup";
import HTTPClient, { ClientOptions } from "./http.js";
import { isCakeAuthPrivateKey } from "./token.js";

export class BaseClient extends HTTPClient {
  localPath = "/v1";
  onError = console.error;

  constructor(options: ClientOptions) {
    if (options.publicKey && isCakeAuthPrivateKey(options.publicKey)) {
      throw new Error(
        "You are using a private key (`sec_...`) for interacting with the frontend APIs. Please use a public key (`pub_...`) instead!",
      );
    }

    super(options);
    if (options.onError) {
      this.onError = options.onError;
    }
  }
}

/**
 * CakeAuth's default client
 *
 * @param options - The options passed to the client
 *
 */
export class CakeAuth extends BaseClient {
  me: MeClient;
  resetPassword: ResetPasswordClient;
  sessions: SessionsClient;
  settings: SettingsClient;
  signin: SigninClient;
  signup: SignupClient;

  constructor(...args: ConstructorParameters<typeof BaseClient>) {
    super(...args);
    this.me = new MeClient(this.client, this.localPath);
    this.resetPassword = new ResetPasswordClient(this.client, this.localPath);
    this.sessions = new SessionsClient(this.client, this.localPath);
    this.settings = new SettingsClient(this.client, this.localPath);
    this.signin = new SigninClient(this.client, this.localPath);
    this.signup = new SignupClient(this.client, this.localPath);
  }
}
