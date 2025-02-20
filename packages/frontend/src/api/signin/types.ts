import { z } from "zod";
import {
  clientUsersIdentifierContactInformationsType,
  clientUsersIdentifiersProvider,
  settingsTenantAuthenticationStrategiesMethod,
  settingsTenantAuthenticationStrategiesProvider,
} from "../enums";
import {
  errorResponseItem,
  metadataResponseItem,
  sessionActivityMetadata,
} from "..";

const identifierItem = z.object({
  id: z.string(),
  provider: clientUsersIdentifiersProvider,
  logo: z.string(),
  value: z.string(),
  is_current: z.boolean(),
  is_password_enabled: z.boolean(),
  is_verified: z.boolean(),
  contact_informations: z.array(
    z.object({
      id: z.string(),
      type: clientUsersIdentifierContactInformationsType,
      value: z.string(),
      is_verified: z.boolean(),
    }),
  ),
  updated_at: z.number().int(),
  created_at: z.number().int(),
});

// POST /v1/signin/strategies
export const postGetAvailableSigninStrategiesBody = z.object({
  /** @property {enum} provider - The provider identify which user to signin */
  provider: z.enum(["email", "phone", "username"]),
  /** @property {string} value - The value of the provider. */
  value: z.string().min(4).max(255),
});

export const postGetAvailableSigninStrategiesResponseItem = z.object({
  id: z.string().min(36).max(36),
  provider: settingsTenantAuthenticationStrategiesProvider,
  method: settingsTenantAuthenticationStrategiesMethod,
  strategy: z.string(),
  title: z.string(),
  subtitle: z.string(),
});

export const postGetAvailableSigninStrategiesResponse = z.object({
  status: z.number(),
  error: errorResponseItem,
  metadata: metadataResponseItem,
  data: z.array(postGetAvailableSigninStrategiesResponseItem),
});

export type PostGetAvailableSigninStrategiesBody = z.infer<
  typeof postGetAvailableSigninStrategiesBody
>;

export type PostGetAvailableSigninStrategiesResponseItem = z.infer<
  typeof postGetAvailableSigninStrategiesResponseItem
>;

export type PostGetAvailableSigninStrategiesResponse = z.infer<
  typeof postGetAvailableSigninStrategiesResponse
>;

// POST /v1/signin/attempts
export const postAttemptSigninBody = z.object({
  /**
   * @property {string} captcha_token - The captcha token to validate the user. Currently support: Cloudflare Turnstile and Google reCAPTCHA.
   * Read more about the bot protection features here:
   * @{link: CakeAuth Bot Protection | https://docs.cakeauth.com/todo}.
   */
  captcha_token: z.string().optional().nullable(),
  /** @property {string} authentication_strategy - The authentication strategy to use. */
  authentication_strategy: z.string(),
  /** @property {enum} provider - The provider identify which user to signin */
  provider: z.enum(["email", "phone", "username"]),
  /** @property {string} value - The value of the provider. */
  value: z.string(),
});

export const postAttemptSigninResponseItem = z.object({
  attempt_id: z.string().min(36).max(36),
  authentication_strategy: z.string(),
  masked_target: z.string().nullable(),
  expires_at: z.number(),
  components: z.array(
    z.object({
      type: z.string(),
      label: z.string(),
      component_kind: z.enum(["button", "input"]),
      logo: z.string().nullable(),
      required: z.boolean(),
      configuration: z
        .object({
          client_id: z.string().nullable(),
          redirect_uri: z.string().nullable(),
          scopes: z.array(z.string()),
        })
        .nullable(),
    }),
  ),
});

export const postAttemptSigninResponse = z.object({
  status: z.number(),
  error: errorResponseItem,
  metadata: metadataResponseItem,
  data: postAttemptSigninResponseItem,
});

export type PostAttemptSigninBody = z.infer<typeof postAttemptSigninBody>;

export type PostAttemptSigninResponseItem = z.infer<
  typeof postAttemptSigninResponseItem
>;

export type PostAttemptSigninResponse = z.infer<
  typeof postAttemptSigninResponse
>;

// POST /v1/signin/attempts/:attempt_id/verify
export const postVerifySigninAttemptParams = z.object({
  attempt_id: z.string().min(36).max(36),
});

export const postVerifySigninAttemptBody = z.object({
  /** @property {string} code - The code to verify the user's attempt. Mutually exclusive with password. */
  code: z.string().optional(),
  /** @property {string} password - The password to verify the user's attempt. Mutually exclusive with code. */
  password: z.string().optional(),
});

export const postVerifySigninAttemptResponseItem = z.object({
  id: z.string(),
  user: z.object({
    id: z.string(),
    external_id: z.string(),
  }),
  status: z.string(),
  metadata: sessionActivityMetadata.nullable(),
  identifiers: z.array(identifierItem),
  token: z.object({
    name: z.string(),
    value: z.string(),
    expires_at: z.number(),
    domain: z.string(),
  }),
  expires_at: z.number().nullable(),
  revoked_at: z.number().nullable(),
  updated_at: z.number(),
  created_at: z.number(),
});

export const postVerifySigninAttemptResponse = z.object({
  status: z.number(),
  error: errorResponseItem,
  metadata: metadataResponseItem,
  data: postVerifySigninAttemptResponseItem,
});

export type PostVerifySigninAttemptParams = z.infer<
  typeof postVerifySigninAttemptParams
>;

export type PostVerifySigninAttemptBody = z.infer<
  typeof postVerifySigninAttemptBody
>;

export type PostVerifySigninAttemptResponseItem = z.infer<
  typeof postVerifySigninAttemptResponseItem
>;

export type PostVerifySigninAttemptResponse = z.infer<
  typeof postVerifySigninAttemptResponse
>;
