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

export const headerRateScope = "X-RateLimit-Scope";

export const headerAPILimit = "X-RateLimit-Limit";
export const headerAPIRateRemaining = "X-RateLimit-Remaining";
export const headerAPIRateReset = "X-RateLimit-Reset";

export const headerQueryLimit = "X-QueryLimit-Limit";
export const headerQueryRemaining = "X-QueryLimit-Remaining";
export const headerQueryReset = "X-QueryLimit-Reset";

export const headerIngestLimit = "X-IngestLimit-Limit";
export const headerIngestRemaining = "X-IngestLimit-Remaining";
export const headerIngestReset = "X-IngestLimit-Reset";

export enum LimitScope {
  unknown = "unknown",
  user = "user",
  environment = "environment",
  anonymous = "anonymous",
}
export enum LimitType {
  api = "api",
}

export class Limit {
  constructor(
    public scope: LimitScope = LimitScope.unknown,
    public type: LimitType = LimitType.api,
    public value: number = 0,
    public remaining: number = -1,
    public reset: Date = new Date(),
  ) {}
}

// parse limit headers from axios response and return a limit object
export function parseLimitFromResponse(response: Response): Limit {
  let limit: Limit;

  limit = parseLimitFromHeaders(
    response,
    headerRateScope,
    headerAPILimit,
    headerAPIRateRemaining,
    headerAPIRateReset,
  );
  limit.type = LimitType.api;

  return limit;
}

export const limitKey = (type: LimitType, scope: LimitScope): string =>
  `${type}:${scope}`;

// parseLimitFromHeaders parses the named headers from a `*http.Response`.
function parseLimitFromHeaders(
  response: Response,
  headerScope: string,
  headerLimit: string,
  headerRemaining: string,
  headerReset: string,
): Limit {
  let limit: Limit = new Limit();

  const scope: string =
    response.headers.get(headerScope.toLowerCase()) || LimitScope.unknown;
  limit.scope = LimitScope[scope as keyof typeof LimitScope];

  const limitValue = response.headers.get(headerLimit.toLowerCase()) || "";
  const limitValueNumber = parseInt(limitValue, 10);
  if (!isNaN(limitValueNumber)) {
    limit.value = limitValueNumber;
  }

  const remainingValue =
    response.headers.get(headerRemaining.toLowerCase()) || "";
  const remainingValueNumber = parseInt(remainingValue, 10);
  if (!isNaN(remainingValueNumber)) {
    limit.remaining = remainingValueNumber;
  }

  const resetValue = response.headers.get(headerReset.toLowerCase()) || "";
  const resetValueInt = parseInt(resetValue, 10);
  if (!isNaN(resetValueInt)) {
    limit.reset = new Date(resetValueInt * 1000);
  }

  return limit;
}
