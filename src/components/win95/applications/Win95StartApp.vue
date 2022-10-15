<script setup lang="ts">
// const props = defineProps<{ onOpenClb: () => void }>();

import { useDesktopState } from "@/stores/Win95DesktopState";
import { onMounted } from "vue";
import { v4 as uuid4 } from "uuid";

const desktopState = useDesktopState();

function onOpenClb() {
  console.log("Weee", myAppConf);
  desktopState.taskbar.activeApp = myAppConf;
}

const myAppConf = {
  id: uuid4(),
  iconName: "images/win95/windows-4.png",
  taskbarTitle: "Start",
  onOpenClb: onOpenClb,
};

onMounted(() => {
  // Register 'start' app in taskbar
  desktopState.taskbar.taskbarApps.unshift(myAppConf);
});
</script>

<template>
  <div class="app-start-holder" @click="onOpenClb">
    <!--  -->
  </div>
</template>

<style></style>
