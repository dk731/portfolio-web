<script lang="ts" setup>
import Win95Application from "../base/Win95DesktopApplication.vue";
</script>

<template>
  <Win95Application
    :id="`the-internet-app`"
    :icon="`images/win95/the-internet.png`"
    :title="`The Internet`"
    :init-icon="{ position: { x: 10, y: 140 } }"
    :init-window="{
      position: { x: 50, y: 50 },
      size: { width: 300, height: 150 },
    }"
  >
    <template #content>123</template>
  </Win95Application>
</template>

<style scoped></style>
