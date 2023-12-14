import React from "react";
import discordLogo from "../../../assets/img/discord-icon.svg";

const LoadingPopup = () => {
  return (
    <div className="flex h-80 w-96 flex-col items-center justify-center gap-5 bg-[#313338] px-10 py-5">
      <img
        src={chrome.runtime.getURL(discordLogo)}
        alt="discordLogo"
        className="w-24 animate-spin rounded-full"
      />
    </div>
  );
};

export default LoadingPopup;
