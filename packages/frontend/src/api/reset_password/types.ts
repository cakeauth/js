import { z } from "zod";
import { metadataResponseItem, errorResponseItem } from "..";

// POST /v1/reset_password/attempts
export const postAttemptResetPasswordBody = z.object({
  /** @property {enum} provider - The provider identify which user to reset the password. */
  provider: z.enum(["email", "phone", "username"]),
  /** @property {string} value - The value of the provider. */
  value: z.string(),
  /** @property {string} target_url - The URL that host password reset page. */
  target_url: z.string(),
  /** @property {string} captcha_token - The captcha token. */
  captcha_token: z.string().optional(),
});

export const postAttemptResetPasswordResponseItem = z.object({
  attempt_id: z.string(),
  provider: z.enum(["email", "phone", "username"]),
  expires_at: z.number().int(),
  masked_target: z.string().nullable(),
  medium: z.enum(["email", "sms", "whatsapp"]),
});

export const postAttemptResetPasswordResponse = z.object({
  status: z.number().int(),
  metadata: metadataResponseItem,
  error: errorResponseItem,
  data: postAttemptResetPasswordResponseItem,
});

export type PostAttemptResetPasswordBody = z.infer<
  typeof postAttemptResetPasswordBody
>;

export type PostAttemptResetPasswordResponseItem = z.infer<
  typeof postAttemptResetPasswordResponseItem
>;

export type PostAttemptResetPasswordResponse = z.infer<
  typeof postAttemptResetPasswordResponse
>;

// POST /v1/reset_password/attempts/:attempt_id/verify
export const postVerifyResetPasswordAttemptParams = z.object({
  attempt_id: z.string().min(36).max(36),
});

export const postVerifyResetPasswordAttemptBody = z.object({
  /** @property {string} new_password - The new password to set for the user. */
  new_password: z.string(),
  /** @property {string} token - The ephemeral token to verify the reset password request. */
  token: z.string().min(36).max(36),
});

export const postVerifyResetPasswordAttemptResponseItem = z.object({
  message: z.string(),
});

export const postVerifyResetPasswordAttemptResponse = z.object({
  status: z.number().int(),
  metadata: metadataResponseItem,
  error: errorResponseItem,
  data: postVerifyResetPasswordAttemptResponseItem,
});

export type PostVerifyResetPasswordAttemptParams = z.infer<
  typeof postVerifyResetPasswordAttemptParams
>;

export type PostVerifyResetPasswordAttemptBody = z.infer<
  typeof postVerifyResetPasswordAttemptBody
>;

export type PostVerifyResetPasswordAttemptResponseItem = z.infer<
  typeof postVerifyResetPasswordAttemptResponseItem
>;

export type PostVerifyResetPasswordAttemptResponse = z.infer<
  typeof postVerifyResetPasswordAttemptResponse
>;
