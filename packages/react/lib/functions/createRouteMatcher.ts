export const createRouteMatcher = (
  patterns: string[],
): ((href: string) => boolean) => {
  const regexes = patterns.map((pattern) => new RegExp(`^${pattern}$`));

  return (href: string): boolean => {
    try {
      // Extract the pathname from the URL
      const urlPath = new URL(href).pathname;
      return regexes.some((regex) => regex.test(urlPath));
    } catch {
      // If href is not a valid URL, assume it's a relative path
      return regexes.some((regex) => regex.test(href));
    }
  };
};
