import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import { getParams, openNewTab } from "./misc";

reloadOnUpdate("pages/background");

reloadOnUpdate("pages/content/style.scss");

type Message<T> = {
  action: string;
  payload: T;
};

type SendResponse = (response?: unknown) => void;

const CLIENT_ID = "1182892762450907176";
const CLIENT_SECRET = "A7myX-DiEa5IgfUayzyqbxwVQJ9cQjdB";
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

  if (
    url &&
    (url.includes(REDIRECT_URI + "/?code=") ||
      url.includes(REDIRECT_URI + "/#token_type"))
  ) {
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
  switch (request.type) {
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
        getAccessTokenFromCode(g_tokens.code).then((token) => {
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
  }
  return true;
});

/**
 * Refresh tokens from refresh_token
 * @param {string} refresh_token
 */
const getAccessToken = (refresh_token) => {
  return new Promise((resolve, reject) => {
    fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body:
        "grant_type=refresh_token&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET +
        "&redirect_uri=" +
        encodeURIComponent(REDIRECT_URI) +
        "&refresh_token=" +
        refresh_token,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getAccessTokenFromCode = (auth_token: string) => {
  return new Promise((resolve, reject) => {
    const data = {
      grant_type: "authorization_code",
      code: auth_token,
      redirect_uri: REDIRECT_URI,
    };

    fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Make api call from access_token
 * @param {string} api endpoints
 * @param {string} method 'GET', 'POST', ....
 * @param {object} tokens
 * @param {object} body
 */
const apiCall = (api, method, tokens, body = undefined) => {
  return new Promise((resolve, reject) => {
    fetch("https://discord.com/api" + api, {
      method: method,
      headers: {
        Authorization: `${tokens.token_type} ${tokens.access_token}`,
        "Content-Type": "application/x-www/form-urlencoded",
      },
      body: body,
    })
      .then((resp) => {
        console.log("~~~~~~~~~~~ resp", resp);
        return resp.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};


