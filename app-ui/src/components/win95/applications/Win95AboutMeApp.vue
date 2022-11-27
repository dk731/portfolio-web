<script lang="ts" setup>
import { useAppsState } from "@/stores/Win95AppsState";
import { onMounted } from "vue";
import Win95Application from "../base/Win95DesktopApplication.vue";

const apps = useAppsState();

onMounted(() => {
  apps.apps["about-me-app"].onOpenClb();
});
</script>

<template>
  <Win95Application
    :id="`about-me-app`"
    :icon="`images/win95/computer_explorer-4.png`"
    :title="`About Me`"
    :init-icon="{ position: { x: 10, y: 20 } }"
    :init-window="{
      position: { x: 50, y: 50 },
      size: { width: 300, height: 150 },
    }"
  >
    <template #content>123</template>
  </Win95Application>
</template>

<style scoped></style>
