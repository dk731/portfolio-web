import { defineStore } from "pinia";

type TaskMeta = {
  id: string;
  iconName?: string;
  taskbarTitle?: string;
  onOpenClb: () => void;
};

export type DesktopPoint = { x: number; y: number };

type DesktopState = {
  taskbar: { activeApp?: TaskMeta; taskbarApps: TaskMeta[] };
  desktop: {
    selectActive: boolean;
    selectRect: { p1: DesktopPoint; p2: DesktopPoint };
    selectWidth: number; // Number of border layers for select box
    focusedApp?: string;
  };
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
      },
    } as DesktopState),
});