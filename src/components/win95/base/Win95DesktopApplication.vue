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
import { useSlots } from "vue";

const props = withDefaults(
  defineProps<{
    id?: string;
    icon: string;
    title: string;

    initIcon: { position: DesktopPoint };
    initWindow: { position: DesktopPoint; size: DesktopSize }; // Size of content

    isResizable?: boolean;
    isDragabble?: boolean;
    isMaximizable?: boolean;

    onOpenClb?: () => void;
    onCloseClb?: () => void;
    onFocusClb?: () => void;
    onMinimizeClb?: () => void;
    onMaximizeClb?: () => void;
  }>(),
  {
    id: uuid4(),

    isResizable: true,
    isDragabble: true,
    isMaximizable: true,

    onOpenClb: () => {},
    onCloseClb: () => {},
    onFocusClb: () => {},
    onMinimizeClb: () => {},
    onMaximizeClb: () => {},
  }
);

const myId = props.id ? props.id : uuid4();

const taskbar = useTaskbarState();
const windows = useWindowsState();
const desktop = useDesktopState();
const apps = useAppsState();
const desktopSelectedIcons = useDesktopSelectedIconsState();
const slots = useSlots();

function onOpenClb() {
  windows.add(myId);
  taskbar.add(myId);
  desktop.add(myId);
  desktop.activeApp = myId;

  // Wait small amout of time to give some time to all selected
  // apps to open and then clear selected icons array
  setTimeout(() => (desktopSelectedIcons.icons = []), 50);
  props.onOpenClb();
}
function onCloseClb() {
  windows.remove(myId);
  taskbar.remove(myId);
  desktop.remove(myId);

  desktop.focusedApp = myId;

  taskbar.apps = taskbar.apps.filter((el) => el != myId);

  props.onCloseClb();
}
function onMinimizeClb() {
  windows.remove(myId);
  if (desktop.activeApp == myId) desktop.activeApp = undefined;

  props.onMinimizeClb();
}
function onMaximizeClb() {
  props.onMaximizeClb();
}
function onFocusClb() {
  desktop.activeApp = myId;
  windows.moveFront(myId);
  desktopSelectedIcons.icons = [];

  props.onFocusClb();
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
  windowPosition: props.initWindow.position,
  windowSize: props.initWindow.size,
};
</script>

<template>
  <Win95DesktopIcon
    :id="myId"
    :initialPosition="props.initIcon.position"
  ></Win95DesktopIcon>

  <Win95Window
    :id="myId"
    :is-resizable="props.isResizable"
    :is-maximizable="props.isMaximizable"
    :is-draggable="props.isDragabble"
  >
    <template v-if="slots['toolbar']" #toolbar>
      <slot name="toolbar"></slot>
    </template>
    <template v-if="slots['content']" #content>
      <slot name="content"></slot>
    </template>
    <template v-if="slots['bottom-bar']" #bottom-bar>
      <slot name="bottom-bar"></slot>
    </template>
    <template #bottom-bar-corner>
      <slot name="bottom-bar-corner"></slot>
    </template>
  </Win95Window>
</template>

<style scoped></style>
