<script lang="ts" setup>
import { useAppsState } from "@/stores/Win95AppsState";
import { onMounted } from "vue";
import Win95Application from "../base/Win95DesktopApplication.vue";

const apps = useAppsState();

onMounted(() => {
  apps.apps["minesweeper-app"].onOpenClb();
});
</script>

<template>
  <Win95Application
    :id="`minesweeper-app`"
    :icon="`images/win95/minesweeper-mine.png`"
    :title="`Minesweeper`"
    :init-icon="{ position: { x: 10, y: 200 } }"
    :init-window="{
      position: { x: 50, y: 50 },
      size: { width: 157, height: 238 },
    }"
    :is-maximizable="false"
  >
    <template #toolbar>
      <div class="toolbar-btn">Game</div>
      <div class="toolbar-btn">Help</div>
    </template>
    <template #content>123</template>
  </Win95Application>
</template>

<style scoped>
.toolbar-btn {
  font-size: 13px;
  margin-right: 8px;
}
.toolbar-btn::first-letter {
  text-decoration: underline;
}
</style>
