export function isCakeAuthPublicKey(key: string): boolean {
  if (key.startsWith("pub_")) {
    return true;
  }

  return false;
}
