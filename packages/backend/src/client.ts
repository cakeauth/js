import { IdentifiersClient } from "./api/identifiers/index.js";
import { SessionsClient } from "./api/sessions/index.js";
import { UsersClient } from "./api/users/index.js";
import HTTPClient, { ClientOptions } from "./http.js";
import { isCakeAuthPublicKey } from "./token.js";

export class BaseClient extends HTTPClient {
  localPath = "/v1";
  onError = console.error;

  constructor(options: ClientOptions) {
    if (options.privateKey && isCakeAuthPublicKey(options.privateKey)) {
      throw new Error(
        "You are using a public key (`pub_...`) for interacting with the backend APIs. Please use a private key (`sec_...`) instead!",
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
  identifiers: IdentifiersClient;
  sessions: SessionsClient;
  users: UsersClient;

  constructor(...args: ConstructorParameters<typeof BaseClient>) {
    super(...args);
    this.identifiers = new IdentifiersClient(this.client, this.localPath);
    this.sessions = new SessionsClient(this.client, this.localPath);
    this.users = new UsersClient(this.client, this.localPath);
  }
}
