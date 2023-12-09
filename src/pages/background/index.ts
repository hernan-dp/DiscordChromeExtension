import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("pages/background");

reloadOnUpdate("pages/content/style.scss");

const CLIENT_ID = "1182892762450907176";
const CLIENT_SECRET = "A7myX-DiEa5IgfUayzyqbxwVQJ9cQjdB";
const REDIRECT_URI = "https://discord.com";

const CURRENT_USER_API = "/users/@me";
const CHANNEL_API = "v9/channels/888201877366398976/messages";

let g_tokens;

/**
 * Tabs update listener
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const url = tab.url;

  if (url && url.includes(REDIRECT_URI + "/#token_type")) {
    const params = getParams(url.replace("#", "?"));

    g_tokens = params;
    chrome.tabs.remove(tab.id);
  }
});

/**
 * Message Listener
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "CLICKED_OAUTH_BTN": {
      const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&permissions=3072&response_type=code&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&scope=bot+identify`;

      openNewTab(authUrl);
      sendResponse(true);
      break;
    }
    case "SEND_SONG_TO_DISCORD": {
      if (g_tokens && g_tokens.access_token) {
        apiCall(CHANNEL_API, "POST", g_tokens, {
          mobile_network_type: "unknown",
          content: `<@483377420494176258> 12312312 ${request.url}`,
          tts: false,
          flags: 0,
        });
      }
      break;
    }
    case "CHECK_AUTH": {
      if (g_tokens && g_tokens.access_token) {
        apiCall(CURRENT_USER_API, "GET", g_tokens)
          .then(function (data) {
            sendResponse(data);
          })
          .catch(function (err) {
            console.log("~~~~~~~~~ error in getting userinfo", err);
            if (g_tokens.refresh_token) {
              getAccessToken(g_tokens.refresh_token)
                .then((token) => {
                  g_tokens = token;

                  //Userinfo from discord API
                  apiCall(CURRENT_USER_API, "GET", g_tokens)
                    .then(function (data) {
                      sendResponse(data);
                    })
                    .catch(function (err) {
                      console.log("~~~~~~~~~ error in getting userinfo", err);
                      sendResponse(false);
                    });
                })
                .catch((err) => {
                  console.log("~~~~~~~~~~~~ error in refreshing token ", err);
                  sendResponse(false);
                });
            } else {
              sendResponse(false);
            }
          });
      } else {
        sendResponse(false);
      }
      break;
    }
  }
  return true;
});

/**
 * Open new tab by url
 * @param {string} url
 */
const openNewTab = (url) => {
  chrome.tabs.query({ url: url }, (tabs) => {
    if (tabs.length) {
      chrome.tabs.update(tabs[0].id, { active: true });
    } else {
      chrome.tabs.create({ url: url }, function (tab) {
        const g_opendTab = tab;
      });
    }
  });
};

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

/**
 * Make api call from access_token
 * @param {string} api endpoints
 * @param {string} method 'GET', 'POST', ....
 * @param {object} tokens
 * @param {object} body
 */
const apiCall = (api, method, tokens, body = undefined) => {
  console.log({ tokens });
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

/**
 * Get params from url string
 * @param {string} url
 */
const getParams = (url) => {
  const params = {};
  const urlObject = new URL(url);
  const searchParams = urlObject.searchParams;

  searchParams.forEach((value, key) => {
    params[key] = decodeURIComponent(value);
  });

  return params;
};
