import { createRoot } from "react-dom/client";
import App from "@src/pages/content/components/Demo/app";
import refreshOnUpdate from "virtual:reload-on-update-in-view";

refreshOnUpdate("pages/content");

const root = document.createElement("div");
root.id = "discord-bot-button";

const buttonList = document.getElementsByTagName('ytmusic-like-button-renderer')


document.querySelectorAll("ytmusic-like-button-renderer").forEach((element, index) => {
  console.log('3')
  root.id = `discord-bot-button-${index}`;
  element.appendChild(root);
});



createRoot(root).render(<App />);
