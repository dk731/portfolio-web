<script lang="ts" setup>
import { useAppsState } from "@/stores/Win95AppsState";
import { onMounted, onUnmounted, ref } from "vue";
import Win95SegmentDisplay from "../base/Win95SegmentDisplay.vue";
import Win95Application from "../base/Win95DesktopApplication.vue";
import type { DesktopSize } from "@/stores/Win95DesktopState";

enum IconState {
  Default = "/images/win95/happy-smile.png",
  Scream = "/images/win95/scream-smile.png",
  Lose = "/images/win95/sad-smile.png",
  Win = "/images/win95/swag-smile.png",
}

const apps = useAppsState();

var gameSize: DesktopSize = { width: 8, height: 8 };
var minesCount = 10;

const gameFieldRef = ref(null);

const activeCell = ref<number>(-1);
const iconState = ref<IconState>(IconState.Default);
const oppenedCells = ref<Set<number>>(new Set());
const bombCells = ref<Set<number>>(new Set());

function onMouseDown(e: MouseEvent) {
  iconState.value = IconState.Scream;
  updateActiveCell(e);
}
function onMouseUp(e: MouseEvent) {
  iconState.value = IconState.Default;
}

function updateActiveCell(e: MouseEvent) {
  if (iconState.value != IconState.Scream) return;
  const rect = (gameFieldRef.value as any).getBoundingClientRect();
  const x = e.clientX - rect.left - 3;
  const y = e.clientY - rect.top - 3;

  if (x < 0 || y < 0 || x >= gameSize.width * 16 || y >= gameSize.height * 16)
    return (activeCell.value = -1);

  activeCell.value = Math.floor(x / 16) + gameSize.width * Math.floor(y / 16);
}

function onMouseLeave(e: MouseEvent) {
  activeCell.value = -1;
}

function preventPropagation(e: MouseEvent) {
  e.stopPropagation();
}

onMounted(() => {
  apps.apps["minesweeper-app"].onOpenClb();
});

function onCellClick(cellId: number) {
  oppenedCells.value.add(cellId);
  // gameState.value[cellId].isOppened = true;
}

function restartGame() {
  bombCells.value = new Set(
    new Array(gameSize.width * gameSize.height)
      .map((_, i) => i)
      .sort(() => 0.5 - Math.random())
      .slice(0, minesCount)
  );
}

function getCellValue() {
  // const getCellValue = (cellId: number) => {
  //   if (bompIds.has(cellId)) return -1;
  //   const startInd = cellId - 1 - gameSize.width;
  //   var bombsCount = 0;
  //   for (let i = 0; i < 3; i++)
  //     for (let j = 0; j < 3; j++) if (bompIds.has(cellId)) bombsCount++;
  //   return bombsCount;
  // };
}

restartGame();

onMounted(() => {
  document.addEventListener("mouseup", onMouseUp);
});

onUnmounted(() => {
  document.removeEventListener("mouseup", onMouseUp);
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
      size: { width: 158, height: 240 },
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
        @mousemove="updateActiveCell"
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
        <div class="game-field" ref="gameFieldRef" @mouseleave="onMouseLeave">
          <div
            :class="`field-cell ${
              oppenedCells.has(i) || activeCell == i ? 'active' : ''
            }`"
            v-for="(_, i) in gameSize.width * gameSize.height"
            @mouseup="onCellClick(i)"
            :style="{
              backgroundColor: oppenedCells.has(i) ? 'red' : 'green',
              // boxShadow: oppenedCells.has(i)
            }"
          >
            <template v-if="oppenedCells.has(i)">
              <template v-if="bombCells.has(i)"></template>
              <template v-else></template>
            </template>
          </div>
        </div>
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

.game-field {
  width: 100%;
  height: 100%;

  /* display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0px; */

  display: grid;
  grid-template-columns: repeat(auto-fill, 16px);
  /* grid-gap: 1px; */
  row-gap: 1px;
  list-style-type: none;

  padding: 3px;
  box-sizing: border-box;

  box-shadow: inset 3px 3px #85898d, inset -3px -3px #ffffff;
}

.field-cell {
  position: relative;
  width: 15px;
  height: 15px;

  /* box-sizing: border-box; */

  box-shadow: inset 1px 1px #ffffff, 0.5px 0.5px 0 0.5px #000000,
    1px 1px #87888f, inset -1px -1px #85898d;
  /* box-shadow: none; */
}

.field-cell.active {
  box-shadow: none;
}

.field-cell.active:before {
  position: absolute;
  content: "";
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;

  border-bottom: dotted #000000 1px;
  border-right: dotted #000000 1px;
}
</style>
