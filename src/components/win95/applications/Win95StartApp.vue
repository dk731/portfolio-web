<script setup lang="ts">
// const props = defineProps<{ onOpenClb: () => void }>();

import { useDesktopApps } from "@/stores/Win95DesktopApps";
import { useDesktopState } from "@/stores/Win95DesktopState";

import { v4 as uuid4 } from "uuid";

const desktopState = useDesktopState();
const desktopApps = useDesktopApps();
const myId = uuid4();

function onOpenClb() {
  desktopState.taskbar.activeApp = myId;
}

desktopApps.apps[myId] = {
  id: myId,
  icon: "images/win95/windows-4.png",
  title: "Start",
  onFocusClb: onOpenClb,
};
desktopState.taskbar.taskbarApps.unshift(myId);
</script>

<template>
  <div class="app-start-holder" @click="onOpenClb">
    <!--  -->
  </div>
</template>

<style></style>
