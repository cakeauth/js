import { cakeauthMiddleware, createRouteMatcher } from "@cakeauth/nextjs-app";

const isPublicRoute = createRouteMatcher(["/signin()"]);

export default cakeauthMiddleware(async (auth, request) => {
  if (!isPublicRoute(request.url)) return auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
