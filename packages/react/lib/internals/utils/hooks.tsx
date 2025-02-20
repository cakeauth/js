import { useEffect, useState } from "react";

export const useCurrentUrl = () => {
  const [url, setUrl] = useState<URL | null>(null);

  useEffect(() => {
    try {
      const currentUrl = new URL(window.location.href);
      setUrl(currentUrl);
    } catch (error) {
      console.warn("Failed to get URL:", error);
    }
  }, []);

  return url;
};
