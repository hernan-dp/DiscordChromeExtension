import discordLogo from "../../../../assets/img/discord-icon.svg";

export default function App({ key }: { key: string }) {
  const discordPath = chrome.runtime.getURL(discordLogo);

  const onClick = () => {
    const input = document.getElementById("share-url") as HTMLInputElement;
    const url = input.value;

    chrome.runtime.sendMessage({ type: "SEND_SONG_TO_DISCORD", url });
  };

  return (
    <div
      id={key}
      className="z-50 bg-white text-3xl text-white"
      style={{ zIndex: 9999 }}
    >
      <button
        style={{
          background: "white",
          marginTop: "30px",
          borderRadius: "0.75rem",
        }}
        onClick={onClick}
      >
        <img
          src={discordPath}
          alt="discordLogo"
          style={{
            zIndex: 9999,
            width: "50px",
            height: "50px",
          }}
        />
        <h1>Share on discord</h1>
      </button>
    </div>
  );
}
