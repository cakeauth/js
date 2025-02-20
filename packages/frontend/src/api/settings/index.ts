import { ContentType } from "../../http.js";
import { FetchClient } from "../../fetch.js";
import { GetSettingsResponse } from "./types.js";

export class SettingsClient {
  private client: FetchClient;
  private localPath: string;

  constructor(client: FetchClient, localPath: string) {
    this.client = client;
    this.localPath = localPath;
  }

  /**
   * Retrieves the list of settings from your project environment.
   *
   * @endpoint `GET /v1/settings`
   * @param {HeadersInit} [headers] - Request header.
   * @returns {Promise<GetSettingsResponse>} A promise that resolves to the list of settings in the `GetSettingsResponse` format.
   * @throws {Error} If the request fails, the promise is rejected with the error.
   */
  async list(headers?: HeadersInit): Promise<GetSettingsResponse> {
    try {
      return await this.client.get<GetSettingsResponse>(
        `${this.localPath}/settings`,
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
