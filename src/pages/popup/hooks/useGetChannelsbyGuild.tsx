import { useQuery } from "@tanstack/react-query";
import { sendMessagePromise } from "../utils/sendMessagePromise";

export type DiscordChannel = {
  id: string;
  type: number;
  lastMessageID: string;
  flags: number;
  guildID: string;
  name: string;
  parentID: string;
  rateLimitPerUser: number;
  bitrate: number;
  userLimit: number;
  rtcRegion: null;
  position: number;
  permissionOverwrites: unknown[];
  nsfw: boolean;
  iconEmoji: IconEmoji;
  themeColor: null;
};

export type IconEmoji = {
  id: null;
  name: string;
};

const getChannels = async (guildId: string) => {
  const guilds = await sendMessagePromise<DiscordChannel[], string>(
    "GET_CHANNEL_BY_GUILD",
    guildId
  );

  return guilds;
};

type useGetBotGuildsProps = {
  guildId: string;
};

const useGetChannelsbyGuild = ({ guildId }: useGetBotGuildsProps) => {
  return useQuery({
    queryKey: ["GET_CHANNEL_BY_GUILD", guildId],
    queryFn: () => getChannels(guildId),
  });
};

export default useGetChannelsbyGuild;
