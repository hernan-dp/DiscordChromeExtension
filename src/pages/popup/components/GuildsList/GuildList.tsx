import React, { useEffect, useState } from "react";

const GuildList = () => {
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);

 /*  useEffect(() => {
    chrome.runtime.sendMessage({ type: "CHECK_AUTH" }, function (response) {
      setLoading(false);
      setAuth(!!response);
    });
  }, []); */

  return (
    <div className="flex min-h-[320px] w-96 flex-col items-center bg-[#313338] px-10 py-5 text-white">
      GuildList
    </div>
  );
};

export default GuildList;
