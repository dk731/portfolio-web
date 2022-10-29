<script lang="ts" setup>
import { useAppsState } from "@/stores/Win95AppsState";
import Win95DesktopIcon from "./Win95DesktopIcon.vue";
import { v4 as uuid4 } from "uuid";
import type { DesktopPoint } from "@/stores/Win95DesktopState";

const props = withDefaults(
  defineProps<{
    icon: string;
    title: string;

    initIcon: { position: DesktopPoint };
  }>(),
  {}
);

const apps = useAppsState();
const myId = uuid4();

function onOpenClb() {
  console.log("wee");
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
