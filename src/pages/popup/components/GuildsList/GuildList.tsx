import useGetBotGuilds from "../../hooks/useGetBotGuilds";
import useGetGuilds from "../../hooks/useGetGuilds";
import { DiscordUser } from "../../hooks/useIsAuthenticated";
import GuildItem from "../GuildItem/GuildItem";
import discordPath from "../../../../assets/img/discord-icon.svg";

interface GuildListProps {
  user: DiscordUser;
}
const GuildList = ({ user }: GuildListProps) => {
  const { data } = useGetGuilds();

  const { data: filteredGuilds, isSuccess } = useGetBotGuilds({
    enabled: !!data,
    guildIds: data,
  });

  return (
    <div className="flex min-h-[320px] w-96 flex-col bg-[#313338] px-5 py-2 text-white">
      <div className="flex flex-col gap-10">
        <div className="flex justify-evenly items-center">
          <img
            src={discordPath}
            alt="discordLogo"
            style={{
              zIndex: 9999,
              width: "60px",
              height: "60px",
            }}
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2 rounded-md bg-gray-700 px-5 py-2">
              <img
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                alt="userAvatar"
                className="w-8 rounded-full"
              />
              <div>
                <h1 className="ml-auto text-lg font-semibold">
                  {user.username}
                </h1>
                <h1 className="text-md ml-auto cursor-pointer font-semibold text-blue-500 underline">
                  Sign out
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-lg">Servers with the extension:</h1>
          <div className="flex flex-col gap-4">
            {isSuccess &&
              filteredGuilds?.map((guild) => {
                return <GuildItem key={guild.id} {...guild} />;
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuildList;
