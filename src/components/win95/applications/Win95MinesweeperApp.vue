<script lang="ts" setup>
import Win95Application from "../base/Win95DesktopApplication.vue";
</script>

<template>
  <Win95Application
    :id="`minesweeper-app`"
    :icon="`images/win95/minesweeper-mine.png`"
    :title="`Minesweeper`"
    :init-icon="{ position: { x: 10, y: 200 } }"
    :init-window="{
      position: { x: 50, y: 50 },
      size: { width: 300, height: 150 },
    }"
  >
    <template #content>123</template>
  </Win95Application>
</template>

<style scoped></style>
