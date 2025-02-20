export const isPathMatch = (currentPath: string, pagePath: string) => {
  // Parse the URLs
  const currentUrl = new URL(currentPath, "http://example.com");
  const pageUrl = new URL(pagePath, "http://example.com");

  // Get flow parameters from both URLs
  const currentFlow = currentUrl.searchParams.get("flow");
  const pageFlow = pageUrl.searchParams.get("flow");

  // Check if pathname matches and if current path has the required flow parameter
  return currentUrl.pathname === pageUrl.pathname && currentFlow === pageFlow;
};
