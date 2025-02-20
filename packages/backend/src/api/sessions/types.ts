import {
  clientUsersIdentifierContactInformationsType,
  clientUsersIdentifiersProvider,
} from "../enums";
import {
  errorResponseItem,
  metadataResponseItem,
  paginationQuery,
  sessionActivityMetadata,
} from "..";
import { z } from "zod";

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

// GET /v1/sessions
export const getSessionsQueries = z.object({
  ...paginationQuery.shape,
  environment_id: z.string().length(36).optional(),
  user_id: z.string().max(64).optional(),
});

export const getSessionsResponseItem = z.object({
  id: z.string(),
  user: z.object({
    id: z.string(),
    external_id: z.string(),
  }),
  status: z.string(),
  metadata: z.nullable(sessionActivityMetadata),
  identifiers: z.array(identifierItem),
  expires_at: z.nullable(z.number()),
  revoked_at: z.nullable(z.number()),
  updated_at: z.number(),
  created_at: z.number(),
});

export const getSessionsResponse = z.object({
  status: z.number(),
  metadata: metadataResponseItem,
  error: errorResponseItem,
  data: z.array(getSessionsResponseItem),
});

export type GetSessionsQueries = z.infer<typeof getSessionsQueries>;
export type GetSessionsResponseItem = z.infer<typeof getSessionsResponseItem>;
export type GetSessionsResponse = z.infer<typeof getSessionsResponse>;

// POST /v1/sessions
export const postCreateSessionQueries = z.object({
  environment_id: z.string().length(36).optional(),
});

export const postCreateSessionBody = z.object({
  user_id: z.string().max(64).optional(),
  identifier_id: z.string().length(36).optional(),
  issue_tokens: z.boolean().default(true),
  token_metadata: z.object({
    origin: z.string(),
  }),
});

export const postCreateSessionResponseItem = z.object({
  ...getSessionsResponseItem.shape,
  token: z.nullable(
    z.object({
      name: z.string(),
      value: z.string(),
      expires_at: z.number(),
      domain: z.string(),
    }),
  ),
  refresh_token: z.nullable(
    z.object({
      name: z.string(),
      value: z.string(),
      expires_at: z.number(),
      domain: z.string(),
    }),
  ),
});

export const postCreateSessionResponse = z.object({
  status: z.number(),
  metadata: metadataResponseItem,
  error: errorResponseItem,
  data: postCreateSessionResponseItem,
});

export type PostCreateSessionQueries = z.infer<typeof postCreateSessionQueries>;
export type PostCreateSessionBody = z.infer<typeof postCreateSessionBody>;
export type PostCreateSessionResponseItem = z.infer<
  typeof postCreateSessionResponseItem
>;
export type PostCreateSessionResponse = z.infer<
  typeof postCreateSessionResponse
>;

// POST /v1/sessions/:session_id/revoke
export const postRevokeSessionParams = z.object({
  session_id: z.string().length(36),
});

export const postRevokeSessionQueries = z.object({
  environment_id: z.string().length(36).optional(),
});

export const postRevokeSessionResponseItem = getSessionsResponseItem;

export const postRevokeSessionResponse = z.object({
  status: z.number(),
  metadata: metadataResponseItem,
  error: errorResponseItem,
  data: postRevokeSessionResponseItem,
});

export type PostRevokeSessionParams = z.infer<typeof postRevokeSessionParams>;
export type PostRevokeSessionQueries = z.infer<typeof postRevokeSessionQueries>;
export type PostRevokeSessionResponseItem = z.infer<
  typeof postRevokeSessionResponseItem
>;
export type PostRevokeSessionResponse = z.infer<
  typeof postRevokeSessionResponse
>;

// POST /v1/sessions/:session_id/tokens
export const postRefreshSessionTokenParams = z.object({
  session_id: z.string().length(36),
});

export const postRefreshSessionTokenQueries = z.object({
  environment_id: z.string().length(36).optional(),
});

export const postRefreshSessionTokenResponseItem = z.object({
  ...getSessionsResponseItem.shape,
  token: z.nullable(
    z.object({
      name: z.string(),
      value: z.string(),
      expires_at: z.number(),
      domain: z.string(),
    }),
  ),
});

export const postRefreshSessionTokenResponse = z.object({
  status: z.number(),
  metadata: metadataResponseItem,
  error: errorResponseItem,
  data: postRefreshSessionTokenResponseItem,
});

export type PostRefreshSessionTokenParams = z.infer<
  typeof postRefreshSessionTokenParams
>;
export type PostRefreshSessionTokenQueries = z.infer<
  typeof postRefreshSessionTokenQueries
>;
export type PostRefreshSessionTokenResponseItem = z.infer<
  typeof postRefreshSessionTokenResponseItem
>;
export type PostRefreshSessionTokenResponse = z.infer<
  typeof postRefreshSessionTokenResponse
>;
