/**
 * This file contains code partially derived from the Axiom JavaScript SDK,
 * available at https://github.com/axiomhq/axiom-js.
 *
 * The original code is licensed under the MIT License, and any modifications
 * or additions in this file are licensed under the same terms.
 *
 * Original MIT License:
 *
 * MIT License
 *
 * Copyright (c) Axiom, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import pkg from "../package.json";
import { FetchClient } from "./fetch.js";

const Version = pkg.version;
const CakeAuthUrl = "https://api.cakeauth.com";

/**
 * ClientOptions is used to configure the HTTPClient and provide the necessary
 * authentication information to interact with the CakeAuth Backend API.
 *
 * Read more about the CakeAuth Backend API here:
 * @{link: CakeAuth Backend API | https://docs.cakeauth.com/sdk/backend-js}.
 *
 * @example
 * ```ts
 * const cakeauth = new CakeAuth({
 *   privateKey: "sec_test_xxx",
 * })
 * ```
 */
export interface ClientOptions {
  /**
   * the public key to use for authentication, you can get one
   * from @{link: CakeAuth settings | https://docs.cakeauth.com/docs/guides/securing-app/api-keys}.
   */
  privateKey: string;
  /**
   * the URL of the CakeAuth API. You can set this if your project
   * has a custom domain (Coming soon features!).
   */
  url?: string;
  onError?: (error: Error) => void;
}

export default abstract class HTTPClient {
  protected readonly client: FetchClient;

  constructor({ privateKey, url }: ClientOptions) {
    if (!privateKey) {
      console.warn("Missing CakeAuth private key");
    }

    const headers: HeadersInit = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + privateKey,
    };
    if (typeof window === "undefined") {
      headers["User-Agent"] = "@cakeauth/backend@" + Version;
    }

    this.client = new FetchClient({
      baseUrl: url ?? CakeAuthUrl,
      headers,
      timeout: 10_000,
    });
  }
}

export enum ContentType {
  JSON = "application/json",
}
