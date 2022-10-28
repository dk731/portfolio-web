import { defineStore } from "pinia";

type InternetState = {
  activeUrl?: string;
  historyState: string[];
};

export const useInternerState = defineStore("win95-internet-app", {
  state: () => ({ historyState: [] } as InternetState),
  actions: {},
});
