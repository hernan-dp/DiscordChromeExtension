import { useQuery } from "@tanstack/react-query";
import { sendMessagePromise } from "../utils/sendMessagePromise";

const checkAuth = async () => {
  const response = await sendMessagePromise<unknown>("CHECK_AUTH");

  return response;
};

const useIsAuthenticated = () => {
  return useQuery({
    queryKey: ["CHECK_AUTH"],
    queryFn: checkAuth,
  });
};

export default useIsAuthenticated;
