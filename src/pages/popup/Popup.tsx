import LoadingPopup from "./components/LoadingPopup/LoadingPopup";
import GuildList from "./components/GuildsList/GuildList";
import useIsAuthenticated from "./hooks/useIsAuthenticated";
import AskPermission from "./components/AskPermission/AskPermission";

const Popup = () => {
  const { isLoading, isError, data: user } = useIsAuthenticated();


  if (isLoading) return <LoadingPopup />;
  if (isError) return <AskPermission />;

  return (
    <div className="flex min-h-[20rem] w-96 flex-col items-center bg-[#313338] px-10 py-5">
      <GuildList user={user} />
    </div>
  );
};

export default Popup;
