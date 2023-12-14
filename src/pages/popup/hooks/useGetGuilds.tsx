import { useQuery } from "@tanstack/react-query";
import { sendMessagePromise } from "../utils/sendMessagePromise";

export type Guild = {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: number;
  permissionsNew: string;
  features: string[];
};

const getGuilds = async () => {
  const guilds = await sendMessagePromise<Guild[]>("GET_GUILDS");

  return guilds;
};

const useGetGuilds = () => {
  return useQuery({
    queryKey: ["guilds"],
    queryFn: getGuilds,
    select: (data) => data.map((guild) => guild.id),
  });
};

export default useGetGuilds;
