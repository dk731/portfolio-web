import { defineStore } from "pinia";

type TaskBarState = {
  apps: string[]; // Array of ids of oppened application that should be displayed in taskbar
};

export const useTaskbarState = defineStore("win95-taskbar", {
  state: () =>
    ({
      apps: [],
    } as TaskBarState),
  actions: {
    add(app: string) {
      this.apps = [...this.apps.filter((el) => el != app), app];
    },
    remove(app: string) {
      this.apps = this.apps.filter((el) => el != app);
    },
  },
});
