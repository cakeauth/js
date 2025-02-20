export function isCakeAuthPrivateKey(key: string): boolean {
  if (key.startsWith("sec_")) {
    return true;
  }

  return false;
}
