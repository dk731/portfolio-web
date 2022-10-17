<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

import { useDesktopState } from "@/stores/Win95DesktopState";

import moment from "moment";
import { v4 as uuid4 } from "uuid";

const props = defineProps<{
  icon: string;
  title: string;
  onOpenClb: () => void;
}>();

const desktopState = useDesktopState();
const myId = uuid4();

var isDoubleClick = false;
function onMouseClick(e: MouseEvent) {
  desktopState.desktop.focusedApp = myId;
}

const MIN_OPEN_DELAY = 500;
var lastOpenTime: number = 0;
function runOpenClb() {
  if (
    desktopState.desktop.focusedApp == myId &&
    moment().valueOf() - lastOpenTime > MIN_OPEN_DELAY
  ) {
    lastOpenTime = moment().valueOf();
    props.onOpenClb();
  }
}

function onKeyPress(e: KeyboardEvent) {
  if (e.key == "Enter") runOpenClb();
}

onMounted(() => document.addEventListener("keypress", onKeyPress));
onUnmounted(() => document.removeEventListener("keypress", onKeyPress));
</script>

<template>
  <div class="win95-desktop-icon-holder" @click="onMouseClick">
    <div
      class="desktop-icon-image"
      :style="{ backgroundImage: `url(${props.icon})` }"
    />
    <div
      :class="`desktop-icon-title ${
        desktopState.desktop.focusedApp == myId ? 'focused' : ''
      }`"
    >
      {{ props.title }}
    </div>
  </div>
</template>

<style scoped>
.win95-desktop-icon-holder {
  position: absolute;

  display: flex;
  flex-direction: column;
  align-items: center;

  top: 100px;
  left: 100px;
}

.desktop-icon-image {
  width: 32px;
  height: 32px;

  margin-bottom: 4px;

  background-size: 100%;
}

.desktop-icon-title {
  left: 0;

  max-width: 68px;

  padding: 1px;

  box-sizing: border-box;

  font-size: 11px;
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
  color: #ffffff;
}

.desktop-icon-title.focused {
  border: 1px dotted #ff0000;
}
</style>
