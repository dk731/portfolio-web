import { defineStore } from "pinia";

export type TaskbarTask = {
  id: string;
  iconName?: string;
  taskbarTitle?: string;
  onOpenClb: () => void;
};

export const useDesktopState = defineStore("desktop-store", {
  state: () => ({
    taskbar: {
      activeApp: undefined as TaskbarTask | undefined,
      taskbarApps: [] as TaskbarTask[],
    },
  }),
});
