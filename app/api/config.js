export const BASE_URL = "https://dapi.atomx.in";
export const API_KEY = "U4K7FxKz.livelink_prod.HeEb2-LgMd6hyneYyP4SOAs1dHVzjHxM";

export function buildHeaders({ token } = {}) {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}
