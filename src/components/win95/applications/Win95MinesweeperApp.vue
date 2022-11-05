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
const flagCells = ref<Set<number>>(new Set());
const questionCells = ref<Set<number>>(new Set());

// Array where index is cell id, and value is neighbour bombs amount, if -1 than it is bomb
const gameState = ref<number[]>([]);

function onMouseDown(e: MouseEvent) {
  if (e.button != 0) return;

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

function getNeighboursIds(cellId: number) {
  var outNeighbours = [];
  const startInd = cellId - 1 - gameSize.width;

  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      const currentInd = startInd + x + gameSize.width * y;
      if (
        Math.abs((currentInd % gameSize.width) - (cellId % gameSize.width)) <= 3
      )
        outNeighbours.push(currentInd);
    }
  }

  return outNeighbours;
}

function onCellMouseDown(e: MouseEvent, cellInd: number) {
  if (e.button != 2) return;

  if (flagCells.value.has(cellInd)) {
    flagCells.value.delete(cellInd);
    questionCells.value.add(cellInd);
  } else if (questionCells.value.has(cellInd)) {
    questionCells.value.delete(cellInd);
  } else {
    flagCells.value.add(cellInd);
  }
}

function onCellMouseUp(e: MouseEvent, cellId: number) {
  if (
    e.button != 0 ||
    flagCells.value.has(cellId) ||
    oppenedCells.value.has(cellId)
  )
    return;

  oppenedCells.value.add(cellId);
  if (gameState.value[cellId] == 0)
    getNeighboursIds(cellId).forEach((el) => onCellMouseUp(e, el));
}

function restartGame() {
  const newGameState = [];

  const cellsLength = gameSize.width * gameSize.height;

  // Generate random bombs ids
  const bombCells = new Set(
    [...Array(cellsLength).keys()]
      .sort(() => 0.5 - Math.random())
      .slice(0, minesCount)
  );

  const getCellValue = (cellId: number) => {
    if (bombCells.has(cellId)) return -1;

    return getNeighboursIds(cellId).reduce(
      (prev, el) => prev + (bombCells.has(el) ? 1 : 0),
      0
    );
  };

  for (let i = 0; i < cellsLength; i++) newGameState.push(getCellValue(i));

  oppenedCells.value.clear();
  gameState.value = newGameState;
}

restartGame();

onMounted(() => {
  apps.apps["minesweeper-app"].onOpenClb();
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
            @mouseup="restartGame"
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
              oppenedCells.has(i) || (activeCell == i && !flagCells.has(i))
                ? 'active'
                : ''
            } ${oppenedCells.has(i) ? `cell${gameState[i]}` : ''} ${
              !oppenedCells.has(i) && flagCells.has(i) ? 'flag' : ''
            } ${
              !oppenedCells.has(i) && questionCells.has(i) ? 'question' : ''
            }`"
            v-for="(_, i) in gameState"
            @mousedown="(e) => onCellMouseDown(e, i)"
            @mouseup="(e) => onCellMouseUp(e, i)"
          >
            <template v-if="oppenedCells.has(i) && gameState[i] > 0">
              <div class="cell-text">
                {{ gameState[i] }}
              </div>
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

  box-shadow: inset 1px 1px #ffffff, 0.5px 0.5px 0 0.5px #000000,
    1px 1px #87888f, inset -1px -1px #85898d;
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

.cell-text {
  text-align: center;
  font-size: 13px;
  transform: translate(0px, 3px);
}

.flag {
  background-size: 100%;
  background-image: url(/images/win95/flag.png);
}

.question {
  background-size: 100%;
  background-image: url(/images/win95/question-mark.png);
}

/* bomb */
.cell-1 {
  background-size: 100%;
  background-image: url(/images/win95/mine.png);
}

.cell1 {
  color: #0a11f9;
}
.cell2 {
  color: #1ea950;
}
.cell3 {
  color: #fa161e;
}
.cell4 {
  color: #0306a6;
}
.cell5 {
  color: #a60c54;
}
.cell6 {
  color: #5babaa;
}
.cell7 {
  color: #a858a8;
}
.cell8 {
  color: #000000;
}
</style>
