import { defineStore } from "pinia";
import type { DesktopPoint } from "./Win95DesktopState";

type DesktopSelectState = {
  active: boolean;
  selectRect: { p1: DesktopPoint; p2: DesktopPoint };
  selectWidth: number; // Number of border layers for select box
  selectMoving: boolean;
  moveOffset: DesktopPoint;
};

export const useDesktopSelectState = defineStore("win95-desktop-select", {
  state: () =>
    ({
      active: false,
      selectRect: { p1: { x: 0, y: 0 }, p2: { x: 0, y: 0 } },
      selectWidth: 1,
      selectMoving: false,
      moveOffset: { x: 0, y: 0 },
    } as DesktopSelectState),
  actions: {},
});
