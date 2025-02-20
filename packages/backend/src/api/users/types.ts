import {
  clientUsersIdentifierContactInformationsType,
  clientUsersIdentifiersProvider,
  clientUsersStatus,
} from "../enums";
import { errorResponseItem, metadataResponseItem, paginationQuery } from "..";
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

// GET /v1/users
export const getUsersQueries = z.object({
  ...paginationQuery.shape,
  environment_id: z.string().length(36).optional(),
  search: z.string().optional(),
  status: z
    .union([
      z.string().length(0), // Status can be an empty string
      z.string(),
    ])
    .optional(),
});

export const getUsersResponseItem = z.object({
  id: z.string(),
  external_id: z.string(),
  status: clientUsersStatus,
  identifiers: z.array(identifierItem),
  updated_at: z.number(),
  created_at: z.number(),
});

export const getUsersResponse = z.object({
  status: z.number(),
  error: errorResponseItem,
  metadata: metadataResponseItem,
  data: z.array(getUsersResponseItem),
});

export type GetUsersQueries = z.infer<typeof getUsersQueries>;
export type GetUsersResponseItem = z.infer<typeof getUsersResponseItem>;
export type GetUsersResponse = z.infer<typeof getUsersResponse>;

// GET /v1/users/:user_id
export const getUserDetailsParams = z.object({
  user_id: z.string().max(64),
});

export const getUserDetailsQueries = z.object({
  environment_id: z.string().length(36).optional(),
});

export const getUserDetailsResponseItem = z.object({
  id: z.string(),
  external_id: z.string(),
  status: clientUsersStatus,
  identifiers: z.array(identifierItem),
  updated_at: z.number(),
  created_at: z.number(),
});

export const getUserDetailsResponse = z.object({
  status: z.number(),
  error: errorResponseItem,
  metadata: metadataResponseItem,
  data: getUserDetailsResponseItem,
});

export type GetUserDetailsParams = z.infer<typeof getUserDetailsParams>;
export type GetUserDetailsQueries = z.infer<typeof getUserDetailsQueries>;
export type GetUserDetailsResponseItem = z.infer<
  typeof getUserDetailsResponseItem
>;
export type GetUserDetailsResponse = z.infer<typeof getUserDetailsResponse>;

// POST /v1/users
export const postCreateUserQueries = z.object({
  environment_id: z.string().length(36).optional(),
});

export const postCreateUserBody = z.object({
  external_id: z.string(),
  identifiers: z.array(
    z.object({
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
    }),
  ),
});

export const postCreateUserResponseItem = getUsersResponseItem;

export const postCreateUserResponse = z.object({
  status: z.number(),
  error: errorResponseItem,
  metadata: metadataResponseItem,
  data: postCreateUserResponseItem,
});

export type PostCreateUserQueries = z.infer<typeof postCreateUserQueries>;
export type PostCreateUserBody = z.infer<typeof postCreateUserBody>;
export type PostCreateUserResponseItem = z.infer<
  typeof postCreateUserResponseItem
>;
export type PostCreateUserResponse = z.infer<typeof postCreateUserResponse>;

// POST /v1/users/:user_id/ban
export const postBanUserParams = z.object({
  user_id: z.string().max(64),
});

export const postBanUserQueries = z.object({
  environment_id: z.string().length(36).optional(),
});

export const postBanUserResponseItem = getUsersResponseItem;

export const postBanUserResponse = z.object({
  status: z.number(),
  error: errorResponseItem,
  metadata: metadataResponseItem,
  data: postBanUserResponseItem,
});

export type PostBanUserParams = z.infer<typeof postBanUserParams>;
export type PostBanUserQueries = z.infer<typeof postBanUserQueries>;
export type PostBanUserResponseItem = z.infer<typeof postBanUserResponseItem>;
export type PostBanUserResponse = z.infer<typeof postBanUserResponse>;

// POST /v1/users/:user_id/unban
export const postUnbanUserParams = z.object({
  user_id: z.string().max(64),
});

export const postUnbanUserQueries = z.object({
  environment_id: z.string().length(36).optional(),
});

export const postUnbanUserResponseItem = getUsersResponseItem;

export const postUnbanUserResponse = z.object({
  status: z.number(),
  error: errorResponseItem,
  metadata: metadataResponseItem,
  data: postUnbanUserResponseItem,
});

export type PostUnbanUserParams = z.infer<typeof postUnbanUserParams>;
export type PostUnbanUserQueries = z.infer<typeof postUnbanUserQueries>;
export type PostUnbanUserResponseItem = z.infer<
  typeof postUnbanUserResponseItem
>;
export type PostUnbanUserResponse = z.infer<typeof postUnbanUserResponse>;

// DELETE /v1/users/:user_id
export const deleteUserParams = z.object({
  user_id: z.string().max(64),
});

export const deleteUserQueries = z.object({
  environment_id: z.string().length(36).optional(),
});

export const deleteUserResponseItem = z.object({
  message: z.string(),
});

export const deleteUserResponse = z.object({
  status: z.number(),
  error: errorResponseItem,
  metadata: metadataResponseItem,
  data: deleteUserResponseItem,
});

export type DeleteUserParams = z.infer<typeof deleteUserParams>;
export type DeleteUserQueries = z.infer<typeof deleteUserQueries>;
export type DeleteUserResponseItem = z.infer<typeof deleteUserResponseItem>;
export type DeleteUserResponse = z.infer<typeof deleteUserResponse>;
