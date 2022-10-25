<script lang="ts" setup>
import { DosPlayer } from "js-dos";

import Win95Application from "../base/Win95DesktopApplication.vue";
import { onMounted, ref } from "vue";

const canvasRef = ref(null as any);

onMounted(() => {
  console.log(DosPlayer);
  //   const player = DosPlayer(canvasRef);
  console.log(canvasRef);
});
</script>

<template>
  <Win95Application
    icon="images/Doom-1-icon.png"
    title="DOOM"
    :init-icon="{ position: { x: 10, y: 80 } }"
    :init-window="{
      position: { x: 5, y: 5 },
      size: { width: 688, height: 400 },
    }"
  >
    <template #content>
      <iframe
        width="680"
        height="400"
        frameborder="0"
        src="https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fdoom.jsdos?anonymous=1"
        allowfullscreen
      >
      </iframe>
    </template>
  </Win95Application>
</template>

<style scoped>
.dos-doom-holder {
  width: 100%;
  height: 100%;
}
</style>
