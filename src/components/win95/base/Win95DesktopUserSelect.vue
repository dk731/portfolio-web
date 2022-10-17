<script setup lang="ts">
import { useDesktopState } from "@/stores/Win95DesktopState";
import Win95DottedBorder from "./Win95DottedBorder.vue";

const desktopState = useDesktopState();
</script>

<template>
  <template v-if="desktopState.desktop.selectActive">
    <Win95DottedBorder
      :width="1"
      :p1="desktopState.desktop.selectRect.p1"
      :p2="desktopState.desktop.selectRect.p2"
    ></Win95DottedBorder
  ></template>
</template>

<style scoped>
.win95-desktop-icon-holder {
  position: relative;
}

.icon-image {
  width: 32px;
  height: 32px;

  background-size: 100%;
}
</style>
