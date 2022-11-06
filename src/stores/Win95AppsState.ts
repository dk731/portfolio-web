import { defineStore } from "pinia";
import type { DesktopPoint, DesktopSize } from "./Win95DesktopState";

export type AppMeta = {
  id: string; // Id should be unique for each application instance
  title?: string; // Display application title
  icon?: string; // Display application icon path
  onOpenClb: () => void;
  onCloseClb: () => void;
  onFocusClb: () => void;
  onMinimizeClb: () => void;
  onMaximizeClb: () => void;
  windowSize: DesktopSize;
  windowPosition: DesktopPoint;
  isToolbarActive: boolean;
};

// State where all apps should be registered for all functions to properly work
// ( such as taskbar, widnow and others )
export const useAppsState = defineStore("win95-apps", {
  state: () => ({
    apps: {} as { [id: string]: AppMeta },
  }),
});
