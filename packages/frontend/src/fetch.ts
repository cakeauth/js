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

import fetchRetry from "fetch-retry";
import { Limit, LimitType } from "./limit.js";

export class FetchClient {
  constructor(
    public config: {
      headers: HeadersInit;
      baseUrl: string;
      timeout: number;
      publicKey: string;
    },
  ) {}

  async doReq<T>(
    endpoint: string,
    method: string,
    init: RequestInit = {},
    searchParams: { [key: string]: string } = {},
    timeout = this.config.timeout,
  ): Promise<T> {
    let finalUrl = `${this.config.baseUrl}${endpoint}`;
    const params = this._prepareSearchParams(searchParams);
    if (params) {
      finalUrl += `?${params.toString()}`;
    }

    const headers = {
      ...this.config.headers,
      ...init.headers,
      "x-cakeauth-public-key": this.config.publicKey,
    };
    const resp = await fetchRetry(fetch)(finalUrl, {
      retries: 1,
      retryDelay: function (attempt) {
        return Math.pow(2, attempt) * 1000; // 1000, 2000, 4000
      },
      credentials: "include",
      retryOn: [503, 502, 504, 500],
      headers,
      method,
      body: init.body ? init.body : undefined,
      signal: AbortSignal.timeout(timeout),
      cache: "no-store",
    });

    if (resp.status === 204) {
      return resp as unknown as T;
    }

    const data = await resp.json();

    if (resp.status < 200 || resp.status > 299) {
      throw data;
    }

    return data as T;
  }

  post<T>(
    url: string,
    init: RequestInit = {},
    searchParams: any = {},
    timeout = this.config.timeout,
  ): Promise<T> {
    return this.doReq<T>(url, "POST", init, searchParams, timeout);
  }

  get<T>(
    url: string,
    init: RequestInit = {},
    searchParams: any = {},
    timeout = this.config.timeout,
  ): Promise<T> {
    return this.doReq<T>(url, "GET", init, searchParams, timeout);
  }

  put<T>(
    url: string,
    init: RequestInit = {},
    searchParams: any = {},
    timeout = this.config.timeout,
  ): Promise<T> {
    return this.doReq<T>(url, "PUT", init, searchParams, timeout);
  }

  delete<T>(
    url: string,
    init: RequestInit = {},
    searchParams: any = {},
    timeout = this.config.timeout,
  ): Promise<T> {
    return this.doReq<T>(url, "DELETE", init, searchParams, timeout);
  }

  _prepareSearchParams = (searchParams: { [key: string]: string }) => {
    const params = new URLSearchParams();
    let hasParams = false;

    Object.keys(searchParams).forEach((k: string) => {
      if (searchParams[k]) {
        params.append(k, searchParams[k]);
        hasParams = true;
      }
    });

    return hasParams ? params : null;
  };
}

export class CakeAuthTooManyRequestsError extends Error {
  public message: string = "";

  constructor(
    public limit: Limit,
    public shortcircuit = false,
  ) {
    super();
    Object.setPrototypeOf(this, CakeAuthTooManyRequestsError.prototype); // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    const retryIn = CakeAuthTooManyRequestsError.timeUntilReset(limit);
    this.message = `${limit.type} limit exceeded, try again in ${retryIn.minutes}m${retryIn.seconds}s`;
    if (limit.type == LimitType.api) {
      this.message = `${limit.scope} ` + this.message;
    }
  }

  static timeUntilReset(limit: Limit) {
    const total = limit.reset.getTime() - new Date().getTime();
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);

    return {
      total,
      minutes,
      seconds,
    };
  }
}
