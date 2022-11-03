<script lang="ts" setup>
import { useAppsState } from "@/stores/Win95AppsState";
import { onMounted, ref } from "vue";
import Win95SegmentDisplay from "../base/Win95SegmentDisplay.vue";
import Win95Application from "../base/Win95DesktopApplication.vue";

const apps = useAppsState();

enum IconState {
  Default = "/images/win95/happy-smile.png",
  Scream = "/images/win95/scream-smile.png",
  Lose = "/images/win95/sad-smile.png",
  Win = "/images/win95/swag-smile.png",
}

const iconState = ref<IconState>(IconState.Default);

function onMouseDown(e: MouseEvent) {
  iconState.value = IconState.Scream;
}
function onMouseUp(e: MouseEvent) {
  iconState.value = IconState.Default;
}

function preventPropagation(e: MouseEvent) {
  e.stopPropagation();
}

onMounted(() => {
  apps.apps["minesweeper-app"].onOpenClb();
});
</script>

<template>
  <Win95Application
    :id="`minesweeper-app`"
    :icon="`images/win95/minesweeper-mine.png`"
    :title="`Minesweeper`"
    :init-icon="{ position: { x: 10, y: 200 } }"
    :init-window="{
      position: { x: 50, y: 50 },
      size: { width: 157, height: 240 },
    }"
    :is-resizable="false"
    :is-maximizable="false"
  >
    <template #toolbar>
      <div class="toolbar-btn">Game</div>
      <div class="toolbar-btn">Help</div>
    </template>
    <template #content>
      <div
        class="game-holder"
        @mousedown="onMouseDown"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
      >
        <div class="score-holder">
          <Win95SegmentDisplay
            :segments="3"
            :value="`123`"
          ></Win95SegmentDisplay>
          <div class="v-spacer" />
          <div
            class="reset-button win95-button"
            :style="{
              backgroundImage: `url(${iconState})`,
            }"
            @mousedown="preventPropagation"
          ></div>
          <div class="v-spacer" />
          <Win95SegmentDisplay
            :segments="3"
            :value="`-38`"
          ></Win95SegmentDisplay>
        </div>
        <div class="game-field"></div>
      </div>
    </template>
  </Win95Application>
</template>

<style scoped>
.game-holder {
  width: 100%;
  height: 100%;

  padding: 8px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;

  box-shadow: inset -3px -3px #85898d, inset 3px 3px #ffffff;
}

.score-holder {
  display: flex;
  flex-direction: row;

  width: 100%;
  min-height: 38px;

  padding: 6px;
  box-sizing: border-box;
  margin-bottom: 6px;

  box-shadow: inset 2px 2px #85898d, inset -2px -2px #ffffff;
}

.game-field {
  width: 100%;
  height: 100%;

  box-shadow: inset 3px 3px #85898d, inset -3px -3px #ffffff;
}

.toolbar-btn {
  font-size: 13px;
  margin-right: 8px;
}
.toolbar-btn::first-letter {
  text-decoration: underline;
}

.reset-button {
  position: relative;
  width: 22px;
  height: 22px;

  background-position: center;
  background-size: 100%;

  transform: translate(-1px, 0px);
}

.reset-button:before {
  content: "";
  position: absolute;
  left: 0px;
  top: 0px;
  right: -1px;
  bottom: -1px;

  box-shadow: 1px 1px #85898d, -1px -1px #85898d;
}
</style>
