// Fetch Utils

import { getAccessToken } from "./authUtils";

type FetchApi = {
  endpoint: string;
  method: string;
  payload?: unknown;
};

const BASE_URL = "http://localhost:3000/api";

export const fetchLocalServer = ({ endpoint, method, payload }: FetchApi) => {
  const body = payload ? JSON.stringify(payload) : undefined;
  const controller = new AbortController();
  const headers = new Headers({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  setTimeout(() => controller.abort(), 20000);

  return fetch(`${BASE_URL}${endpoint}`, {
    method,
    body,
    headers,
    signal: controller.signal,
  });
};

const DISCORD_URL = "https://discord.com/api";

export const fetchDiscord = ({ endpoint, method, payload }: FetchApi) => {
  const body = payload ? JSON.stringify(payload) : undefined;
  const controller = new AbortController();
  const headers = new Headers({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  setTimeout(() => controller.abort(), 20000);

  return fetch(`${DISCORD_URL}${endpoint}`, {
    method,
    body,
    headers,
    signal: controller.signal,
  });
};

export const fetchDiscordWithAuth = async ({
  endpoint,
  method,
  tokens,
  payload,
}: FetchApi & {
  tokens: {
    token_type: string;
    access_token: string;
    refresh_token: string;
  };
}) => {
  const body = payload ? JSON.stringify(payload) : undefined;
  const controller = new AbortController();
  const headers = new Headers({
    Authorization: `Bearer ${tokens.access_token}`,
    "Content-Type": "application/x-www/form-urlencoded",
  });

  setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(`${DISCORD_URL}${endpoint}`, {
      method,
      body,
      headers,
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`${response.status}`);

    return response.json();
  } catch (error) {
    const authToken = (await getAccessToken(tokens.refresh_token)) as {
      token_type: string;
      access_token: string;
      refresh_token: string;
    };

    const responseWithRefreshToken = await fetch(`${DISCORD_URL}${endpoint}`, {
      method,
      body,
      headers: {
        Authorization: `Bearer ${authToken.access_token}`,
        "Content-Type": "application/x-www/form-urlencoded",
      },
      signal: controller.signal,
    }).catch((error) => {
      throw new Error(error);
    });

    if (!responseWithRefreshToken.ok)
      throw new Error(`${responseWithRefreshToken.status}`);

    return responseWithRefreshToken.json();
  }
};
