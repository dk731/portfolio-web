<script setup lang="ts">
import {
  useDesktopState,
  type DesktopPoint,
  type DesktopSize,
} from "@/stores/Win95DesktopState";
import { ref, useSlots } from "vue";

import { v4 as uuid4 } from "uuid";

const props = defineProps<{
  icon: string;
  title: string;
  initialPosition: DesktopPoint;
  initialSize: DesktopSize;
}>();

const slots = useSlots();
const desktopState = useDesktopState();
const myId = uuid4();

desktopState.desktop.oppenedWindows.push(myId);

const myPosition = ref<DesktopPoint>({ ...props.initialPosition });
const mySize = ref<DesktopSize>({ ...props.initialSize });

function onMouseMove(e: MouseEvent) {
  // e.stopPropagation();
}
function onMouseDown(e: MouseEvent) {
  // e.stopPropagation();
}
function onMouseUp(e: MouseEvent) {
  // e.stopPropagation();
}
</script>

<template>
  <div
    class="win95-window-holder"
    :style="{
      left: `${myPosition.x}px`,
      top: `${myPosition.y}px`,
      width: `${mySize.width}px`,
      height: `${mySize.height}px`,
      zIndex: desktopState.desktop.oppenedWindows.indexOf(myId),
    }"
    @mousemove="onMouseMove"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
  >
    <div class="window-upper-bar">
      <div
        class="window-icon"
        :style="{ backgroundImage: `url(${props.icon})` }"
      />
      <div class="window-name">{{ props.title }}</div>
      <div class="v-spacer"></div>
      <div class="window-upper-buttons-holder"></div>
    </div>
    <div class="window-content-holder">
      <div class="window-toolbar-holder">
        <slot name="toolbar"></slot>
      </div>
      <div class="window-content">
        <slot name="content"></slot>
      </div>
      <div class="window-bottom-bar">
        <slot name="bottom-bar"></slot>

        <div class="widnow-resize-corner"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.win95-window-holder {
  position: absolute;

  display: flex;
  flex-direction: column;

  padding: 4px;
  box-sizing: border-box;
  background: #c0c7c8;
  box-shadow: inset 0px 0px 0px 1px #c0c7c8, inset -1px -1px 0px 1px #87888f,
    inset 1px 1px 0px 1px #ffffff;
}

.win95-window-holder::after {
  content: "";
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  border: solid 1px #000000;
  border-left: none;
  border-top: none;
}

.window-upper-bar {
  width: 100%;
  height: 18px;

  display: flex;
  flex-direction: row;
  align-items: center;

  background-color: #0000a8;

  box-sizing: border-box;

  padding: 1px;
  padding-left: 3px;
  padding-right: 3px;
}

.window-icon {
  width: 16px;
  height: 16px;
  background-size: 100%;

  margin-right: 3px;
}

.window-name {
  font-family: win95-bold;
  color: #ffffff;
  font-size: 11px;

  text-align: center;

  text-overflow: ellipsis;
  overflow: hidden;

  transform: translate(0px, -2px);
}

.window-content-holder {
  width: 100%;
  flex-grow: 1;

  display: flex;
  flex-direction: column;
}

.window-toolbar-holder {
  width: 100%;
  height: 20px;

  background: red;
}

.window-content {
  position: relative;
  width: 100%;
  flex-grow: 1;

  background: green;
  margin-bottom: 2px;
}

.window-bottom-bar {
  display: flex;
  flex-direction: row;
  align-items: center;

  width: 100%;
  height: 16px;

  background: aqua;
}

.bottom-content-holder {
  width: 100%;

  display: flex;
  flex-direction: row;
  align-items: center;
}

.widnow-resize-corner {
  width: 12px;
  height: 100%;
  background-color: red;
}
</style>
