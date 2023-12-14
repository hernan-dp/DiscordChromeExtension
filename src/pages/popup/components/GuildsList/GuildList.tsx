import useGetBotGuilds from "../../hooks/useGetBotGuilds";
import useGetGuilds from "../../hooks/useGetGuilds";
import { DiscordUser } from "../../hooks/useIsAuthenticated";

interface GuildListProps {
  user: DiscordUser;
}
const GuildList = ({ user }: GuildListProps) => {
  const { data } = useGetGuilds();

  const { data: filteredGuilds, isSuccess } = useGetBotGuilds({
    enabled: !!data,
    guildIds: data,
  });

  console.log(filteredGuilds)

  return (
    <div className="flex min-h-[320px] w-96 flex-col bg-[#313338] px-10 py-5 text-white">
      <div className="flex gap-2">
        <h1 className="text-xl font-semibold">Welcome {user.username}</h1>
      </div>
      <div>
        {isSuccess &&
          filteredGuilds?.map((guild) => {
            console.log(
              `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
            );
            return (
              <div key={guild.id} className="flex items-center gap-2">
                <img
                  src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                  alt="guildIcon"
                  className="w-10 rounded-full"
                />
                <h1 className="text-md font-semibold">{guild.name}</h1>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default GuildList;
