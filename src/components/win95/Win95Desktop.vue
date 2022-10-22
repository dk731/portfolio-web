<script lang="ts" setup>
import { onMounted, onUnmounted, ref, type VNode, type VNodeRef } from "vue";
import Win95AppIcon from "./base/Win95DesktopIcon.vue";

import { useDesktopState } from "@/stores/Win95DesktopState";
import Win95StartApp from "./applications/Win95StartApp.vue";
import Win95Taskbar from "./base/Win95Taskbar.vue";
import Win95DesktopUserSelect from "./base/Win95DesktopUserSelect.vue";

const desktopState = useDesktopState();
const desktopRef = ref(null as any);

function onMouseMove(e: MouseEvent) {
  const el = desktopRef.value.getBoundingClientRect();
  if (desktopState.desktop.selectActive)
    desktopState.desktop.selectRect.p2 = {
      x: e.clientX - el.left,
      y: e.clientY - el.top,
    };

  if (desktopState.desktop.selectMoving)
    desktopState.desktop.moveOffset = { x: e.movementX, y: e.movementY };
}

function onMouseDown(e: MouseEvent) {
  console.log("Desktop mouse down");
  const el = desktopRef.value.getBoundingClientRect();

  const newPosition = {
    x: e.clientX - el.left,
    y: e.clientY - el.top,
  };

  desktopState.desktop.selectRect.p1 = newPosition;
  desktopState.desktop.selectRect.p2 = newPosition;
  desktopState.desktop.selectActive = true;
}

function onMouseUp(e: MouseEvent) {
  desktopState.desktop.selectActive = false;

  desktopState.desktop.selectMoving = false;
  desktopState.desktop.moveOffset = { x: 0, y: 0 };
}

onMounted(() => document.addEventListener("mouseup", onMouseUp));
onUnmounted(() => document.removeEventListener("mouseup", onMouseUp));

function onTestOpen() {
  console.log("Oppened Test!");
}
</script>

<template>
  <div class="win95-holder">
    <div
      class="desktop-holder"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      ref="desktopRef"
    >
      <Win95StartApp></Win95StartApp>

      <Win95AppIcon
        :icon="`images/win95/computer_explorer-4.png`"
        :title="`About Me`"
        :onOpenClb="onTestOpen"
        :initialPosition="{ x: 50, y: 50 }"
      ></Win95AppIcon>
      <Win95AppIcon
        :icon="`images/win95/computer_explorer-3.png`"
        :title="`AONANSF`"
        :onOpenClb="onTestOpen"
        :initialPosition="{ x: 150, y: 150 }"
      ></Win95AppIcon>
      <Win95AppIcon
        :icon="`images/win95/computer_explorer-2.png`"
        :title="`QWEQWE`"
        :onOpenClb="onTestOpen"
        :initialPosition="{ x: 100, y: 100 }"
      ></Win95AppIcon>

      <Win95DesktopUserSelect />
    </div>

    <Win95Taskbar />
  </div>
</template>

<style scoped>
@font-face {
  font-family: win95-non-bold;
  src: url("fonts/win95/MS Sans Serif 8pt.ttf");
}

@font-face {
  font-family: win95-bold;
  src: url("fonts/win95/MS Sans Serif 8pt bold.ttf");
}

.win95-holder {
  position: relative;
  width: 800px1;
  height: 600px;
  /* width: 100%;
  height: 100%; */

  display: flex;
  flex-direction: column;

  background-color: #57a8a8;

  font-family: win95-non-bold;
  cursor: url(/cursors/arrow.cur), auto;
  font-smooth: never;
  -webkit-font-smoothing: none;

  user-select: none;
}

.desktop-holder {
  position: relative;

  width: 100%;
  height: 100%;
}
</style>
