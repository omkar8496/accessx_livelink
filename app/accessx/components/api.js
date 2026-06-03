import { BASE_URL, buildHeaders } from "@livelink/api/config";

const DASH_EVENT_URL = "https://dashapi.atomx.in/dashboardAPI/v1/Event/Details/";

/**
 * Fetch event details for a given event code.
 * @param {Object} params
 * @param {string|number} params.eventId - Event identifier (code).
 */
export async function fetchEventDetails({ eventId }) {
  if (!eventId) {
    throw new Error("Missing eventId for event details request.");
  }

  const searchParams = new URLSearchParams({ code: String(eventId) });
  const response = await fetch(`${DASH_EVENT_URL}?${searchParams}`, {
    method: "GET",
    cache: "no-store"
  });

  let body = null;
  try {
    body = await response.json();
  } catch (error) {
    // ignore parse errors
  }

  if (!response.ok) {
    const message =
      body?.message ||
      body?.error ||
      response.statusText ||
      "Unable to load event details.";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return body;
}

export async function fetchAccessLast20({ token }) {
  if (!token) {
    throw new Error("Missing LiveLink token. Please log in again.");
  }

  const response = await fetch(`${BASE_URL}/v1/Analytics/Access/Data?dataType=accessLast20`, {
    method: "GET",
    headers: buildHeaders({ token }),
    cache: "no-store"
  });

  let body = null;
  try {
    body = await response.json();
  } catch (error) {
    // ignore parse errors
  }

  if (!response.ok || body?.success === false) {
    const message =
      body?.message ||
      body?.error ||
      response.statusText ||
      "Unable to load access records.";
    throw new Error(message);
  }

  return body?.data ?? [];
}

export async function fetchAccessHourwise({ token }) {
  if (!token) {
    throw new Error("Missing LiveLink token. Please log in again.");
  }

  const response = await fetch(`${BASE_URL}/v1/Analytics/Access/Data?dataType=accessHourwise`, {
    method: "GET",
    headers: buildHeaders({ token }),
    cache: "no-store"
  });

  let body = null;
  try {
    body = await response.json();
  } catch (error) {
    // ignore parse errors
  }

  if (!response.ok || body?.success === false) {
    const message =
      body?.message ||
      body?.error ||
      response.statusText ||
      "Unable to load access graph data.";
    throw new Error(message);
  }

  return body?.data ?? [];
}

export async function fetchAccessDevice({ token }) {
  if (!token) {
    throw new Error("Missing LiveLink token. Please log in again.");
  }

  const response = await fetch(`${BASE_URL}/v1/Analytics/Access/Data?dataType=accessDevice`, {
    method: "GET",
    headers: buildHeaders({ token }),
    cache: "no-store"
  });

  let body = null;
  try {
    body = await response.json();
  } catch (error) {
    // ignore parse errors
  }

  if (!response.ok || body?.success === false) {
    const message =
      body?.message ||
      body?.error ||
      response.statusText ||
      "Unable to load device data.";
    throw new Error(message);
  }

  return body?.data ?? [];
}

export async function fetchAccessCategory({ token }) {
  if (!token) {
    throw new Error("Missing LiveLink token. Please log in again.");
  }

  const response = await fetch(`${BASE_URL}/v1/Analytics/Access/Data?dataType=accessCatg`, {
    method: "GET",
    headers: buildHeaders({ token }),
    cache: "no-store"
  });

  let body = null;
  try {
    body = await response.json();
  } catch (error) {
    // ignore parse errors
  }

  if (!response.ok || body?.success === false) {
    const message =
      body?.message ||
      body?.error ||
      response.statusText ||
      "Unable to load category data.";
    throw new Error(message);
  }

  return body?.data ?? [];
}

export async function fetchAccessGate({ token }) {
  if (!token) {
    throw new Error("Missing LiveLink token. Please log in again.");
  }

  const response = await fetch(`${BASE_URL}/v1/Analytics/Access/Data?dataType=accessGate`, {
    method: "GET",
    headers: buildHeaders({ token }),
    cache: "no-store"
  });

  let body = null;
  try {
    body = await response.json();
  } catch (error) {
    // ignore parse errors
  }

  if (!response.ok || body?.success === false) {
    const message =
      body?.message ||
      body?.error ||
      response.statusText ||
      "Unable to load gate data.";
    throw new Error(message);
  }

  return body?.data ?? [];
}

export async function fetchAccessGateCatg({ token }) {
  if (!token) {
    throw new Error("Missing LiveLink token. Please log in again.");
  }

  const response = await fetch(`${BASE_URL}/v1/Analytics/Access/Data?dataType=accessGateCatg`, {
    method: "GET",
    headers: buildHeaders({ token }),
    cache: "no-store"
  });

  let body = null;
  try {
    body = await response.json();
  } catch (error) {
    // ignore parse errors
  }

  if (!response.ok || body?.success === false) {
    const message =
      body?.message ||
      body?.error ||
      response.statusText ||
      "Unable to load gate/category data.";
    throw new Error(message);
  }

  return body?.data ?? [];
}
