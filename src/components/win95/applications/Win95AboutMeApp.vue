<script lang="ts" setup>
import Win95Application from "../base/Win95Application.vue";
</script>

<template>
  <Win95Application
    icon="images/win95/computer_explorer-4.png"
    title="About Me"
    :init-icon="{ position: { x: 10, y: 10 } }"
    :init-window="{
      position: { x: 50, y: 50 },
      size: { width: 300, height: 150 },
    }"
  ></Win95Application>
</template>

<style scoped></style>
