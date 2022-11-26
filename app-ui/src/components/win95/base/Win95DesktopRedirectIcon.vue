<script lang="ts" setup>
import { useAppsState } from "@/stores/Win95AppsState";
import Win95DesktopIcon from "./Win95DesktopIcon.vue";
import { v4 as uuid4 } from "uuid";

import { useDesktopSelectedIconsState } from "@/stores/Win95DesktopSelectedIconsState";
import type { DesktopPoint } from "@/stores/Win95DesktopState";

const props = withDefaults(
  defineProps<{
    icon: string;
    title: string;
    url: string;

    initIcon: { position: DesktopPoint };
  }>(),
  {}
);

const apps = useAppsState();
const myId = uuid4();

const desktopSelectIcon = useDesktopSelectedIconsState();

function onOpenClb() {
  desktopSelectIcon.remove(myId);
  window.open(props.url, "_blank");
}

apps.apps[myId] = {
  id: myId,
  title: props.title,
  icon: props.icon,
  onOpenClb: onOpenClb,
  onCloseClb: () => {},
  onFocusClb: () => {},
  onMinimizeClb: () => {},
  onMaximizeClb: () => {},
  windowPosition: { x: 0, y: 0 },
  windowSize: { width: 0, height: 0 },
  isToolbarActive: false,
};
</script>

<template>
  <Win95DesktopIcon
    :id="myId"
    :initialPosition="props.initIcon.position"
  ></Win95DesktopIcon>
</template>

<style scoped></style>
