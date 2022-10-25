<script lang="ts" setup>
import {
  useDesktopState,
  type DesktopPoint,
  type DesktopSize,
} from "@/stores/Win95DesktopState";

import Win95DesktopIcon from "./Win95DesktopIcon.vue";
import Win95Window from "./Win95Window.vue";
import { v4 as uuid4 } from "uuid";
import { useAppsState } from "@/stores/Win95AppsState";
import { useDesktopSelectedIconsState } from "@/stores/Win95DesktopSelectedIconsState";
import { useWindowsState } from "@/stores/Win95WindowsState";
import { useTaskbarState } from "@/stores/Win95TaskbarState";

const props = defineProps<{
  id?: string;
  icon: string;
  title: string;

  initIcon: { position: DesktopPoint };
  initWindow: { position: DesktopPoint; size: DesktopSize };

  onOpenClb?: () => void;
  onCloseClb?: () => void;
  onFocusClb?: () => void;
  onMinimizeClb?: () => void;
  onMaximizeClb?: () => void;
}>();

const myId = props.id ? props.id : uuid4();

const taskbar = useTaskbarState();
const windows = useWindowsState();
const desktop = useDesktopState();
const apps = useAppsState();
const desktopSelectedIcons = useDesktopSelectedIconsState();

function onOpenClb() {
  windows.add(myId);
  taskbar.add(myId);
  desktop.activeApp = myId;

  // Wait small amout of time to give some time to all selected
  // apps to open and then clear selected icons array
  setTimeout(() => (desktopSelectedIcons.icons = []), 50);
}
function onCloseClb() {
  windows.remove(myId);
  taskbar.remove(myId);
  desktop.focusedApp = myId;

  taskbar.apps = taskbar.apps.filter((el) => el != myId);

  if (props.onCloseClb) props.onCloseClb();
}
function onMinimizeClb() {
  windows.remove(myId);
  if (desktop.activeApp == myId) desktop.activeApp = undefined;

  if (props.onMinimizeClb) props.onMinimizeClb();
}
function onMaximizeClb() {
  if (props.onMaximizeClb) props.onMaximizeClb();
}
function onFocusClb() {
  desktop.activeApp = myId;
  windows.moveFront(myId);
  desktopSelectedIcons.icons = [];

  if (props.onFocusClb) props.onFocusClb();
}

apps.apps[myId] = {
  id: myId,
  title: props.title,
  icon: props.icon,
  onOpenClb: onOpenClb,
  onCloseClb: onCloseClb,
  onFocusClb: onFocusClb,
  onMinimizeClb: onMinimizeClb,
  onMaximizeClb: onMaximizeClb,
};
</script>

<template>
  <Win95DesktopIcon
    :id="myId"
    :initialPosition="props.initIcon.position"
  ></Win95DesktopIcon>

  <Win95Window
    :id="myId"
    :initialPosition="props.initWindow.position"
    :initialSize="props.initWindow.size"
  >
    <template #content>
      <slot name="content"></slot>
    </template>
    <template #toolbar>
      <slot name="toolbar"></slot>
    </template>
    <template #bottom-bar>
      <slot name="bottom-bar"></slot>
    </template>
  </Win95Window>
</template>

<style scoped></style>
