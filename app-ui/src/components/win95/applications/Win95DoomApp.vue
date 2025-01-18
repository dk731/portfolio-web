<script lang="ts" setup>
import Win95Application from "../base/Win95DesktopApplication.vue";
import { ref, watchEffect } from "vue";

const dosDoomApp = ref<HTMLElement | null>(null);

watchEffect(() => {
  if (!dosDoomApp.value) return;

  (window as any).Dos(dosDoomApp.value, {
    url: "https://cdn.dos.zone/custom/dos/doom.jsdos",
    workerThread: true,
    theme: "dark",
  });
});
</script>

<template>
  <Win95Application
    :id="`dos-doom-app`"
    :icon="`images/Doom-1-icon.png`"
    :title="`DOOM`"
    :init-icon="{ position: { x: 160, y: 200 } }"
    :init-window="{
      position: { x: 5, y: 5 },
      size: { width: 688, height: 428 },
    }"
    :is-resizable="false"
  >
    <template #content>
      <div ref="dosDoomApp" class="dos-doom-holder">
        Was not able to load doom
      </div>
    </template>
  </Win95Application>
</template>

<style scoped>
.dos-doom-holder {
  margin-top: 2px;
  position: relative;
  left: 0px;
  top: 0px;

  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #000000;
}

.dos-doom {
  border: none;
  margin: 0;
  width: 100%;
  height: 100%;
}
</style>
