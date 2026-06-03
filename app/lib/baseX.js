import baseX from "base-x";

const ALPHABET = "9A2BC7DE5FGH4IJKL0MNOPQRSTUV1WXYZabcdefghijklmnpqrstuvwxyz36";
const customBase = baseX(ALPHABET);

export function encodeBaseX(str) {
  const bytes = new TextEncoder().encode(str);
  return customBase.encode(bytes);
}

export function decodeBaseX(enc) {
  const bytes = customBase.decode(enc);n
  return new TextDecoder().decode(bytes);
}
