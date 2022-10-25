import { defineStore } from "pinia";

export type AppMeta = {
  id: string; // Id should be unique for each application instance
  title?: string; // Display application title
  icon?: string; // Display application icon path
  onOpenClb: () => void;
  onCloseClb: () => void;
  onFocusClb: () => void;
  onMinimizeClb: () => void;
  onMaximizeClb: () => void;
};

// State where all apps should be registered for all functions to properly work
// ( such as taskbar, widnow and others )
export const useAppsState = defineStore("win95-apps", {
  state: () => ({
    apps: {} as { [id: string]: AppMeta },
  }),
});
