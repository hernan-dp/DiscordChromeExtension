import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Popup from "../../Popup";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const MainApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <link href="https://fonts.cdnfonts.com/css/satoshi" rel="stylesheet" />
      <Popup />
    </QueryClientProvider>
  );
};

export default MainApp;
