import { defineStore } from "pinia";

type TaskMeta = {
  id: string;
  iconName?: string;
  taskbarTitle?: string;
  onOpenClb: () => void;
};

export type DesktopPoint = { x: number; y: number };

/*
To create working app with desktop icon, its meta should be
registered in desktop.apps state, so that different components
shuch as Win95DesktopSelect could work properly
 */
type DesktopState = {
  taskbar: { activeApp?: TaskMeta; taskbarApps: TaskMeta[] };
  desktop: {
    apps: TaskMeta[];
    selectActive: boolean;
    selectRect: { p1: DesktopPoint; p2: DesktopPoint };
    selectWidth: number; // Number of border layers for select box
    focusedApp?: TaskMeta;
  };
};

export const useDesktopState = defineStore("desktop-store", {
  state: () =>
    ({
      taskbar: {
        taskbarApps: [],
      },
      desktop: {
        apps: [],
        selectActive: false,
        selectRect: { p1: { x: 0, y: 0 }, p2: { x: 0, y: 0 } },
        selectWidth: 0,
      },
    } as DesktopState),
});
