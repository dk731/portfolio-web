<script lang="ts" setup>
import {
  useDesktopState,
  type DesktopPoint,
  type DesktopSize,
} from "@/stores/Win95DesktopState";
import { ref } from "vue";
import Win95DesktopIcon from "./Win95DesktopIcon.vue";
import Win95Window from "./Win95Window.vue";
import { v4 as uuid4 } from "uuid";
import { useDesktopApps } from "@/stores/Win95DesktopApps";
import { useDesktopSelectedIcons } from "@/stores/Win95DesktopSelectedState";

const props = defineProps<{
  icon: string;
  title: string;

  initIcon: { position: DesktopPoint };
  initWindow: { position: DesktopPoint; size: DesktopSize };

  onOpenClb?: () => void;
  onCloseClb?: () => void;
  onMinimizeClb?: () => void;
  onMaximizeClb?: () => void;
}>();

const desktopState = useDesktopState();
const desktopApps = useDesktopApps();
const desktopSelectedIcons = useDesktopSelectedIcons();

const isMinimized = ref<boolean>(false);
const myId = uuid4();

const isOppened = ref<boolean>(false);

function onOpenClb() {
  isOppened.value = true;
  isMinimized.value = false;
  setTimeout(() => (desktopSelectedIcons.selectedIcons = []), 10);

  desktopState.desktop.focusedApp = undefined;

  desktopState.moveFront(myId);

  desktopState.taskbar.activeApp = myId;
  if (!desktopState.taskbar.taskbarApps.includes(myId))
    desktopState.taskbar.taskbarApps.push(myId);
}
function onCloseClb() {
  isOppened.value = false;

  desktopState.taskbar.taskbarApps = desktopState.taskbar.taskbarApps.filter(
    (el) => el != myId
  );

  if (props.onCloseClb) props.onCloseClb();
}
function onMinimizeClb() {
  isMinimized.value = true;
  desktopState.taskbar.activeApp = undefined;

  if (props.onMinimizeClb) props.onMinimizeClb();
}
function onMaximizeClb() {
  if (props.onMaximizeClb) props.onMaximizeClb();
}

desktopApps.apps[myId] = {
  id: myId,
  icon: props.icon,
  title: props.title,
  onFocusClb: onOpenClb,
  onOpenClb: onOpenClb,
};
</script>

<template>
  <Win95DesktopIcon
    :id="myId"
    :icon="props.icon"
    :title="props.title"
    :initialPosition="props.initIcon.position"
    :on-open-clb="onOpenClb"
  ></Win95DesktopIcon>

  <Win95Window
    :is-visible="isOppened && !isMinimized"
    :id="myId"
    :icon="props.icon"
    :title="props.title"
    :initialPosition="props.initWindow.position"
    :initialSize="props.initWindow.size"
    :on-close-clb="onCloseClb"
    :on-minimize-clb="onMinimizeClb"
    :on-maximize-clb="onMaximizeClb"
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
