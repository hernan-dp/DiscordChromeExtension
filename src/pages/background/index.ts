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

    case "SEND_SONG_TO_DISCORD": {
      break;
    }

    default:
      break;
  }

  return true;
});

/* switch (request.type) {
    case "GIVE_BOT_GUILD_PERMISSIONS": {
      const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&response_type=code&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&scope=guilds+bot+identify`;

      openNewTab(authUrl);
      sendResponse(true);
      break;
    }
    case "SEND_SONG_TO_DISCORD": {
      const headers = new Headers({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      });

      const body = JSON.stringify({
        channelId: "888201877366398976",
        url: "https://music.youtube.com/playlist?list=OLAK5uy_k7uJEl8coAjHupM-M6GVE623OExTGmkdA&si=nid6CBAvGsuoJPyL",
      });

      const options = {
        method: "POST",
        headers: headers,
        body: body,
      };

      fetch("http://localhost:3000/api/send-discord", options);

      break;
    }

    case "CHECK_AUTH": {
      console.log("~~~~~~~~~~~~~~~ checking auth", g_tokens);
      if (g_tokens && g_tokens.access_token) {
        return apiCall(CURRENT_USER_API, "GET", g_tokens)
          .then(function (data) {
            sendResponse(data);
          })
          .catch(function (err) {
            console.error("~~~~~~~~~ error in getting userinfo", err);
            if (g_tokens.refresh_token) {
              getAccessToken(g_tokens.refresh_token)
                .then((token) => {
                  g_tokens = token;

                  apiCall(CURRENT_USER_API, "GET", g_tokens)
                    .then(function (data) {
                      sendResponse(data);
                    })
                    .catch(function (err) {
                      console.error("~~~~~~~~~ error in getting userinfo", err);
                      sendResponse(false);
                    });
                })
                .catch((err) => {
                  console.error("~~~~~~~~~~~~ error in refreshing token ", err);
                  sendResponse(false);
                });
            } else {
              sendResponse(false);
            }
          });
      } else if (g_tokens && g_tokens.code) {
        console.log(g_tokens.code);
        getAccessTokenFromCode(g_tokens.code).then((token) => {
          console.log("~~~~~~~~~~~~~~~ token", token);
          apiCall(CURRENT_USER_API, "GET", token)
            .then((data) => {
              sendResponse(data);
            })
            .catch((err) => {
              console.error(
                "~~~~~~~~~ error in getting userinfo with code",
                err
              );
              sendResponse(false);
            });
        });
      } else {
        sendResponse(false);
      }
      break;
    }

    case "GET_GUILDS": {
      apiCall("/users/@me/guilds", "GET", g_tokens)
        .then((data) => {
          sendResponse(data);
        })
        .catch((err) => {
          console.error("~~~~~~~~~ error in getting guilds", err);
          sendResponse(false);
        });
      break;
    }
  } */

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
