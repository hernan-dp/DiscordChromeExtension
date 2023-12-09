import { createRoot } from "react-dom/client";
import App from "@src/pages/content/components/Demo/app";
import refreshOnUpdate from "virtual:reload-on-update-in-view";

refreshOnUpdate("pages/content");

const root = document.createElement("div");
root.id = "discord-bot-button";

const buttonsRenderList = document.getElementsByTagName(
  "ytmusic-like-button-renderer"
);

const shadowRoot = root.attachShadow({ mode: "open" });

const renderIn = document.createElement("div");
shadowRoot.appendChild(renderIn);

createRoot(root).render(<App />);
