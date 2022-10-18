<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

import { useDesktopState } from "@/stores/Win95DesktopState";

import moment from "moment";
import { v4 as uuid4 } from "uuid";

const props = defineProps<{
  icon: string;
  title: string;
  onOpenClb: () => void;
}>();

const isSelected = ref<boolean>(true);

const desktopState = useDesktopState();
const myId = uuid4();
const mySelectRect = { p1: { x: 90, y: 90 }, p2: { x: 110, y: 110 } };

var isDoubleClick = false;
function onMouseClick(e: MouseEvent) {
  desktopState.desktop.focusedApp = myId;
  if (isDoubleClick) {
    isDoubleClick = false;
    runOpenClb();
  }

  isDoubleClick = true;
  setTimeout(() => (isDoubleClick = false), 300);
}

const MIN_OPEN_DELAY = 500;
var lastOpenTime: number = 0;
function runOpenClb() {
  if (moment().valueOf() - lastOpenTime > MIN_OPEN_DELAY) {
    lastOpenTime = moment().valueOf();
    props.onOpenClb();
  }
}

function onKeyPress(e: KeyboardEvent) {
  if (e.key == "Enter" && desktopState.desktop.focusedApp == myId) runOpenClb();
}

desktopState.$subscribe((mutation, state) => {
  // Skip all updates if desktop user select is not active
  if (!desktopState.desktop.selectActive) return;

  const userRect = desktopState.desktop.selectRect;
  console.log(userRect);

  const res =
    mySelectRect.p1.x < userRect.p2.x &&
    mySelectRect.p2.x > userRect.p1.x &&
    mySelectRect.p1.y > userRect.p2.y &&
    mySelectRect.p2.y < userRect.p1.y;

  console.log(res);
  isSelected.value = res;
});

onMounted(() => document.addEventListener("keypress", onKeyPress));
onUnmounted(() => document.removeEventListener("keypress", onKeyPress));
</script>

<template>
  <div class="win95-desktop-icon-holder" @click="onMouseClick">
    <div
      class="desktop-icon-image"
      :style="{ backgroundImage: `url(${props.icon})` }"
    >
      <div
        v-if="isSelected"
        :style="{
          WebkitMaskImage: `url(${props.icon})`,
          maskImage: `url(${props.icon})`,
        }"
        class="desktop-icon-overlay"
      ></div>
    </div>
    <div :class="`desktop-icon-title ${isSelected ? 'selected' : ''}`">
      {{ props.title }}
      <div
        v-if="desktopState.desktop.focusedApp == myId"
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

  top: 100px;
  left: 100px;
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

  background: repeating-conic-gradient(#0000a8 0% 25%, transparent 0% 50%) 50% /
    2px 2px;

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
