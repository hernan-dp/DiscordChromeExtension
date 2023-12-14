import { useEffect, useState } from "react";
import discordLogo from "../../assets/img/discord-icon.svg";
import LoadingPopup from "./components/LoadingPopup/LoadingPopup";
import GuildList from "./components/GuildsList/GuildList";
import useIsAuthenticated from "./hooks/useIsAuthenticated";

const Popup = () => {
  const { data, isLoading, error, isError } = useIsAuthenticated();

  if (isLoading) return <LoadingPopup />;

  return (
    <div className="flex w-96 flex-col items-center bg-[#313338] px-10 py-5">
      <img
        src={chrome.runtime.getURL(discordLogo)}
        alt="discordLogo"
        className="w-24 rounded-full"
      />

      <h1 className="mx-5 text-center text-2xl font-bold text-white">
        Give permissions to the extension
      </h1>
      {!data && (
        <button
          onClick={() => {
            console.log("perm");
          }}
          className="text-md mt-10 rounded-xl bg-gray-700 px-5 py-2 text-white hover:bg-gray-600"
        >
          GIVE PERMISSIONS
        </button>
      )}
    </div>
  );
};

export default Popup;
