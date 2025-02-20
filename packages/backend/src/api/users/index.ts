import {
  DeleteUserParams,
  DeleteUserQueries,
  DeleteUserResponse,
  GetUserDetailsParams,
  GetUserDetailsQueries,
  GetUserDetailsResponse,
  GetUsersQueries,
  GetUsersResponse,
  PostBanUserParams,
  PostBanUserQueries,
  PostBanUserResponse,
  PostCreateUserBody,
  PostCreateUserQueries,
  PostCreateUserResponse,
  PostUnbanUserParams,
  PostUnbanUserQueries,
  PostUnbanUserResponse,
} from "./types";
import { ContentType } from "../../http.js";
import { FetchClient } from "../../fetch.js";

export class UsersClient {
  private client: FetchClient;
  private localPath: string;

  constructor(client: FetchClient, localPath: string) {
    this.client = client;
    this.localPath = localPath;
  }

  /**
   * Retrieves a list of users.
   *
   * Makes a GET request to the `/v1/users` endpoint to fetch users based on query parameters.
   *
   * @endpoint `GET /v1/users`
   * @param {GetUsersQueries} queries - The query parameters for fetching users.
   * @param {HeadersInit} [headers] - Request header.
   * @returns {Promise<GetUsersResponse>} A promise that resolves to the list of users.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async getUsers(
    queries?: GetUsersQueries,
    headers?: HeadersInit,
  ): Promise<GetUsersResponse> {
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

      return await this.client.get<GetUsersResponse>(
        `${this.localPath}/users?${queryString}`,
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
   * Retrieves details of a specific user.
   *
   * Makes a GET request to the `/v1/users/:user_id` endpoint to fetch user details.
   *
   * @endpoint `GET /v1/users/:user_id`
   * @param {GetUserDetailsParams} params - The path parameters containing the user ID.
   * @param {GetUserDetailsQueries} queries - The query parameters for additional filters.
   * @param {HeadersInit} [headers] - Request header.
   * @returns {Promise<GetUserDetailsResponse>} A promise that resolves to the user details.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async getUserDetails(
    params: GetUserDetailsParams,
    queries?: GetUserDetailsQueries,
    headers?: HeadersInit,
  ): Promise<GetUserDetailsResponse> {
    try {
      const queryString = new URLSearchParams(queries).toString();

      return await this.client.get<GetUserDetailsResponse>(
        `${this.localPath}/users/${params.user_id}?${queryString}`,
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
   * Creates a new user.
   *
   * Makes a POST request to the `/v1/users` endpoint to create a new user.
   *
   * @endpoint `POST /v1/users`
   * @param {PostCreateUserBody} body - The request body containing user information.
   * @param {PostCreateUserQueries} queries - The query parameters for the request.
   * @param {HeadersInit} [headers] - Request header.
   * @returns {Promise<PostCreateUserResponse>} A promise that resolves to the response after creating the user.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async createUser(
    body: PostCreateUserBody,
    queries?: PostCreateUserQueries,
    headers?: HeadersInit,
  ): Promise<PostCreateUserResponse> {
    const queryString = new URLSearchParams(queries).toString();

    try {
      return await this.client.post<PostCreateUserResponse>(
        `${this.localPath}/users?${queryString}`,
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
   * Bans a user.
   *
   * Makes a POST request to the `/v1/users/:user_id/ban` endpoint to ban a user.
   *
   * @endpoint `POST /v1/users/:user_id/ban`
   * @param {PostBanUserParams} params - The path parameters containing the user ID.
   * @param {PostBanUserQueries} queries - The query parameters for the ban action.
   * @param {HeadersInit} [headers] - Request header.
   * @returns {Promise<PostBanUserResponse>} A promise that resolves to the response after banning the user.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async banUser(
    params: PostBanUserParams,
    queries?: PostBanUserQueries,
    headers?: HeadersInit,
  ): Promise<PostBanUserResponse> {
    try {
      const queryString = new URLSearchParams(queries).toString();

      return await this.client.post<PostBanUserResponse>(
        `${this.localPath}/users/${params.user_id}/ban?${queryString}`,
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
   * Unbans a user.
   *
   * Makes a POST request to the `/v1/users/:user_id/unban` endpoint to unban a user.
   *
   * @endpoint `POST /v1/users/:user_id/unban`
   * @param {PostUnbanUserParams} params - The path parameters containing the user ID.
   * @param {PostUnbanUserQueries} queries - The query parameters for the unban action.
   * @param {HeadersInit} [headers] - Request header.
   * @returns {Promise<PostUnbanUserResponse>} A promise that resolves to the response after unbanning the user.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async unbanUser(
    params: PostUnbanUserParams,
    queries?: PostUnbanUserQueries,
    headers?: HeadersInit,
  ): Promise<PostUnbanUserResponse> {
    try {
      const queryString = new URLSearchParams(queries).toString();

      return await this.client.post<PostUnbanUserResponse>(
        `${this.localPath}/users/${params.user_id}/unban?${queryString}`,
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
   * Deletes a user.
   *
   * Makes a DELETE request to the `/v1/users/:user_id` endpoint to delete a user.
   *
   * @endpoint `DELETE /v1/users/:user_id`
   * @param {DeleteUserParams} params - The path parameters containing the user ID.
   * @param {DeleteUserQueries} queries - The query parameters for the delete action.
   * @param {HeadersInit} [headers] - Request header.
   * @returns {Promise<DeleteUserResponse>} A promise that resolves to the response after deleting the user.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async deleteUser(
    params: DeleteUserParams,
    queries: DeleteUserQueries,
    headers?: HeadersInit,
  ): Promise<DeleteUserResponse> {
    try {
      const queryString = new URLSearchParams(queries).toString();

      return await this.client.delete<DeleteUserResponse>(
        `${this.localPath}/users/${params.user_id}?${queryString}`,
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
}
