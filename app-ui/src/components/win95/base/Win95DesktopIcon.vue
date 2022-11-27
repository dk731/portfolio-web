<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

import {
  useDesktopState,
  type DesktopPoint,
  type DesktopSize,
} from "@/stores/Win95DesktopState";

import moment from "moment";

import { useDesktopSelectState } from "@/stores/Win95DesktopSelectState";
import { useDesktopSelectedIconsState } from "@/stores/Win95DesktopSelectedIconsState";
import { useAppsState } from "@/stores/Win95AppsState";

const props = defineProps<{
  id: string;
  initialPosition: DesktopPoint;
}>();

const apps = useAppsState();
const desktopSelectedIcons = useDesktopSelectedIconsState();
const desktopSelect = useDesktopSelectState();
const desktop = useDesktopState();

// Top, left point
const myPosition = ref<DesktopPoint>({ ...props.initialPosition });
// Selection trigger rect size
const selectRect: DesktopSize = { width: 30, height: 25 };

var hasDragged = false;

function onMouseUp(e: MouseEvent) {
  if (!hasDragged && !e.ctrlKey) {
    desktopSelectedIcons.icons = [props.id];
  }
}

var isDoubleClick = false;
function onMouseDown(e: MouseEvent) {
  hasDragged = false;

  if (!e.ctrlKey && !desktopSelectedIcons.includes(props.id))
    desktopSelectedIcons.icons = [props.id];
  else if (e.ctrlKey) desktopSelectedIcons.toggle(props.id);

  // Update current icon global state
  desktop.focusedApp = props.id;

  // Handle open logic
  if (isDoubleClick) {
    isDoubleClick = false;
    runOpenClb();
  }

  isDoubleClick = true;
  setTimeout(() => (isDoubleClick = false), 300);

  desktopSelect.selectMoving = true;

  // Stop propagation to prevent events form desktop
  e.stopPropagation();
}

const MIN_OPEN_DELAY = 500;
var lastOpenTime: number = 0;
function runOpenClb() {
  if (moment().valueOf() - lastOpenTime > MIN_OPEN_DELAY) {
    lastOpenTime = moment().valueOf();
    apps.apps[props.id].onOpenClb();
  }
}

function onKeyPress(e: KeyboardEvent) {
  if (e.key == "Enter" && desktopSelectedIcons.includes(props.id)) runOpenClb();
}

desktopSelect.$subscribe((mutation, state) => {
  if (desktopSelect.active) {
    const userRect = desktopSelect.selectRect;

    const userCompare = {
      x: Math.min(userRect.p1.x, userRect.p2.x),
      y: Math.min(userRect.p1.y, userRect.p2.y),
      width: Math.abs(userRect.p1.x - userRect.p2.x),
      height: Math.abs(userRect.p1.y - userRect.p2.y),
    };

    const myCompare = {
      x: myPosition.value.x + 16,
      y: myPosition.value.y + 5,
      ...selectRect,
    };

    if (
      userCompare.x < myCompare.x + myCompare.width &&
      userCompare.x + userCompare.width > myCompare.x &&
      userCompare.y < myCompare.y + myCompare.height &&
      userCompare.height + userCompare.y > myCompare.y
    )
      desktopSelectedIcons.insert(props.id);
    else desktopSelectedIcons.remove(props.id);
  } else if (
    desktopSelect.selectMoving &&
    desktopSelectedIcons.includes(props.id)
  ) {
    // Move current icon
    hasDragged =
      hasDragged ||
      desktopSelect.moveOffset.x != 0 ||
      desktopSelect.moveOffset.y != 0;
    myPosition.value.x += desktopSelect.moveOffset.x;
    myPosition.value.y += desktopSelect.moveOffset.y;
  }
});

onMounted(() => document.addEventListener("keypress", onKeyPress));
onUnmounted(() => document.removeEventListener("keypress", onKeyPress));
</script>

<template>
  <div
    class="win95-desktop-icon-holder"
    :style="{
      left: `${myPosition.x}px`,
      top: `${myPosition.y}px`,
    }"
    @mousedown="onMouseDown"
  >
    <div
      v-if="apps.apps[props.id].icon"
      class="desktop-icon-image"
      :style="{ backgroundImage: `url(${apps.apps[props.id].icon})` }"
      @mouseup="onMouseUp"
    >
      <div
        v-if="desktopSelectedIcons.includes(props.id)"
        :style="{
          WebkitMaskImage: `url(${apps.apps[props.id].icon})`,
          maskImage: `url(${apps.apps[props.id].icon})`,
        }"
        class="desktop-icon-overlay"
      ></div>
    </div>
    <div
      v-if="apps.apps[props.id].title"
      :class="`desktop-icon-title ${
        desktopSelectedIcons.includes(props.id) ? 'selected' : ''
      }`"
    >
      {{ apps.apps[props.id].title }}
      <div
        v-if="desktop.focusedApp == props.id"
        class="desktop-title-border"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.win95-desktop-icon-holder {
  position: absolute;

  display: flex;
  flex-direction: column;
  align-items: center;

  box-sizing: border-box;

  min-width: 68px;
}

/* Remove pointer events from all children */
.win95-desktop-icon-holder * {
  pointer-events: none;
}

.desktop-icon-image {
  position: relative;

  width: 32px;
  height: 32px;

  margin-bottom: 3px;

  background-size: 100%;
}

.desktop-icon-overlay {
  position: absolute;

  left: 0px;
  top: 0px;

  width: 100%;
  height: 100%;

  background: repeating-conic-gradient(#0000a8 0% 25%, transparent 0% 50%) 0px
    0px / 2px 2px;

  -webkit-mask-size: 100%;
  mask-size: 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
}

.desktop-icon-title {
  position: relative;
  left: 0;

  max-width: 68px;

  padding: 2px;

  box-sizing: border-box;

  font-size: 11px;
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
  color: #ffffff;
}

.desktop-icon-title.selected {
  background-color: #0000a8;
}

.desktop-title-border {
  position: absolute;

  left: 0px;
  top: 0px;

  width: 100%;
  height: 100%;

  border: 1px dotted #ff9191;
  box-sizing: border-box;
  mix-blend-mode: difference;

  padding: 1px;
}
</style>
