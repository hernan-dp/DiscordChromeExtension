import discordLogo from "../../../../assets/img/discord-icon.svg";
import useGetPermissions from "../../hooks/useGetPermissions";

const AskPermission = () => {
  const { mutate } = useGetPermissions();
  return (
    <>
      <img
        src={chrome.runtime.getURL(discordLogo)}
        alt="discordLogo"
        className="w-24 rounded-full"
      />
      <h1 className="mx-5 text-center text-2xl font-bold text-white">
        Give permissions to the extension
      </h1>

      <button
        onClick={() => mutate()}
        className="text-md mt-10 rounded-xl bg-gray-700 px-5 py-2 text-white hover:bg-gray-600"
      >
        GIVE PERMISSIONS
      </button>
    </>
  );
};

export default AskPermission;
