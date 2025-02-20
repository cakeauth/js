import { ContentType } from "../../http.js";
import { FetchClient } from "../../fetch.js";
import {
  GetIdentifiersQueries,
  GetIdentifiersResponse,
  PostCreateIdentifierBody,
  PostCreateIdentifierQueries,
  PostCreateIdentifierResponse,
  DeleteIdentifierParams,
  DeleteIdentifierQueries,
  DeleteIdentifierResponse,
  PostSetIdentifierPasswordBody,
  PostSetIdentifierPasswordParams,
  PostSetIdentifierPasswordQueries,
  PostSetIdentifierPasswordResponse,
} from "./types.js";

export class IdentifiersClient {
  private client: FetchClient;
  private localPath: string;

  constructor(client: FetchClient, localPath: string) {
    this.client = client;
    this.localPath = localPath;
  }

  /**
   * Fetches a list of identifiers.
   *
   * Makes a GET request to the `/v1/identifiers` endpoint.
   *
   * @endpoint `GET /v1/identifiers`
   * @param {GetIdentifiersQueries} queries - The query parameters for the request.
   * @param {HeadersInit} [headers] - Request headers.
   * @returns {Promise<GetIdentifiersResponse>} A promise that resolves to the list of identifiers.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async getIdentifiers(
    queries: GetIdentifiersQueries,
    headers?: HeadersInit,
  ): Promise<GetIdentifiersResponse> {
    try {
      const queryString = new URLSearchParams(
        Object.entries(queries).reduce(
          (acc, [key, value]) => {
            acc[key] = value?.toString();
            return acc;
          },
          {} as Record<string, string>,
        ),
      ).toString();
      return await this.client.get<GetIdentifiersResponse>(
        `${this.localPath}/identifiers?${queryString}`,
        { headers },
      );
    } catch (err) {
      return await Promise.reject(err);
    }
  }

  /**
   * Creates a new identifier.
   *
   * Makes a POST request to the `/v1/identifiers` endpoint.
   *
   * @endpoint `POST /v1/identifiers`
   * @param {PostCreateIdentifierBody} body - The request body containing the new identifier details.
   * @param {PostCreateIdentifierQueries} queries - The query parameters for the request.
   * @param {HeadersInit} [headers] - Request headers.
   * @returns {Promise<PostCreateIdentifierResponse>} A promise that resolves to the created identifier.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async createIdentifier(
    body: PostCreateIdentifierBody,
    queries?: PostCreateIdentifierQueries,
    headers?: HeadersInit,
  ): Promise<PostCreateIdentifierResponse> {
    try {
      const queryString = new URLSearchParams(queries).toString();
      return await this.client.post<PostCreateIdentifierResponse>(
        `${this.localPath}/identifiers?${queryString}`,
        {
          body: JSON.stringify(body),
          headers: {
            "Content-Type": ContentType.JSON,
            ...headers,
          },
        },
      );
    } catch (err) {
      return await Promise.reject(err);
    }
  }

  /**
   * Deletes an identifier.
   *
   * Makes a DELETE request to the `/v1/identifiers/:identifier_id` endpoint.
   *
   * @endpoint `DELETE /v1/identifiers/:identifier_id`
   * @param {DeleteIdentifierParams} params - The parameters containing the `identifier_id`.
   * @param {DeleteIdentifierQueries} queries - The query parameters for the request.
   * @param {HeadersInit} [headers] - Request headers.
   * @returns {Promise<DeleteIdentifierResponse>} A promise that resolves to the deletion response.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async deleteIdentifier(
    params: DeleteIdentifierParams,
    queries?: DeleteIdentifierQueries,
    headers?: HeadersInit,
  ): Promise<DeleteIdentifierResponse> {
    try {
      const queryString = new URLSearchParams(queries).toString();
      return await this.client.delete<DeleteIdentifierResponse>(
        `${this.localPath}/identifiers/${params.identifier_id}?${queryString}`,
        { headers },
      );
    } catch (err) {
      return await Promise.reject(err);
    }
  }

  /**
   * Sets a password for an identifier.
   *
   * Makes a POST request to the `/v1/identifiers/:identifier_id/set_password` endpoint.
   *
   * @endpoint `POST /v1/identifiers/:identifier_id/set_password`
   * @param {PostSetIdentifierPasswordParams} params - The parameters containing the `identifier_id`.
   * @param {PostSetIdentifierPasswordBody} body - The request body containing the password details.
   * @param {PostSetIdentifierPasswordQueries} queries - The query parameters for the request.
   * @param {HeadersInit} [headers] - Request headers.
   * @returns {Promise<PostSetIdentifierPasswordResponse>} A promise that resolves to the password set response.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async setIdentifierPassword(
    params: PostSetIdentifierPasswordParams,
    body: PostSetIdentifierPasswordBody,
    queries?: PostSetIdentifierPasswordQueries,
    headers?: HeadersInit,
  ): Promise<PostSetIdentifierPasswordResponse> {
    try {
      const queryString = new URLSearchParams(queries).toString();
      return await this.client.post<PostSetIdentifierPasswordResponse>(
        `${this.localPath}/identifiers/${params.identifier_id}/set_password?${queryString}`,
        {
          body: JSON.stringify(body),
          headers: {
            "Content-Type": ContentType.JSON,
            ...headers,
          },
        },
      );
    } catch (err) {
      return await Promise.reject(err);
    }
  }
}
