import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIES } from "../internal/constants";
import { redirectToSignin, refreshToken } from "../internal/utils";

type AuthProtectOpts = {
  clearSearchParams?: boolean;
};

type Auth = {
  isAuthenticated: boolean;
  protect: (opts?: AuthProtectOpts) => Promise<NextResponse<unknown>>;
};

const cakeauthMiddleware = (
  handler?: (
    auth: Auth,
    request: Request,
  ) => Promise<NextResponse<unknown> | undefined>,
) => {
  return async (request: Request) => {
    const url = request?.url ? new URL(request.url) : null;
    if (!url) {
      return new Response("Missing URL", { status: 500 });
    }

    // Always include the base headers
    const baseHeaders = {
      "x-cakeauth-url": url.toString(),
    };

    if (handler) {
      const cookieStore = await cookies();
      const sessionId = cookieStore.get(COOKIES.SESSION_ID)?.value;

      const response = await handler(
        {
          isAuthenticated: !!sessionId,
          protect: (opts) => _handleProtect(!!sessionId, request, opts),
        },
        request,
      );

      // If handler returns a response, merge the base headers with any custom headers
      if (response) {
        const newHeaders = new Headers(response.headers);
        Object.entries(baseHeaders).forEach(([key, value]) => {
          if (!newHeaders.has(key)) {
            newHeaders.set(key, value);
          }
        });

        return new NextResponse(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        });
      }
    }

    // Default response with base headers
    return NextResponse.next({
      headers: baseHeaders,
    });
  };
};

const _handleProtect = async (
  isAuthenticated: boolean,
  request: Request,
  opts?: AuthProtectOpts,
) => {
  const url = new URL(request.url);
  const headers = {
    "x-cakeauth-url": url.toString(),
  };

  if (!isAuthenticated) {
    return redirectToSignin(url, opts);
  }

  const res = await refreshToken();
  if (res?.data?.token) {
    const cookieStore = await cookies();

    // Set access token cookie
    cookieStore.set(COOKIES.ACCESS_TOKEN(res.data.id), res.data.token.value, {
      domain: res.data.token.domain,
      expires: new Date(res.data.token.expires_at),
      httpOnly: false,
    });

    // Set user ID cookie
    cookieStore.set(COOKIES.USER_ID, res.data.user.id, {
      domain: res.data.token.domain,
      expires: res.data.expires_at
        ? new Date(res.data.expires_at)
        : new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      httpOnly: false,
    });
  }

  return NextResponse.next({
    headers,
  });
};

export default cakeauthMiddleware;
