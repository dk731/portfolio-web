<script lang="ts" setup>
import { ref, type VNodeRef } from "vue";
import Win95AppIcon from "./base/Win95DesktopIcon.vue";
import moment from "moment";

import { useDesktopState } from "@/stores/Win95DesktopState";
import Win95StartApp from "./applications/Win95StartApp.vue";
import Win95Taskbar from "./base/Win95Taskbar.vue";
import Win95DesktopSelect from "./base/Win95DottedBorder.vue";
import Win95DottedBorder from "./base/Win95DottedBorder.vue";

const desktopState = useDesktopState();

function onMouseDown(e: MouseEvent) {
  console.log(e);
}

function onMouseUp(e: MouseEvent) {
  console.log(e);
}
</script>

<template>
  <div class="win95-holder">
    <div class="desktop-holder" @mousedown="onMouseDown" @mouseup="onMouseUp">
      <Win95StartApp></Win95StartApp>

      <Win95AppIcon icon="images/win95/computer_explorer-4.png"></Win95AppIcon>
      <Win95AppIcon icon="images/win95/computer_explorer-3.png"></Win95AppIcon>
      <Win95AppIcon icon="images/win95/computer_explorer-5.png"></Win95AppIcon>
    </div>

    <Win95Taskbar> </Win95Taskbar>
    <Win95DottedBorder
      :width="4"
      :p1="{ x: 0, y: 0 }"
      :p2="{ x: 100, y: 100 }"
    ></Win95DottedBorder>
    <!-- <div class="user-select-rect"></div> -->
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
  width: 800px;
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

.user-select-rect {
  position: absolute;

  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
}
</style>
