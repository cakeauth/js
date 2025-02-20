import { z } from "zod";
import {
  accessClientUsersSessionsStatus,
  clientUsersIdentifierContactInformationsType,
  clientUsersIdentifiersProvider,
} from "../enums";
import {
  metadataResponseItem,
  errorResponseItem,
  sessionActivityMetadata,
  paginationQuery,
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

// GET /v1/sessions
export const getSessionsQueries = z.object({
  ...paginationQuery.shape,
  status: z.union([z.string(), accessClientUsersSessionsStatus]).optional(),
});

export const getSessionsResponseItem = z.object({
  id: z.string(),
  user: z.object({
    id: z.string(),
    external_id: z.string(),
  }),
  status: z.string(),
  metadata: sessionActivityMetadata.nullable(),
  identifiers: z.array(identifierItem),
  expires_at: z.number().nullable(),
  revoked_at: z.number().nullable(),
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

// GET /v1/sessions/handshake/:handshake_id
export const getHandshakeSessionParams = z.object({
  handshake_id: z.string().min(36).max(36),
});

export const getHandshakeSessionResponseItem = z.object({
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
    expires_at: z.number().int(),
    domain: z.string(),
  }),
  expires_at: z.number().int().nullable(),
  revoked_at: z.number().int().nullable(),
  updated_at: z.number().int(),
  created_at: z.number().int(),
});

export const getHandshakeSessionResponse = z.object({
  status: z.number().int(),
  metadata: metadataResponseItem,
  error: errorResponseItem,
  data: getHandshakeSessionResponseItem,
});

export type GetHandshakeSessionParams = z.infer<
  typeof getHandshakeSessionParams
>;
export type GetHandshakeSessionResponseItem = z.infer<
  typeof getHandshakeSessionResponseItem
>;
export type GetHandshakeSessionResponse = z.infer<
  typeof getHandshakeSessionResponse
>;

// GET /v1/sessions/details
export const getSessionDetailsResponseItem = z.object({
  id: z.string(),
  user: z.object({
    id: z.string(),
    external_id: z.string(),
  }),
  status: z.string(),
  metadata: sessionActivityMetadata.nullable(),
  identifiers: z.array(identifierItem),
  expires_at: z.number().int().nullable(),
  revoked_at: z.number().int().nullable(),
  updated_at: z.number().int(),
  created_at: z.number().int(),
});

export const getSessionDetailsResponse = z.object({
  status: z.number(),
  metadata: metadataResponseItem,
  error: errorResponseItem,
  data: getSessionDetailsResponseItem,
});

export type GetSessionDetailsResponseItem = z.infer<
  typeof getSessionDetailsResponseItem
>;
export type GetSessionDetailsResponse = z.infer<
  typeof getSessionDetailsResponse
>;

// POST /v1/sessions/tokens
export const postRefreshAccessTokenResponseItem = z.object({
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
    expires_at: z.number().int(),
    domain: z.string(),
  }),
  expires_at: z.number().int().nullable(),
  revoked_at: z.number().int().nullable(),
  updated_at: z.number().int(),
  created_at: z.number().int(),
});

export const postRefreshAccessTokenResponse = z.object({
  status: z.number().int(),
  metadata: metadataResponseItem,
  error: errorResponseItem,
  data: postRefreshAccessTokenResponseItem,
});

export type PostRefreshAccessTokenResponseItem = z.infer<
  typeof postRefreshAccessTokenResponseItem
>;
export type PostRefreshAccessTokenResponse = z.infer<
  typeof postRefreshAccessTokenResponse
>;

// POST /v1/sessions/revoke
export const postRevokeSessionQueries = z.object({
  session_id: z.string().optional(),
});

export const postRevokeSessionResponseItem = z.object({
  message: z.string(),
});

export const postRevokeSessionResponse = z.object({
  status: z.number().int(),
  metadata: metadataResponseItem,
  error: errorResponseItem,
  data: postRevokeSessionResponseItem,
});

export type PostRevokeSessionQueries = z.infer<typeof postRevokeSessionQueries>;

export type PostRevokeSessionResponseItem = z.infer<
  typeof postRevokeSessionResponseItem
>;
export type PostRevokeSessionResponse = z.infer<
  typeof postRevokeSessionResponse
>;
