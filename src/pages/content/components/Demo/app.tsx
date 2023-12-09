import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    console.log("content view loaded");
  }, []);

  return <div className="disc-text-white disc-text-3xl disc-bg-white">view</div>;
}
