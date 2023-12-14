const CLIENT_ID = "1182892762450907176";
const CLIENT_SECRET = "A7myX-DiEa5IgfUayzyqbxwVQJ9cQjdB";
const REDIRECT_URI = "https://discord.com";

export const getAccessTokenFromCode = (code: string) => {
  return new Promise((resolve, reject) => {
    const data = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });

    const headers = new Headers({
      "Content-Type": "application/x-www-form-urlencoded",
    });

    const options = {
      method: "POST",
      headers: headers,
      body: data,
    };

    fetch("https://discord.com/api/oauth2/token", options)
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

export const getAccessToken = (refresh_token) => {
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

export const getAuthUrl = () => {
  const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&response_type=code&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=guilds+bot+identify`;

  return authUrl;
};
