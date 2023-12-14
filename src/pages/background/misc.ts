// Chrome Utils
export const openNewTab = (url) => {
  chrome.tabs.query({ url: url }, (tabs) => {
    if (tabs.length) {
      chrome.tabs.update(tabs[0].id, { active: true });
    } else {
      chrome.tabs.create({ url: url });
    }
  });
};

/**
 * Get params from url string
 * @param {string} url
 */
export const getParams = (url) => {
  const params = {};
  const urlObject = new URL(url);
  const searchParams = urlObject.searchParams;

  searchParams.forEach((value, key) => {
    params[key] = decodeURIComponent(value);
  });

  return params;
};
