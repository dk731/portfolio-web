<script setup lang="ts">
import { useAppsState } from "@/stores/Win95AppsState";
import { useDesktopState } from "@/stores/Win95DesktopState";
import { useTaskbarState } from "@/stores/Win95TaskbarState";

const desktop = useDesktopState();
const apps = useAppsState();
const taskbar = useTaskbarState();
const myId = "start-app";

function onOpenClb() {
  desktop.activeApp = myId;
}

// Leave some callbacks empty as 'Start' is not interested in them
apps.apps[myId] = {
  id: myId,
  title: "Start",
  icon: "images/win95/windows-4.png",
  onOpenClb: () => onOpenClb,
  onCloseClb: () => {},
  onFocusClb: () => {},
  onMinimizeClb: () => {},
  onMaximizeClb: () => {},
};
taskbar.apps.unshift(myId);
</script>

<template>
  <div class="app-start-holder" @click="onOpenClb">
    <!--  -->
  </div>
</template>

<style></style>
