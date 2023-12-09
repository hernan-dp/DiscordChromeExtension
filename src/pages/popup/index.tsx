import Popup from "@pages/popup/Popup";
import "@src/style/app.css";
import { createRoot } from "react-dom/client";
import refreshOnUpdate from "virtual:reload-on-update-in-view";

refreshOnUpdate("pages/popup");

function init() {
  const appContainer = document.querySelector("#app-container");
  if (!appContainer) {
    throw new Error("Can not find #app-container");
  }
  const root = createRoot(appContainer);

  const openOAuth = () => {
    chrome.runtime.sendMessage({ type: "CLICKED_OAUTH_BTN" });
  };

  root.render(<Popup openOAuth={openOAuth} />);
}

init();
