import { z } from "zod";
import {
  settingsTenantAuthenticationStrategiesMethod,
  settingsTenantAuthenticationStrategiesProvider,
  settingsTenantEnvironmentsCaptchaType,
  settingsTenantEnvironmentsTimeUnit,
  settingsTenantIdentifiersProvider,
} from "../enums";
import { errorResponseItem, metadataResponseItem } from "..";

export const authorizedDomainItem = z.object({
  id: z.string().length(36),
  domain: z.string(),
  created_at: z.number(),
});

export type AuthorizedDomainItem = z.infer<typeof authorizedDomainItem>;

// GET /v1/settings
export const getSettingsResponseItem = z.object({
  project: z.object({
    id: z.string().length(36),
    name: z.string(),
  }),
  environment: z.object({
    id: z.string().length(36),
    host: z.string(),
    name: z.string(),
    is_production: z.boolean(),
    configuration: z
      .object({
        support_link: z.string(),
        allow_signup: z.boolean(),
        session_lifetime: z.object({
          value: z.number(),
          unit: settingsTenantEnvironmentsTimeUnit,
        }),
        inactivity_timeout: z
          .object({
            value: z.number(),
            unit: settingsTenantEnvironmentsTimeUnit,
          })
          .nullable(),
        attempt_limit: z.number().nullable(),
        lockout: z
          .object({
            value: z.number(),
            unit: settingsTenantEnvironmentsTimeUnit,
          })
          .nullable(),
        captcha: z
          .object({
            site_key: z.string(),
            type: settingsTenantEnvironmentsCaptchaType,
          })
          .nullable(),
        disable_email_sub_address: z.boolean(),
        email_deny_list: z.array(z.string()),
        email_allow_list: z.array(z.string()),
        phone_deny_list: z.array(z.string()),
        phone_allow_list: z.array(z.string()),
      })
      .nullable(),
  }),
  domains: z.array(authorizedDomainItem),
  signup_forms: z.array(
    z.object({
      provider: settingsTenantIdentifiersProvider,
      group: z.enum(["social", "direct"]),
      verification_strategies: z.array(
        z.object({
          id: z.string(),
          provider: settingsTenantAuthenticationStrategiesProvider,
          method: settingsTenantAuthenticationStrategiesMethod,
          strategy: z.string(),
          title: z.string(),
          subtitle: z.string(),
        }),
      ),
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
    }),
  ),
  signin_forms: z.array(
    z.object({
      provider: settingsTenantIdentifiersProvider,
      group: z.enum(["social", "direct"]),
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
    }),
  ),
});

export const getSettingsResponse = z.object({
  status: z.number(),
  error: errorResponseItem,
  metadata: metadataResponseItem,
  data: getSettingsResponseItem,
});

export type GetSettingsResponseItem = z.infer<typeof getSettingsResponseItem>;

export type GetSettingsResponse = z.infer<typeof getSettingsResponse>;
