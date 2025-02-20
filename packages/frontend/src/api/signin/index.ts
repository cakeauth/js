import { ContentType } from "../../http.js";
import { FetchClient } from "../../fetch.js";
import {
  PostAttemptSigninBody,
  PostAttemptSigninResponse,
  PostGetAvailableSigninStrategiesBody,
  PostGetAvailableSigninStrategiesResponse,
  PostVerifySigninAttemptBody,
  PostVerifySigninAttemptParams,
  PostVerifySigninAttemptResponse,
} from "./types.js";

export class SigninClient {
  private client: FetchClient;
  private localPath: string;

  constructor(client: FetchClient, localPath: string) {
    this.client = client;
    this.localPath = localPath;
  }

  /**
   * Retrieves available sign-in strategies for a user.
   *
   * Makes a POST request to the `/v1/signin/strategies` endpoint to fetch available sign-in strategies.
   *
   * This is useful if your userbase supports multiple sign-in strategies (e.g. `email`, `phone`, `username`, etc).
   *
   * If your userbase only allow single signin strategy (e.g. `user_password`), you can skip this endpoint
   * and use the `signin.createSigninAttempt` endpoint directly.
   *
   * @endpoint `POST /v1/signin/strategies`
   * @param {PostGetAvailableSigninStrategiesBody} body - The request body containing user information.
   * @param {HeadersInit} [headers] - Request header.
   * @returns {Promise<PostGetAvailableSigninStrategiesResponse>} A promise that resolves to the available sign-in strategies.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async getAvailableSigninStrategies(
    body: PostGetAvailableSigninStrategiesBody,
    headers?: HeadersInit,
  ): Promise<PostGetAvailableSigninStrategiesResponse> {
    try {
      return await this.client.post<PostGetAvailableSigninStrategiesResponse>(
        `${this.localPath}/signin/strategies`,
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
   * Initiates a sign-in attempt.
   *
   * Makes a POST request to the `/v1/signin/attempts` endpoint to initiate a new sign-in attempt.
   *
   * @endpoint `POST /v1/signin/attempts`
   * @param {PostAttemptSigninBody} body - The request body containing sign-in details.
   * @param {HeadersInit} [headers] - Request header.
   * @returns {Promise<PostAttemptSigninResponse>} A promise that resolves to the sign-in attempt response.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async createSigninAttempt(
    body: PostAttemptSigninBody,
    headers?: HeadersInit,
  ): Promise<PostAttemptSigninResponse> {
    try {
      return await this.client.post<PostAttemptSigninResponse>(
        `${this.localPath}/signin/attempts`,
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
   * Verifies a sign-in attempt.
   *
   * Makes a POST request to the `/v1/signin/attempts/:attempt_id/verify` endpoint to verify a sign-in attempt,
   * and create a new session.
   *
   * @endpoint `POST /v1/signin/attempts/:attempt_id/verify`
   * @param {PostVerifySigninAttemptParams} params - The parameters containing the `attempt_id`.
   * @param {PostVerifySigninAttemptBody} body - The request body containing verification details.
   * @param {HeadersInit} [headers] - Request header.
   * @returns {Promise<PostVerifySigninAttemptResponse>} A promise that resolves to the verification response.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async verifySigninAttempt(
    params: PostVerifySigninAttemptParams,
    body: PostVerifySigninAttemptBody,
    headers?: HeadersInit,
  ): Promise<PostVerifySigninAttemptResponse> {
    try {
      return await this.client.post<PostVerifySigninAttemptResponse>(
        `${this.localPath}/signin/attempts/${params.attempt_id}/verify`,
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
