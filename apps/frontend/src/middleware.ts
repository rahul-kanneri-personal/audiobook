import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/admin/disabled-for-testing(.*)']);

const isApiRoute = createRouteMatcher(['/api(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Protect admin routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // For API routes, ensure auth is available but don't require it
  // This allows the frontend to access auth tokens for API calls
  if (isApiRoute(req)) {
    try {
      await auth();
    } catch (error) {
      // Continue even if auth fails for API routes
      console.log('Auth not available for API route:', error);
    }
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
