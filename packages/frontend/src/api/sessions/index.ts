import { Authorization, ContentType } from "../../http.js";
import { FetchClient } from "../../fetch.js";
import {
  GetHandshakeSessionParams,
  GetHandshakeSessionResponse,
  GetSessionDetailsResponse,
  GetSessionsQueries,
  GetSessionsResponse,
  PostRefreshAccessTokenResponse,
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
   * Retrieves information about a handshake session.
   *
   * Makes a GET request to the `/sessions/handshake/:handshake_id` endpoint to retrieve handshake session details.
   *
   * @endpoint `GET /v1/sessions/handshake/:handshake_id`
   * @param {GetHandshakeSessionParams} params - The request parameters containing the `handshake_id`.
   * @param {HeadersInit} [headers] - Request header.
   * @returns {Promise<GetHandshakeSessionResponse>} A promise that resolves to the handshake session details.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async exchangeHandshakeId(
    params: GetHandshakeSessionParams,
    headers?: HeadersInit,
  ): Promise<GetHandshakeSessionResponse> {
    try {
      return await this.client.get<GetHandshakeSessionResponse>(
        `${this.localPath}/sessions/handshake/${params.handshake_id}`,
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
   * List all available current user's sessions.
   *
   * Makes a GET request to the `/v1/sessions` endpoint to retrieve session list.
   *
   * @endpoint `GET /v1/sessions`
   * @param {Authorization} authorization - Request authorization header.
   * @param {GetSessionsQueries} [queries] - The request queries.
   * @param {HeadersInit} [headers] - Request header.
   * @returns {Promise<GetSessionsResponse>} A promise that resolves to the handshake session details.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async listSessions(
    authorization: Authorization,
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
        `${this.localPath}/sessions?${queryString || ""}`,
        {
          headers: {
            "Content-Type": ContentType.JSON,
            Authorization: `Bearer ${authorization.accessToken}`,
            ...headers,
          },
        },
      );
    } catch (err) {
      return await Promise.reject(err);
    }
  }

  /**
   * Retrieves information about current session.
   *
   * Makes a GET request to the `/v1/sessions/detais` endpoint to retrieve session details.
   *
   * @endpoint `GET /v1/sessions/details`
   * @param {Authorization} authorization - Request authorization header.
   * @param {HeadersInit} [headers] - Request header.
   * @returns {Promise<GetSessionDetailsResponse>} A promise that resolves to the handshake session details.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async getDetails(
    authorization: Authorization,
    headers?: HeadersInit,
  ): Promise<GetSessionDetailsResponse> {
    try {
      return await this.client.get<GetSessionDetailsResponse>(
        `${this.localPath}/sessions/details`,
        {
          headers: {
            "Content-Type": ContentType.JSON,
            Authorization: `Bearer ${authorization.accessToken}`,
            ...headers,
          },
        },
      );
    } catch (err) {
      return await Promise.reject(err);
    }
  }

  /**
   * Refreshes an access token.
   *
   * Makes a POST request to the `/v1/sessions/tokens` endpoint to refresh an access token.
   *
   * @endpoint `POST /v1/sessions/tokens`
   * @param {HeadersInit} [headers] - Request header.
   * @returns {Promise<PostRefreshAccessTokenResponse>} A promise that resolves to the response containing the refreshed token.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async refreshAccessToken(
    headers?: HeadersInit,
  ): Promise<PostRefreshAccessTokenResponse> {
    try {
      return await this.client.post<PostRefreshAccessTokenResponse>(
        `${this.localPath}/sessions/tokens`,
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
   * Revokes a session (signout).
   *
   * Makes a POST request to the `/v1/sessions/revoke` endpoint to revoke a session.
   *
   * @endpoint `POST /v1/sessions/revoke`
   * @param {Authorization} authorization - Request authorization header.
   * @param {HeadersInit} [headers] - Request header.
   * @returns {Promise<PostRevokeSessionResponse>} A promise that resolves to the response of the session revocation.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async revokeSession(
    authorization: Authorization,
    queries?: PostRevokeSessionQueries,
    headers?: HeadersInit,
  ): Promise<PostRevokeSessionResponse> {
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

      return await this.client.post<PostRevokeSessionResponse>(
        `${this.localPath}/sessions/revoke?${queryString || ""}`,
        {
          body: JSON.stringify({}),
          headers: {
            "Content-Type": ContentType.JSON,
            Authorization: `Bearer ${authorization.accessToken}`,
            ...headers,
          },
        },
      );
    } catch (err) {
      return await Promise.reject(err);
    }
  }
}
