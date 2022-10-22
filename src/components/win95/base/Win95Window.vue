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

const myPosition = ref<DesktopPoint>({ ...props.initialPosition });
const mySize = ref<DesktopSize>({ ...props.initialSize });
const myZindex = ref<number>(0);

function onMouseMove(e: MouseEvent) {
  // e.stopPropagation();
}
function onMouseDown(e: MouseEvent) {
  // e.stopPropagation();
}
function onMouseUp(e: MouseEvent) {
  // e.stopPropagation();
}

function onBorderEnter(e: MouseEvent) {
  console.log((e.target as any).classList);
}
function onBorderLeave(e: MouseEvent) {}

desktopState.$subscribe(() => {
  myZindex.value = desktopState.desktop.oppenedWindows.indexOf(myId) * 10 + 10;
});

desktopState.desktop.oppenedWindows.push(myId);
</script>

<template>
  <div
    class="win95-window-holder"
    :style="{
      left: `${myPosition.x}px`,
      top: `${myPosition.y}px`,
      width: `${mySize.width}px`,
      height: `${mySize.height}px`,
      zIndex: myZindex,
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

        <div
          class="window-resize-corner-holder"
          :style="{
            width: slots['bottom-bar'] == undefined ? '100%' : 'auto',
            flexGrow: slots['bottom-bar'] == undefined ? 0 : 1,
          }"
        >
          <div class="widnow-resize-corner"></div>
        </div>
      </div>
    </div>

    <div
      class="window-resize-border side left"
      :style="{ zIndex: myZindex + 1 }"
      @mouseenter="onBorderEnter"
      @mouseleave="onBorderLeave"
    ></div>
    <div
      class="window-resize-border side right"
      :style="{ zIndex: myZindex + 1 }"
      @mouseenter="onBorderEnter"
      @mouseleave="onBorderLeave"
    ></div>
    <div
      class="window-resize-border bottop top"
      :style="{ zIndex: myZindex + 1 }"
      @mouseenter="onBorderEnter"
      @mouseleave="onBorderLeave"
    ></div>
    <div
      class="window-resize-border bottop bottom"
      :style="{ zIndex: myZindex + 1 }"
      @mouseenter="onBorderEnter"
      @mouseleave="onBorderLeave"
    ></div>
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
.window-resize-corner-holder {
  position: relative;

  height: 100%;
}

.widnow-resize-corner {
  position: absolute;

  right: 0px;
  bottom: 0px;

  width: 12px;
  height: 12px;

  background-image: url(images/win95/corner-scale.png);
}

.window-resize-border {
  position: absolute;
  background-color: purple;

  pointer-events: all;
  z-index: 1000;
}

.window-resize-border.side {
  top: 0px;

  height: 100%;
  width: 4px;
}

.window-resize-border.bottop {
  left: 0px;

  height: 4px;
  width: 100%;
}

.window-resize-border.side.left {
  left: 0px;
}

.window-resize-border.side.right {
  right: 0px;
}

.window-resize-border.bottop.top {
  top: 0px;
}

.window-resize-border.bottop.bottom {
  bottom: 0px;
}
</style>
