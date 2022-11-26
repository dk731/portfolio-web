<script setup lang="ts">
import { useDesktopSelectState } from "@/stores/Win95DesktopSelectState";
import Win95DottedBorder from "./Win95DottedBorder.vue";

const destopSelect = useDesktopSelectState();
</script>

<template>
  <template v-if="destopSelect.active">
    <Win95DottedBorder
      :width="1"
      :p1="destopSelect.selectRect.p1"
      :p2="destopSelect.selectRect.p2"
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
