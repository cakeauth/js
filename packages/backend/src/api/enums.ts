import { z } from "zod";

export const tenantOrganizationStatus = z.enum(["active", "inactive"]);
export type TenantOrganizationStatus = z.infer<typeof tenantOrganizationStatus>;

export const tenantMembersProvider = z.enum(["github", "google", "email"]);
export type TenantMembersProvider = z.infer<typeof tenantMembersProvider>;

export const tenantMembersStatus = z.enum([
  "active",
  "inactive",
  "banned",
  "pending",
]);
export type TenantMembersStatus = z.infer<typeof tenantMembersStatus>;

export const accessClientUsersAttemptsType = z.enum([
  "signin",
  "signup",
  "password_reset",
  "handshake",
]);
export type AccessClientUsersAttemptsType = z.infer<
  typeof accessClientUsersAttemptsType
>;

export const accessClientUsersAttemptsStatus = z.enum([
  "active",
  "used",
  "revoked",
]);
export type AccessClientUsersAttemptsStatus = z.infer<
  typeof accessClientUsersAttemptsStatus
>;

export const accessTenantMembersAttemptsType = z.enum([
  "password_reset",
  "signup",
]);
export type AccessTenantMembersAttemptsType = z.infer<
  typeof accessTenantMembersAttemptsType
>;

export const accessTenantMembersAttemptsStatus = z.enum([
  "active",
  "used",
  "revoked",
]);
export type AccessTenantMembersAttemptsStatus = z.infer<
  typeof accessTenantMembersAttemptsStatus
>;

export const tenantProjectsStatus = z.enum(["active", "inactive"]);
export type TenantProjectsStatus = z.infer<typeof tenantProjectsStatus>;

export const tenantKeysType = z.enum(["public", "private"]);
export type TenantKeysType = z.infer<typeof tenantKeysType>;

export const accessTenantMembersSessionsStatus = z.enum([
  "active",
  "expired",
  "replaced",
  "revoked",
]);
export type AccessTenantMembersSessionsStatus = z.infer<
  typeof accessTenantMembersSessionsStatus
>;

export const clientUsersStatus = z.enum(["active", "banned", "invited"]);
export type ClientUsersStatus = z.infer<typeof clientUsersStatus>;

export const clientUsersIdentifiersProvider = z.enum([
  "email",
  "username",
  "phone",
  "google",
  "facebook",
  "apple",
  "github",
  "microsoft",
  "linkedin",
  "dropbox",
  "twitch",
  "discord",
  "tiktok",
  "gitlab",
  "slack",
]);
export type ClientUsersIdentifiersProvider = z.infer<
  typeof clientUsersIdentifiersProvider
>;

export const clientUsersIdentifierContactInformationsType = z.enum([
  "email",
  "phone",
]);
export type ClientUsersIdentifierContactInformationsType = z.infer<
  typeof clientUsersIdentifierContactInformationsType
>;

export const accessClientUsersSessionsStatus = z.enum([
  "active",
  "expired",
  "replaced",
  "revoked",
  "timeout",
]);
export type AccessClientUsersSessionsStatus = z.infer<
  typeof accessClientUsersSessionsStatus
>;

export const settingsTenantEnvironmentsTimeUnit = z.enum([
  "day",
  "hour",
  "minute",
  "second",
]);
export type SettingsTenantEnvironmentsTimeUnit = z.infer<
  typeof settingsTenantEnvironmentsTimeUnit
>;

export const settingsTenantEnvironmentsCaptchaType = z.enum([
  "turnstile",
  "recaptcha",
]);
export type SettingsTenantEnvironmentsCaptchaType = z.infer<
  typeof settingsTenantEnvironmentsCaptchaType
>;

export const settingsTenantContactInformationsProvider = z.enum([
  "email",
  "phone",
  "username",
  "provider_id",
]);
export type SettingsTenantContactInformationsProvider = z.infer<
  typeof settingsTenantContactInformationsProvider
>;

export const settingsTenantAuthenticationStrategiesProvider = z.enum([
  "email",
  "phone_sms",
  "phone_call",
  "phone_whatsapp",
  "username",
  "username_email",
  "username_sms",
  "username_whatsapp",
]);
export type SettingsTenantAuthenticationStrategiesProvider = z.infer<
  typeof settingsTenantAuthenticationStrategiesProvider
>;

export const settingsTenantAuthenticationStrategiesMethod = z.enum([
  "password",
  "code",
  "magic_link",
]);
export type SettingsTenantAuthenticationStrategiesMethod = z.infer<
  typeof settingsTenantAuthenticationStrategiesMethod
>;

export const settingsTenantIdentifiersProvider = z.enum([
  "email",
  "username",
  "phone",
  "google",
  "facebook",
  "apple",
  "github",
  "microsoft",
  "linkedin",
  "dropbox",
  "twitch",
  "discord",
  "tiktok",
  "gitlab",
  "slack",
]);
export type SettingsTenantIdentifiersProvider = z.infer<
  typeof settingsTenantIdentifiersProvider
>;
