import { useEffect, useState } from "react";
import discordLogo from "../../assets/img/discord-icon.svg";
import LoadingPopup from "./components/LoadingPopup/LoadingPopup";
import GuildList from "./components/GuildsList/GuildList";
import useIsAuthenticated from "./hooks/useIsAuthenticated";
import AskPermission from "./components/AskPermission/AskPermission";

const Popup = () => {
  const { isLoading, isError } = useIsAuthenticated();

  if (isLoading) return <LoadingPopup />;

  return (
    <div className="flex min-h-[20rem] w-96 flex-col items-center justify-center bg-[#313338] px-10 py-5">
      {isLoading && <LoadingPopup />}
      {isError ? <AskPermission /> : <GuildList />}
    </div>
  );
};

export default Popup;
