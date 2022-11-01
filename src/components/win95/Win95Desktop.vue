<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";

import { useDesktopState } from "@/stores/Win95DesktopState";

import Win95Taskbar from "./base/Win95Taskbar.vue";
import Win95DesktopUserSelect from "./base/Win95DesktopUserSelect.vue";

import Win95StartApp from "./applications/Win95StartApp.vue";
import Win95AboutMeApp from "./applications/Win95AboutMeApp.vue";
import { useDesktopSelectState } from "@/stores/Win95DesktopSelectState";
import Win95DoomApp from "./applications/Win95DoomApp.vue";
import Win95TheInternetApp from "./applications/Win95TheInternetApp.vue";
import Win95MinesweeperApp from "./applications/Win95MinesweeperApp.vue";
import Win95DesktopRedirectIcon from "./base/Win95DesktopRedirectIcon.vue";
import Win95BootScreen from "./Win95BootScreen.vue";

const desktopSelect = useDesktopSelectState();
const desktop = useDesktopState();

const desktopRef = ref(null as any);

var prevPosition = { x: 0, y: 0 };
function onMouseMove(e: MouseEvent) {
  const el = desktopRef.value.getBoundingClientRect();
  const currentPosition = {
    x: e.clientX - el.left,
    y: e.clientY - el.top,
  };

  if (desktopSelect.active) desktopSelect.selectRect.p2 = currentPosition;

  if (desktopSelect.selectMoving)
    desktopSelect.moveOffset = {
      x: currentPosition.x - prevPosition.x,
      y: currentPosition.y - prevPosition.y,
    };

  prevPosition = currentPosition;
}

function onMouseDown(e: MouseEvent) {
  desktop.activeApp = undefined;
  const el = desktopRef.value.getBoundingClientRect();

  const newPosition = {
    x: e.clientX - el.left,
    y: e.clientY - el.top,
  };

  desktopSelect.selectRect.p1 = newPosition;
  desktopSelect.selectRect.p2 = newPosition;
  desktopSelect.active = true;
}

function onMouseUp(e: MouseEvent) {
  desktopSelect.active = false;

  desktopSelect.selectMoving = false;
  desktopSelect.moveOffset = { x: 0, y: 0 };
}

function onWindowResize() {
  if (!desktopRef.value) return;

  desktop.size = {
    width: desktopRef.value.clientWidth,
    height: desktopRef.value.clientHeight,
  };
}

onMounted(() => {
  document.addEventListener("mouseup", onMouseUp);
  window.addEventListener("resize", onWindowResize);

  onWindowResize();
});
onUnmounted(() => {
  document.removeEventListener("mouseup", onMouseUp);
  window.removeEventListener("resize", onWindowResize);
});
</script>

<template>
  <div class="win95-holder" :style="{ cursor: `url(${desktop.cursor}), auto` }">
    <template v-if="desktop.storageState.booted">
      <div
        class="win95-desktop-holder"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        ref="desktopRef"
      >
        <Win95StartApp></Win95StartApp>

        <Win95AboutMeApp></Win95AboutMeApp>
        <Win95DoomApp></Win95DoomApp>
        <Win95TheInternetApp></Win95TheInternetApp>
        <Win95MinesweeperApp></Win95MinesweeperApp>
        <Win95DesktopRedirectIcon
          :icon="`images/GitHub-Mark-32px.png`"
          :title="`Github`"
          :url="`https://github.com/dk731`"
          :init-icon="{ position: { x: 10, y: 260 } }"
        ></Win95DesktopRedirectIcon>
        <Win95DesktopRedirectIcon
          :icon="`images/win95/camera-0.png`"
          :title="`Blog`"
          :url="`https://qwe.me/blog`"
          :init-icon="{ position: { x: 10, y: 320 } }"
        ></Win95DesktopRedirectIcon>

        <Win95DesktopUserSelect />
      </div>

      <Win95Taskbar />
    </template>
    <template v-else>
      <Win95BootScreen></Win95BootScreen>
    </template>
  </div>
</template>

<style>
@font-face {
  font-family: win95-non-bold;
  src: url("/fonts/win95/MS Sans Serif 8pt.ttf");
}

@font-face {
  font-family: win95-bold;
  src: url("/fonts/win95/MS Sans Serif 8pt bold.ttf");
}

.win95-holder {
  position: relative;
  /* width: 800px1;
  height: 600px; */
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  background-color: #57a8a8;

  font-family: win95-non-bold;
  font-smooth: never;
  -webkit-font-smoothing: none;

  user-select: none;
  overflow: hidden;
}

.win95-desktop-holder {
  position: relative;

  width: 100%;
  height: 100%;
}

.win95-button {
  box-shadow: inset 1px 1px #ffffff, 0.5px 0.5px 0 0.5px #000000,
    1px 1px #87888f, inset -1px -1px #85898d;
  background: #c0c7c8;
}

.win95-button:active {
  box-shadow: 0.5px 0.5px 0 0.5px white, inset 1px 1px black,
    inset -1px -1px #c0c7c8, inset 2px 2px #85898d;
}

.v-spacer {
  flex-grow: 1;
}
</style>
