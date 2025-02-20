import { z } from "zod";
import {
  clientUsersIdentifierContactInformationsType,
  clientUsersIdentifiersProvider,
  clientUsersStatus,
} from "../enums";
import { errorResponseItem, metadataResponseItem } from "..";

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

export const meItem = z.object({
  id: z.string(),
  external_id: z.string(),
  status: clientUsersStatus,
  identifiers: z.array(identifierItem),
  updated_at: z.number(),
  created_at: z.number(),
});

export type MeItem = z.infer<typeof meItem>;

// GET /v1/me
export const getMeResponseItem = meItem;

export const getMeResponse = z.object({
  status: z.number(),
  metadata: metadataResponseItem,
  error: errorResponseItem,
  data: getMeResponseItem,
});

export type GetMeResponseItem = z.infer<typeof getMeResponseItem>;

export type GetMeResponse = z.infer<typeof getMeResponse>;

// POST /v1/me/reset_password
export const postMeResetPasswordBody = z.object({
  /** @property {string} current_password - The user's current password. */
  current_password: z.string(),
  /** @property {string} new_password - The new password to set for the user. */
  new_password: z.string(),
  /** @property {boolean} revoke_other_sessions - If `true` revoke other active sessions (except the current one). */
  revoke_other_sessions: z.boolean(),
});

export const postMeResetPasswordResponseItem = z.object({
  message: z.string(),
});

export const postMeResetPasswordResponse = z.object({
  status: z.number(),
  metadata: metadataResponseItem,
  error: errorResponseItem,
  data: postMeResetPasswordResponseItem,
});

export type PostMeResetPasswordBody = z.infer<typeof postMeResetPasswordBody>;

export type PostMeResetPasswordResponseItem = z.infer<
  typeof postMeResetPasswordResponseItem
>;

export type PostMeResetPasswordResponse = z.infer<
  typeof postMeResetPasswordResponse
>;
