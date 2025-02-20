export const isAlphanumeric = (str: string) => {
  const regex = /^[a-zA-Z0-9-]+$/;
  return regex.test(str);
};

export const isObjectEmpty = (obj: object) => {
  if (!obj) return true;
  return Object.entries(obj).length === 0;
};

export const isValidEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isEmailSubAddress = (email: string) => {
  return /[=+#]/.test(email);
};

export const snakeCaseToTitleCase = (str: string) => {
  return str
    .split("_") // Split by underscore
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
    .join(" "); // Join words with spaces
};
