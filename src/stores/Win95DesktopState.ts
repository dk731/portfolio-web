import { defineStore } from "pinia";

export type DesktopPoint = { x: number; y: number };
export type DesktopSize = { width: number; height: number };

export enum Win95Cursor {
  default = "/cursors/arrow.cur",
  sideResize = "/cursors/Cursor_8.cur",
  topBotResize = "/cursors/Cursor_9.cur",
  cornerResizePos = "/cursors/Cursor_7.cur",
  cornerResizeNeg = "/cursors/Cursor_6.cur",
}

export enum Win95Font {
  default = "win95-non-bold",
  bold = "win95-bold",
}

type DesktopState = {
  taskbar: { activeApp?: string; taskbarApps: string[] };
  desktop: {
    selectActive: boolean;
    selectRect: { p1: DesktopPoint; p2: DesktopPoint };
    selectWidth: number; // Number of border layers for select box
    focusedApp?: string;
    selectMoving: boolean;
    moveOffset: DesktopPoint;
    oppenedWindows: string[];
    size: DesktopSize;
  };
  activeCursor: Win95Cursor;
};

export const useDesktopState = defineStore("desktop-store", {
  state: () =>
    ({
      taskbar: {
        taskbarApps: [],
      },
      desktop: {
        selectActive: false,
        selectRect: { p1: { x: 0, y: 0 }, p2: { x: 0, y: 0 } },
        selectWidth: 0,
        selectMoving: false,
        moveOffset: { x: 0, y: 0 },
        oppenedWindows: [],
        size: { width: 0, height: 0 },
      },
      activeCursor: Win95Cursor.default,
    } as DesktopState),
  actions: {
    moveFront(app: string) {
      this.desktop.oppenedWindows = [
        ...this.desktop.oppenedWindows.filter((el) => el != app),
        app,
      ];
    },
  },
});
