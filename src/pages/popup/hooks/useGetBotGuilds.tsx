import { useQuery } from "@tanstack/react-query";
import { sendMessagePromise } from "../utils/sendMessagePromise";
import { Guild } from "./useGetGuilds";

const getGuilds = async (guildIds: string[]) => {
  const guilds = await sendMessagePromise<Guild[], string[]>(
    "GET_BOT_GUILDS",
    guildIds
  );

  console.log(guilds);

  return guilds;
};

type useGetBotGuildsProps = {
  guildIds: string[];
  enabled: boolean;
};

const useGetBotGuilds = ({ guildIds, enabled }: useGetBotGuildsProps) => {
  return useQuery({
    queryKey: ["botGuilds", guildIds],
    queryFn: () => getGuilds(guildIds),
    enabled,
  });
};

export default useGetBotGuilds;
