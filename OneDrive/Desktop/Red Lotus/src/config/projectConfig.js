export const projectConfig = {
  isPrivate: false,
  requiresAuth: false,
  allowAnonymousAccess: true
};

// This configuration is used to determine if authentication is required
// for the entire site or just specific routes
export const routeConfig = {
  // The /admin and /login paths require authentication
  protectedPaths: ['/admin'],
  // The rest of the site is public
  publicPaths: ['/']
};
