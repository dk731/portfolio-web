import { defineStore } from "pinia";

type DesktopWindowsState = {
  oppened: string[]; // Array of application ids
};
// Order of ids is important as its index translates oppened window
// z - index on desktop

export const useWindowsState = defineStore("win95-windows", {
  state: () =>
    ({
      oppened: [],
    } as DesktopWindowsState),
  actions: {
    moveFront(app: string) {
      this.oppened = [...this.oppened.filter((el) => el != app), app];
    },
    add(app: string) {
      this.moveFront(app);
    },
    remove(app: string) {
      this.oppened = this.oppened.filter((el) => el != app);
    },
  },
});
