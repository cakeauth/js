import { Authorization, ContentType } from "../../http.js";
import { FetchClient } from "../../fetch.js";
import {
  GetMeResponse,
  PostMeResetPasswordBody,
  PostMeResetPasswordResponse,
} from "./types.js";

export class MeClient {
  private client: FetchClient;
  private localPath: string;

  constructor(client: FetchClient, localPath: string) {
    this.client = client;
    this.localPath = localPath;
  }

  /**
   * Retrieves information about the current user.
   *
   * Makes a GET request to the `/me` endpoint to retrieve the user's information.
   *
   * @endpoint `GET /v1/me`
   * @param {Authorization} authorization - Request authorization header.
   * @param {HeadersInit} [headers] - Request header.
   * @returns {Promise<GetMeResponse>} A promise that resolves to the user's information in the `GetMeResponse` format.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async getInfo(
    authorization: Authorization,
    headers?: HeadersInit,
  ): Promise<GetMeResponse> {
    try {
      return await this.client.get<GetMeResponse>(`${this.localPath}/me`, {
        headers: {
          "Content-Type": ContentType.JSON,
          Authorization: `Bearer ${authorization.accessToken}`,
          ...headers,
        },
      });
    } catch (err) {
      return await Promise.reject(err);
    }
  }

  /**
   * Resets the user's password.
   *
   * Makes a POST request to the `/me/reset_password` endpoint to reset the user's password.
   *
   * @endpoint `POST /v1/me/reset_password`
   * @param {PostMeResetPasswordBody} body - The body of the request containing the new password data.
   * @param {Authorization} authorization - Request authorization header.
   * @param {HeadersInit} [headers] - Request header.
   * @returns {Promise<PostMeResetPasswordResponse>} A promise that resolves to the response of the password reset request.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async resetPassword(
    body: PostMeResetPasswordBody,
    authorization: Authorization,
    headers?: HeadersInit,
  ): Promise<PostMeResetPasswordResponse> {
    try {
      return await this.client.post<PostMeResetPasswordResponse>(
        `${this.localPath}/me/reset_password`,
        {
          body: JSON.stringify(body),
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
