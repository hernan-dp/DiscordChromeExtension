import { atomWithStorage } from "jotai/utils";

export const selectedChannel = atomWithStorage<string | null>(
  "selectedChannelId",
  null
);
