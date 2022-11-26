import { defineStore } from "pinia";

type InternetState = {
  backHistory: string[];
  forwardHistory: string[];
  activeUrl?: string;
};

export const useInternerState = defineStore("win95-internet-app", {
  state: () => ({ backHistory: [], forwardHistory: [] } as InternetState),
  actions: {},
});
