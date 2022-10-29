<script lang="ts" setup>
import { useAppsState } from "@/stores/Win95AppsState";
import Win95DesktopIcon from "./Win95DesktopIcon.vue";
import { v4 as uuid4 } from "uuid";
import { useDesktopState, type DesktopPoint } from "@/stores/Win95DesktopState";
import { useDesktopSelectState } from "@/stores/Win95DesktopSelectState";
import { useDesktopSelectedIconsState } from "@/stores/Win95DesktopSelectedIconsState";

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
const desktop = useDesktopState();
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
};
</script>

<template>
  <Win95DesktopIcon
    :id="myId"
    :initialPosition="props.initIcon.position"
  ></Win95DesktopIcon>
</template>

<style scoped></style>
