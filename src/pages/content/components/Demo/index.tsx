import { createRoot } from "react-dom/client";
import App from "@src/pages/content/components/Demo/app";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import "../../style.css";

refreshOnUpdate("pages/content");

function waitForModal() {
  const modalList = document.getElementsByTagName(
    "ytmusic-unified-share-panel-renderer"
  );

  if (modalList.length > 0) {
    insertContentScript(modalList[0]);
  } else {
    // Modal not open yet, retry after a short delay
    setTimeout(waitForModal, 600);
  }
}

// Start waiting for the modal
waitForModal();

function insertContentScript(modal) {
  // Your content script logic goes here
  console.log(modal);
  const root = document.createElement("div");
  root.id = `discord-root`;

  modal?.appendChild(root);
  createRoot(root).render(<App key={`discord`} />);
}
