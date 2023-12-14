import { useQuery } from "@tanstack/react-query";
import { sendMessagePromise } from "../utils/sendMessagePromise";

export type DiscordUser = {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  publicFlags: number;
  premiumType: number;
  flags: number;
  banner: null;
  accentColor: null;
  globalName: string;
  avatarDecorationData: null;
  bannerColor: null;
  mfaEnabled: boolean;
  locale: string;
};

const checkAuth = async () => {
  const response = await sendMessagePromise<DiscordUser>("CHECK_AUTH");

  return response;
};

const useIsAuthenticated = () => {
  return useQuery({
    queryKey: ["CHECK_AUTH"],
    queryFn: checkAuth,
  });
};

export default useIsAuthenticated;
