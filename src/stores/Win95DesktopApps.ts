import { defineStore } from "pinia";

export type AppMeta = {
  id: string;
  title: string;
  icon: string;
  onFocusClb: () => void;
};

export const useDesktopApps = defineStore("desktop-apps", {
  state: () => ({
    apps: {} as { [id: string]: AppMeta },
  }),
});
