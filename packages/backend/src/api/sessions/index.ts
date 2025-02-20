import { ContentType } from "../../http.js";
import { FetchClient } from "../../fetch.js";
import {
  GetSessionsQueries,
  GetSessionsResponse,
  PostCreateSessionBody,
  PostCreateSessionQueries,
  PostCreateSessionResponse,
  PostRefreshSessionTokenParams,
  PostRefreshSessionTokenResponse,
  PostRevokeSessionParams,
  PostRevokeSessionQueries,
  PostRevokeSessionResponse,
} from "./types.js";

export class SessionsClient {
  private client: FetchClient;
  private localPath: string;

  constructor(client: FetchClient, localPath: string) {
    this.client = client;
    this.localPath = localPath;
  }

  /**
   * Retrieves user sessions.
   *
   * Makes a GET request to the `/v1/sessions` endpoint to fetch sessions.
   *
   * @endpoint `GET /v1/sessions`
   * @param {GetSessionsQueries} queries - The request query parameters.
   * @param {HeadersInit} [headers] - Request header.
   * @returns {Promise<GetSessionsResponse>} A promise that resolves to the sessions.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async getSessions(
    queries?: GetSessionsQueries,
    headers?: HeadersInit,
  ): Promise<GetSessionsResponse> {
    try {
      const queryString = queries
        ? new URLSearchParams(
            Object.entries(queries).reduce(
              (acc, [key, value]) => {
                acc[key] = value?.toString();
                return acc;
              },
              {} as Record<string, string>,
            ),
          )
        : null;

      return await this.client.get<GetSessionsResponse>(
        `${this.localPath}/sessions?${queryString}`,
        {
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
   * Creates a new session.
   *
   * Makes a POST request to the `/v1/sessions` endpoint to create a session.
   *
   * @endpoint `POST /v1/sessions`
   * @param {PostCreateSessionBody} body - The request body containing session details.
   * @param {PostCreateSessionQueries} queries - The request query parameters.
   * @param {HeadersInit} [headers] - Request header.
   * @returns {Promise<PostCreateSessionResponse>} A promise that resolves to the created session.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async createSession(
    body: PostCreateSessionBody,
    queries?: PostCreateSessionQueries,
    headers?: HeadersInit,
  ): Promise<PostCreateSessionResponse> {
    try {
      const queryString = new URLSearchParams(queries).toString();

      return await this.client.post<PostCreateSessionResponse>(
        `${this.localPath}/sessions?${queryString}`,
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
   * Refreshes a session token.
   *
   * Makes a POST request to the `/v1/sessions/:session_id/tokens` endpoint to refresh a session token.
   *
   * @endpoint `POST /v1/sessions/:session_id/tokens`
   * @param {PostRefreshSessionTokenParams} params - The parameters containing `session_id`.
   * @param {HeadersInit} [headers] - Request header.
   * @returns {Promise<PostRefreshSessionTokenResponse>} A promise that resolves to the refreshed session token.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async refreshSessionToken(
    params: PostRefreshSessionTokenParams,
    headers?: HeadersInit,
  ): Promise<PostRefreshSessionTokenResponse> {
    try {
      return await this.client.post<PostRefreshSessionTokenResponse>(
        `${this.localPath}/sessions/${params.session_id}/tokens`,
        {
          body: JSON.stringify({}),
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
   * Revokes a session.
   *
   * Makes a POST request to the `/v1/sessions/:session_id/revoke` endpoint to revoke a session.
   *
   * @endpoint `POST /v1/sessions/:session_id/revoke`
   * @param {PostRevokeSessionParams} params - The parameters containing `session_id`.
   * @param {PostRevokeSessionQueries} queries - The request query parameters.
   * @param {HeadersInit} [headers] - Request header.
   * @returns {Promise<PostRevokeSessionResponse>} A promise that resolves to the session revocation response.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async revokeSession(
    params: PostRevokeSessionParams,
    queries?: PostRevokeSessionQueries,
    headers?: HeadersInit,
  ): Promise<PostRevokeSessionResponse> {
    try {
      const queryString = new URLSearchParams(queries).toString();

      return await this.client.post<PostRevokeSessionResponse>(
        `${this.localPath}/sessions/${params.session_id}/revoke?${queryString}`,
        {
          body: JSON.stringify({}),
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
