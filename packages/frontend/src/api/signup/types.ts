import { z } from "zod";
import {
  clientUsersIdentifierContactInformationsType,
  clientUsersIdentifiersProvider,
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

export const attemptItem = z.object({
  attempt_id: z.string().min(36).max(36),
  verification_strategy: z.string(),
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

export const sessionItem = z.object({
  id: z.string(),
  user: z.object({
    id: z.string(),
    external_id: z.string(),
  }),
  status: z.string(),
  metadata: z.optional(sessionActivityMetadata),
  token: z.object({
    name: z.string(),
    value: z.string(),
    expires_at: z.number(),
    domain: z.string(),
  }),
  identifiers: z.array(identifierItem),
  expires_at: z.number().nullable(),
  revoked_at: z.number().nullable(),
  updated_at: z.number(),
  created_at: z.number(),
});

// POST /v1/signup/attempts
export const postAttemptSignupBody = z.object({
  /**
   * @property {string} captcha_token - The captcha token to validate the user. Currently support: Cloudflare Turnstile and Google reCAPTCHA.
   * Read more about the bot protection features here:
   * @{link: CakeAuth Bot Protection | https://docs.cakeauth.com/todo}.
   */
  captcha_token: z.union([z.string(), z.null()]).optional(),
  /** @property {string} verification_strategy - The verification strategy to use to verify the new user. */
  verification_strategy: z.string(),
  /** @property {enum} provider - The provider type identify */
  provider: z.enum(["email", "phone", "username"]),
  /** @property {string} value - The value of the provider. */
  value: z.string(),
  /** @property {string} external_id - Unique identifier for the user. You can use this to identify the user in your system. */
  external_id: z.string().max(64).optional(),
  /** @property {string} password - (Optional) The password to set for the user. */
  password: z.string().optional(),
  /** @property {array} contact_informations - (Optional) The contact informations to set for the user. */
  contact_informations: z
    .array(
      z.object({
        /**
         * @property {enum} type - The type of the contact information.
         * The following types are supported:
         * - email
         * - phone
         */
        type: clientUsersIdentifierContactInformationsType,
        /** @property {string} value - The value of the contact information. */
        value: z.string(),
      }),
    )
    .optional(),
});

export const postAttemptSignupResponseItem = z.object({
  is_user_created: z.boolean(),
  attempt: z.optional(attemptItem),
  session: z.optional(sessionItem),
});

export const postAttemptSignupResponse = z.object({
  status: z.number(),
  error: errorResponseItem,
  metadata: metadataResponseItem,
  data: postAttemptSignupResponseItem,
});

export type PostAttemptSignupBody = z.infer<typeof postAttemptSignupBody>;

export type PostAttemptSignupResponseItem = z.infer<
  typeof postAttemptSignupResponseItem
>;

export type PostAttemptSignupResponse = z.infer<
  typeof postAttemptSignupResponse
>;

// POST /v1/signup/attempts/:attempt_id/verify
export const postVerifySignupAttemptParams = z.object({
  attempt_id: z.string().min(36).max(36),
});

export const postVerifySignupAttemptBody = z.object({
  /** @property {string} code - The code to verify the user's attempt. */
  code: z.string(),
});

export const postVerifySignupAttemptResponseItem = sessionItem;

export const postVerifySignupAttemptResponse = z.object({
  status: z.number(),
  error: errorResponseItem,
  metadata: metadataResponseItem,
  data: postVerifySignupAttemptResponseItem,
});

export type PostVerifySignupAttemptParams = z.infer<
  typeof postVerifySignupAttemptParams
>;

export type PostVerifySignupAttemptBody = z.infer<
  typeof postVerifySignupAttemptBody
>;

export type PostVerifySignupAttemptResponseItem = z.infer<
  typeof postVerifySignupAttemptResponseItem
>;

export type PostVerifySignupAttemptResponse = z.infer<
  typeof postVerifySignupAttemptResponse
>;
