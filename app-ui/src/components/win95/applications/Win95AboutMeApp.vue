<script lang="ts" setup>
import { useAppsState } from "@/stores/Win95AppsState";
import { useDesktopState } from "@/stores/Win95DesktopState";
import { onMounted } from "vue";
import Win95Application from "../base/Win95DesktopApplication.vue";

const apps = useAppsState();
const desktop = useDesktopState();

const myId = "about-me-app";
var firstTimeFocus = true;

function onOpenClb() {
  console.log("Oppened About Me");

  apps.apps[myId].onMinimizeClb();
}

function onFocusClb() {
  if (!firstTimeFocus) return;

  apps.apps[myId].windowPosition = { x: 20, y: 20 };
  apps.apps[myId].windowSize = {
    width: desktop.size.width - 40,
    height: desktop.size.height - 40,
  };
  firstTimeFocus = false;
}

onMounted(() => {
  setTimeout(apps.apps[myId].onOpenClb, 800);
});
</script>

<template>
  <Win95Application
    :id="myId"
    :icon="`images/win95/computer_explorer-4.png`"
    :title="`About Me`"
    :init-icon="{ position: { x: 20, y: 20 } }"
    :init-window="{
      position: { x: 0, y: 0 },
      size: { width: 0, height: 0 },
    }"
    @open-clb="onOpenClb"
    @focus-clb="onFocusClb"
  >
    <template #content>123</template>
  </Win95Application>
</template>

<style scoped></style>
