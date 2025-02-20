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

/**
 * ClientOptions is used to configure the HTTPClient and provide the necessary
 * authentication information to interact with the CakeAuth Frontend API.
 *
 * Read more about the CakeAuth Frontend API here:
 * @{link: CakeAuth Frontend API | https://docs.cakeauth.com/frontend_api/introduction}.
 *
 * @example
 * ```ts
 * const cakeauth = new CakeAuth({
 *   publicKey: "pub_test_xxx",
 * })
 * ```
 */
export interface ClientOptions {
  /**
   * the public key to use for authentication, you can get one
   * from @{link: CakeAuth settings | https://docs.cakeauth.com/todo}.
   */
  publicKey: string;
  /**
   * the URL of your CakeAuth environment. You can get this from the CakeAuth
   * settings page of your project, or follow the instructions here
   * @{link: CakeAuth settings | https://docs.cakeauth.com/todo}.
   */
  url?: string;
  onError?: (error: Error) => void;
}

export default abstract class HTTPClient {
  protected readonly client: FetchClient;

  constructor({ publicKey, url }: ClientOptions) {
    if (!publicKey) {
      console.warn("Missing CakeAuth public key");
    }

    const keyWithoutPrefix = publicKey
      ?.replace("pub_test_", "")
      ?.replace("pub_live_", "");
    const baseUrl = new URL(url || "https://" + atob(keyWithoutPrefix));
    if (!baseUrl) {
      console.warn("CakeAuth public key is invalid");
    }

    const headers: HeadersInit = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    if (typeof window === "undefined") {
      headers["User-Agent"] = "@cakeauth/frontend@" + Version;
    }

    this.client = new FetchClient({
      baseUrl: baseUrl.origin,
      headers,
      timeout: 10_000,
      publicKey,
    });
  }
}

export enum ContentType {
  JSON = "application/json",
}

export type Authorization = {
  accessToken: string;
};
