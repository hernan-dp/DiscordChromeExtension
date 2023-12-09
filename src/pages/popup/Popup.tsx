import { useEffect, useState } from "react";
import discordLogo from "../../assets/img/discord-icon.svg";

const Popup = ({
  openOAuth,
}: {
  openOAuth: () => void;
  hasAuth?: () => boolean;
}) => {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "CHECK_AUTH" }, function (response) {
      setAuth(!!response);
    });
  }, []);

  return (
    <div className="flex w-96 flex-col items-center bg-[#313338] px-10 py-5">
      <img
        src={chrome.runtime.getURL(discordLogo)}
        alt="discordLogo"
        className="w-24 rounded-full"
      />

      <h1 className="mx-5 text-center text-2xl font-bold text-white">
        {auth ? "Authorized" : "Give Permissions to the extension"}
      </h1>
      {!auth && (
        <button
          onClick={openOAuth}
          className="text-md mt-10 rounded-xl bg-gray-700 px-5 py-2 text-white hover:bg-gray-600"
        >
          GIVE PERMISSIONS
        </button>
      )}
    </div>
  );
};

export default Popup;