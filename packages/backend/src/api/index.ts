import { z } from "zod";

export const paginationQuery = z.object({
  page: z.number().optional(),
  page_size: z.number().optional(),
});

export type PaginationQuery = z.infer<typeof paginationQuery>;

export const errorResponseItem = z.object({
  code: z.string(),
  message: z.string(),
  url: z.string().nullable(),
});

export const metadataResponseItem = z.object({
  timestamp: z.number(),
  request_id: z.string(),
  page: z.number().nullable(),
  page_size: z.number().nullable(),
  total: z.number().nullable(),
});

export const httpErrorResponse = z.object({
  status: z.number(),
  metadata: metadataResponseItem,
  error: errorResponseItem.nullable(),
  data: z.null(),
});

export type ErrorResponseItem = z.infer<typeof errorResponseItem>;

export type MetadataResponseItem = z.infer<typeof metadataResponseItem>;

export type HttpErrorResponse = z.infer<typeof httpErrorResponse>;

export type HttpSuccessResponse<T> = {
  status: number;
  metadata: MetadataResponseItem;
  data: T;
};

// Sessions

export const sessionActivityMetadata = z.object({
  is_mobile: z.boolean().optional(),
  user_agent: z.string().nullable().optional(),
  browser_name: z.string().nullable().optional(),
  browser_version: z.string().nullable().optional(),
  device_type: z.string().nullable().optional(),
  ip: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
});

export type SessionActivityMetadata = z.infer<typeof sessionActivityMetadata>;
