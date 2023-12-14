import { Guild } from "../../hooks/useGetGuilds";
import useGetChannelsbyGuild from "../../hooks/useGetChannelsbyGuild";

const GuildItem = ({ id, icon, name }: Guild) => {
  const { data, isSuccess } = useGetChannelsbyGuild({ guildId: id });

  return (
    <div>
      <div
        key={id}
        className="flex items-center gap-2 rounded-md bg-[#1e1f22] px-5 py-2"
      >
        <img
          src={`https://cdn.discordapp.com/icons/${id}/${icon}.png`}
          alt="guildIcon"
          className="w-10 rounded-full"
        />
        <h1 className="text-lg font-semibold">{name}</h1>
      </div>
      <div className="mx-2 mt-2 flex flex-col gap-2">
        {isSuccess &&
          data.map((channel) => {
            return (
              <div
                key={channel.id}
                className="flex items-center gap-2 rounded-md bg-gray-700 px-5 py-2"
              >
                <input
                  type="radio"
                  radioGroup="radioGroup"
                  name="radioGroup"
                  value="radio1"
                  className="cursor-pointer"
                />
                <h1 className="text-md font-semibold"># {channel.name}</h1>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default GuildItem;
