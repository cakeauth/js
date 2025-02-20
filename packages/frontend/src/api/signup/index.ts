import { ContentType } from "../../http.js";
import { FetchClient } from "../../fetch.js";
import {
  PostAttemptSignupBody,
  PostAttemptSignupResponse,
  PostVerifySignupAttemptBody,
  PostVerifySignupAttemptParams,
  PostVerifySignupAttemptResponse,
} from "./types.js";

export class SignupClient {
  private client: FetchClient;
  private localPath: string;

  constructor(client: FetchClient, localPath: string) {
    this.client = client;
    this.localPath = localPath;
  }

  /**
   * Initiates a sign-up attempt.
   *
   * Makes a POST request to the `/v1/signup/attempts` endpoint to initiate a new sign-up attempt.
   *
   * Important: If you set your identifier contact information's settings `verify_on_signup=false`,
   * this method will automatically create a new user & session without verifying the user's data.
   *
   * @endpoint `POST /v1/signup/attempts`
   * @param {PostAttemptSignupBody} body - The request body containing sign-up details.
   * @param {HeadersInit} [headers] - Request header.
   * @returns {Promise<PostAttemptSignupResponse>} A promise that resolves to the sign-up attempt response.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   * ```
   */
  async createSignupAttempt(
    body: PostAttemptSignupBody,
    headers?: HeadersInit,
  ): Promise<PostAttemptSignupResponse> {
    try {
      return await this.client.post<PostAttemptSignupResponse>(
        `${this.localPath}/signup/attempts`,
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
   * Verifies a sign-up attempt.
   *
   * Makes a POST request to the `/v1/signup/attempts/:attempt_id/verify` endpoint to verify a sign-up attempt,
   * and create a new user & session.
   *
   * @endpoint `POST /v1/signup/attempts/:attempt_id/verify`
   * @param {PostVerifySignupAttemptParams} params - The parameters containing the `attempt_id`.
   * @param {PostVerifySignupAttemptBody} body - The request body containing verification details.
   * @param {HeadersInit} [headers] - Request header.
   * @returns {Promise<PostVerifySignupAttemptResponse>} A promise that resolves to the verification response.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async verifySignupAttempt(
    params: PostVerifySignupAttemptParams,
    body: PostVerifySignupAttemptBody,
    headers?: HeadersInit,
  ): Promise<PostVerifySignupAttemptResponse> {
    try {
      return await this.client.post<PostVerifySignupAttemptResponse>(
        `${this.localPath}/signup/attempts/${params.attempt_id}/verify`,
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
