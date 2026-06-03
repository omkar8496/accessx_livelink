import { BASE_URL, API_KEY } from "./config";

const SEND_OTP_ENDPOINT = `${BASE_URL}/LiveLink/sendOTP`;
const VERIFY_OTP_ENDPOINT = `${BASE_URL}/LiveLink/verifyOTP`;

async function handleResponse(response) {
  let body = null;
  try {
    body = await response.json();
  } catch {
    // Response body is optional; swallow parse errors.
  }

  if (!response.ok) {
    const message =
      body?.message ||
      body?.error ||
      response.statusText ||
      "Unable to send OTP. Please try again.";
    throw new Error(message);
  }

  return body;
}

export async function requestLivelinkOtp({ email, code }) {
  const response = await fetch(SEND_OTP_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY
    },
    body: JSON.stringify({ email, code }),
    cache: "no-store"
  });

  return handleResponse(response);
}

export async function verifyLivelinkOtp({ email, code, otp }) {
  const response = await fetch(VERIFY_OTP_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY
    },
    body: JSON.stringify({ email, code, otp }),
    cache: "no-store"
  });

  const result = await handleResponse(response);

  if (result && typeof result === "object" && "success" in result && result.success === false) {
    throw new Error(result.message || "Incorrect OTP. Please try again.");
  }

  return result;
}
