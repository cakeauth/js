import { ContentType } from "../../http.js";
import { FetchClient } from "../../fetch.js";
import {
  PostAttemptResetPasswordBody,
  PostAttemptResetPasswordResponse,
  PostVerifyResetPasswordAttemptBody,
  PostVerifyResetPasswordAttemptParams,
  PostVerifyResetPasswordAttemptResponse,
} from "./types.js";

export class ResetPasswordClient {
  private client: FetchClient;
  private localPath: string;

  constructor(client: FetchClient, localPath: string) {
    this.client = client;
    this.localPath = localPath;
  }

  /**
   * Initiates a password reset attempt.
   *
   * Sends a POST request to the `/v1/reset_password/attempts` endpoint to initiate a password reset process.
   *
   * @endpoint `POST /v1/reset_password/attempts`
   * @param {PostAttemptResetPasswordBody} body - The request payload containing the details for initiating the password reset.
   * @param {HeadersInit} [headers] - Request header.
   * @returns {Promise<PostAttemptResetPasswordResponse>} A promise resolving to the response of the password reset attempt.
   * @throws {Error} If the request fails, the promise is rejected with the corresponding error.
   */
  async createPasswordResetAttempt(
    body: PostAttemptResetPasswordBody,
    headers?: HeadersInit,
  ): Promise<PostAttemptResetPasswordResponse> {
    try {
      return await this.client.post<PostAttemptResetPasswordResponse>(
        `${this.localPath}/reset_password/attempts`,
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
   * Verifies a password reset attempt.
   *
   * Sends a POST request to the `/v1/reset_password/attempts/:attempt_id/verify` endpoint to verify a password reset attempt.
   *
   * @endpoint `POST /v1/reset_password/attempts/:attempt_id/verify`
   * @param {PostVerifyResetPasswordAttemptParams} params - Parameters for the request, including the `attempt_id`.
   * @param {PostVerifyResetPasswordAttemptBody} body - The request payload containing the verification token and new password details.
   * @param {HeadersInit} [headers] - Request header.
   * @returns {Promise<PostVerifyResetPasswordAttemptResponse>} A promise resolving to the response of the verification request.
   * @throws {Error} If the request fails, the promise is rejected with the corresponding error.
   */
  async verifyPasswordResetAttempt(
    params: PostVerifyResetPasswordAttemptParams,
    body: PostVerifyResetPasswordAttemptBody,
    headers?: HeadersInit,
  ): Promise<PostVerifyResetPasswordAttemptResponse> {
    try {
      return await this.client.post<PostVerifyResetPasswordAttemptResponse>(
        `${this.localPath}/reset_password/attempts/${params.attempt_id}/verify`,
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
