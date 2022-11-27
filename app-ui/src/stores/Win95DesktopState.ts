import { defineStore } from "pinia";

export type DesktopPoint = { x: number; y: number };
export type DesktopSize = { width: number; height: number };

export enum Win95Cursor {
  default = "/cursors/arrow.cur",
  sideResize = "/cursors/Cursor_8.cur",
  topBotResize = "/cursors/Cursor_9.cur",
  cornerResizePos = "/cursors/Cursor_7.cur",
  cornerResizeNeg = "/cursors/Cursor_6.cur",
  loading = "/cursors/Cursor_3.cur",
}

export enum Win95Font {
  default = "win95-non-bold",
  bold = "win95-bold",
}

export type DesktopStorageState = {
  booted: boolean;
  isShutDown: boolean;
};

type DesktopState = {
  focusedApp?: string;
  activeApp?: string;
  size: DesktopSize;
  cursor: Win95Cursor;
  runningApps: string[]; // Array of app ids
  storageState: DesktopStorageState;
  needBoot: boolean;
};

const defaultState: DesktopStorageState = { booted: false, isShutDown: false };
const currentState = localStorage.getItem("win95State");

export const useDesktopState = defineStore("win95-desktop-state", {
  state: () =>
    ({
      size: { width: 0, height: 0 },
      cursor: Win95Cursor.default,
      runningApps: [],
      storageState: currentState ? JSON.parse(currentState) : defaultState,
      needBoot: true,
    } as DesktopState),
  actions: {
    add(appId: string) {
      this.runningApps = [
        ...this.runningApps.filter((el) => el != appId),
        appId,
      ];
    },

    remove(appId: string) {
      this.runningApps = this.runningApps.filter((el) => el != appId);
    },

    isRunning(appId: string) {
      return this.runningApps.includes(appId);
    },
  },
});
