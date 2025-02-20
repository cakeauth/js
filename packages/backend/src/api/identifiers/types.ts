import {
  clientUsersIdentifierContactInformationsType,
  clientUsersIdentifiersProvider,
} from "../enums";
import { errorResponseItem, metadataResponseItem, paginationQuery } from "..";
import { z } from "zod";

// GET /v1/identifiers
export const getIdentifiersQueries = z.object({
  ...paginationQuery.shape,
  user_id: z.string().max(64),
  environment_id: z.string().length(36).optional(),
});

export const getIdentifiersResponseItem = z.object({
  id: z.string(),
  provider: clientUsersIdentifiersProvider,
  logo: z.string(),
  value: z.string(),
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
  updated_at: z.number(),
  created_at: z.number(),
});

export const getIdentifiersResponse = z.object({
  status: z.number(),
  error: errorResponseItem,
  metadata: metadataResponseItem,
  data: z.array(getIdentifiersResponseItem),
});

export type GetIdentifiersQueries = z.infer<typeof getIdentifiersQueries>;
export type GetIdentifiersResponseItem = z.infer<
  typeof getIdentifiersResponseItem
>;
export type GetIdentifiersResponse = z.infer<typeof getIdentifiersResponse>;

// POST /v1/identifiers
export const postCreateIdentifierQueries = z.object({
  environment_id: z.string().length(36).optional(),
});

export const postCreateIdentifierBody = z.object({
  user_id: z.string().max(64),
  provider: clientUsersIdentifiersProvider,
  value: z.string(),
  password: z.string().min(8).optional(),
  is_verified: z.boolean().optional(),
  contact_informations: z
    .array(
      z.object({
        type: clientUsersIdentifierContactInformationsType,
        value: z.string(),
        is_verified: z.boolean().optional(),
      }),
    )
    .optional(),
});

export const postCreateIdentifierResponseItem = getIdentifiersResponseItem;

export const postCreateIdentifierResponse = z.object({
  status: z.number(),
  error: errorResponseItem,
  metadata: metadataResponseItem,
  data: postCreateIdentifierResponseItem,
});

export type PostCreateIdentifierQueries = z.infer<
  typeof postCreateIdentifierQueries
>;
export type PostCreateIdentifierBody = z.infer<typeof postCreateIdentifierBody>;
export type PostCreateIdentifierResponseItem = z.infer<
  typeof postCreateIdentifierResponseItem
>;
export type PostCreateIdentifierResponse = z.infer<
  typeof postCreateIdentifierResponse
>;

// DELETE /v1/identifiers/:identifier_id
export const deleteIdentifierParams = z.object({
  identifier_id: z.string().length(36),
});

export const deleteIdentifierQueries = z.object({
  environment_id: z.string().length(36).optional(),
});

export const deleteIdentifierResponse = z.object({
  status: z.number(),
  error: errorResponseItem,
  metadata: metadataResponseItem,
  data: z.object({
    message: z.string(),
  }),
});

export type DeleteIdentifierParams = z.infer<typeof deleteIdentifierParams>;
export type DeleteIdentifierQueries = z.infer<typeof deleteIdentifierQueries>;
export type DeleteIdentifierResponse = z.infer<typeof deleteIdentifierResponse>;

// POST /v1/identifiers/:identifier_id/set_password
export const postSetIdentifierPasswordParams = z.object({
  identifier_id: z.string().length(36),
});

export const postSetIdentifierPasswordQueries = z.object({
  environment_id: z.string().length(36).optional(),
});

export const postSetIdentifierPasswordBody = z.object({
  new_password: z.string().min(8),
  force_set: z.boolean().optional(),
});

export const postSetIdentifierPasswordResponse = z.object({
  status: z.number(),
  error: errorResponseItem,
  metadata: metadataResponseItem,
  data: z.object({
    message: z.string(),
  }),
});

export type PostSetIdentifierPasswordParams = z.infer<
  typeof postSetIdentifierPasswordParams
>;
export type PostSetIdentifierPasswordQueries = z.infer<
  typeof postSetIdentifierPasswordQueries
>;
export type PostSetIdentifierPasswordBody = z.infer<
  typeof postSetIdentifierPasswordBody
>;
export type PostSetIdentifierPasswordResponse = z.infer<
  typeof postSetIdentifierPasswordResponse
>;
