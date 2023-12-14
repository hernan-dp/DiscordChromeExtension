import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import { getParams, openNewTab } from "./misc";
import { fetchDiscordWithAuth, fetchLocalServer } from "./utils/fetchUtils";
import { getAccessTokenFromCode, getAuthUrl } from "./utils/authUtils";

reloadOnUpdate("pages/background");

reloadOnUpdate("pages/content/style.scss");

const REDIRECT_URI = "https://discord.com";

const CURRENT_USER_API = "/users/@me";

let g_tokens;

chrome.storage.local.get("g_tokens", (result) => {
  if (!result || !result.g_tokens) return;

  g_tokens = JSON.parse(result.g_tokens);
});

/**
 * Tabs update listener
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const url = tab.url;

  if (url && url.includes(REDIRECT_URI + "/?code=")) {
    let params = getParams(url);

    const { code } = params as { code: string };
    getAccessTokenFromCode(code).then(
      (token: { access_token: string; refresh_token: string }) => {
        params = {
          ...params,
          access_token: token.access_token,
          refresh_token: token.refresh_token,
        };

        g_tokens = params;

        chrome.storage.local.set({ g_tokens: JSON.stringify(g_tokens) });

        chrome.tabs.remove(tab.id);
      }
    );
  }

  if (url && url.includes(REDIRECT_URI + "/#token_type")) {
    const params = getParams(url);

    g_tokens = params;

    chrome.storage.local.set({ g_tokens: JSON.stringify(g_tokens) });

    chrome.tabs.remove(tab.id);
  }
});

/**
 * Message Listener
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case "CHECK_AUTH": {
      checkAuth(sendResponse);
      break;
    }
    case "GIVE_BOT_GUILD_PERMISSIONS": {
      givePermissions(sendResponse);
      break;
    }
    case "GET_GUILDS": {
      getGuilds(sendResponse);
      break;
    }

    case "GET_BOT_GUILDS": {
      getBotGuilds(sendResponse, request.payload);
      break;
    }

    case "GET_CHANNEL_BY_GUILD": {
      getChannelByGuildId(sendResponse, request.payload);
      break;
    }

    case "SEND_SONG_TO_DISCORD": {
      break;
    }

    default:
      break;
  }

  return true;
});

type SendResponse = (response?: unknown) => void;

const checkAuth = (sendResponse: SendResponse) => {
  fetchDiscordWithAuth({
    endpoint: CURRENT_USER_API,
    method: "GET",
    tokens: g_tokens,
  })
    .then((data: unknown) => sendResponse({ complete: true, data }))
    .catch((e) => {
      console.error(e);
      sendResponse({
        complete: true,
        error: "Error in getting user info",
      });
    });
};

const getGuilds = (sendResponse: SendResponse) => {
  fetchDiscordWithAuth({
    endpoint: "/users/@me/guilds",
    method: "GET",
    tokens: g_tokens,
  })
    .then((data: unknown) => sendResponse({ complete: true, data }))
    .catch((e) => {
      console.error(e);
      sendResponse({
        complete: true,
        error: "Error in getting guilds",
      });
    });
};

const givePermissions = (sendResponse: SendResponse) => {
  const authUrl = getAuthUrl();
  openNewTab(authUrl);
  sendResponse({ complete: true });
};

const getBotGuilds = (sendResponse: SendResponse, guildIds) => {
  const searchParams = new URLSearchParams({ guildIds });
  const endpoint = `/get-discord-guilds/?${searchParams}`;

  fetchLocalServer({
    endpoint,
    method: "GET",
  })
    .then((data) => sendResponse({ complete: true, data }))
    .catch((e) => {
      console.error(e);
      sendResponse({
        complete: true,
        error: "Error in getting guilds from server",
      });
    });
};

const getChannelByGuildId = (sendResponse: SendResponse, guildId: string) => {
  const searchParams = new URLSearchParams({ guildId });
  const endpoint = `/get-discord-channels/?${searchParams}`;
  fetchLocalServer({
    endpoint,
    method: "GET",
  })
    .then((data) => sendResponse({ complete: true, data }))
    .catch((e) => {
      console.error(e);
      sendResponse({
        complete: true,
        error: "Error in getting guilds from server",
      });
    });
};
