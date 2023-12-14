import { useMutation } from "@tanstack/react-query";
import { sendMessagePromise } from "../utils/sendMessagePromise";

const getPermissions = () =>
  sendMessagePromise<unknown>("GIVE_BOT_GUILD_PERMISSIONS");

const useGetPermissions = () => {
  return useMutation({
    mutationFn: getPermissions,
  });
};

export default useGetPermissions;
