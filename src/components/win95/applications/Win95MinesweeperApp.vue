<script lang="ts" setup>
import { useAppsState } from "@/stores/Win95AppsState";
import { onMounted, onUnmounted, ref } from "vue";
import Win95SegmentDisplay from "../base/Win95SegmentDisplay.vue";
import Win95Application from "../base/Win95DesktopApplication.vue";
import type { DesktopSize } from "@/stores/Win95DesktopState";
import Win95ToolbarDropdownList from "../base/Win95ToolbarDropdownList.vue";
import Win95ListButton from "../base/Win95ListButton.vue";

enum IconState {
  Default = "/images/win95/happy-smile.png",
  Scream = "/images/win95/scream-smile.png",
  Lose = "/images/win95/sad-smile.png",
  Win = "/images/win95/swag-smile.png",
}

enum MarkState {
  Empty,
  Flag,
  Question,
}

type CellState = {
  index: number;
  value: number; // 0-8 -> neighbour mines, -1 -> is mine
  isOppened: boolean;
  markState: MarkState;
};

enum GameDifficulty {
  Easy,
  Normal,
  Hard,
}

const gamePressets = {
  [GameDifficulty.Easy]: {
    gameSize: { width: 8, height: 8 },
    minesCount: 10,
  },
  [GameDifficulty.Normal]: {
    gameSize: { width: 16, height: 16 },
    minesCount: 40,
  },
  [GameDifficulty.Hard]: {
    gameSize: { width: 30, height: 16 },
    minesCount: 99,
  },
};

const myId = `minesweeper-app`;
const apps = useAppsState();

var gameSize: DesktopSize = { width: 8, height: 8 };
var minesCount = ref<number>(10);
var firstMove = true;
var timerInterval: number;
const gameDifficulty = ref<GameDifficulty>(GameDifficulty.Easy);

const gameFieldRef = ref(null);

const activeCell = ref<number>(-1);
const iconState = ref<IconState>(IconState.Default);
const gameTimer = ref<number>(0);

const gameState = ref<CellState[]>([]);

function onMouseDown(e: MouseEvent) {
  if (
    e.button != 0 ||
    iconState.value == IconState.Lose ||
    iconState.value == IconState.Win
  )
    return;

  iconState.value = IconState.Scream;
  updateActiveCell(e);
}
function onMouseUp(e: MouseEvent) {
  if (iconState.value == IconState.Lose || iconState.value == IconState.Win)
    return;

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
        currentInd >= 0 &&
        Math.abs((currentInd % gameSize.width) - (cellId % gameSize.width)) <= 3
      )
        outNeighbours.push(currentInd);
    }
  }

  return outNeighbours;
}

function onCellMouseDown(e: MouseEvent, cell: CellState) {
  if (
    e.button != 2 ||
    cell.isOppened ||
    iconState.value == IconState.Lose ||
    iconState.value == IconState.Win
  )
    return;

  gameState.value[cell.index].markState = (cell.markState + 1) % 3;
}

function onCellMouseUp(e: MouseEvent, cell: CellState) {
  if (
    e.button != 0 ||
    cell.markState == MarkState.Flag ||
    cell.isOppened ||
    iconState.value == IconState.Lose ||
    iconState.value == IconState.Win
  )
    return;
  const myInd = cell.index;

  // Grantee that first move will not be game lose
  if (firstMove) {
    firstMove = false;
    clearInterval(timerInterval);
    gameTimer.value = 0;
    while (true) {
      const newGame = generateNewGame();
      if (newGame[myInd].value != -1) {
        gameState.value = newGame;
        timerInterval = setInterval(() => (gameTimer.value += 1), 1000);
        break;
      }
    }
  }

  const newState = gameState.value[myInd];

  newState.isOppened = true;

  // Check if game ended
  if (newState.value == -1) {
    // Game over
    iconState.value = IconState.Lose;
    newState.value = -11;
    clearInterval(timerInterval);
    gameState.value
      .filter((el) => el.value == -1)
      .forEach((el) => (gameState.value[el.index].isOppened = true));
  } else if (
    gameState.value.filter((el) => el.value != -1 && !el.isOppened).length == 0
  ) {
    gameState.value
      .filter((el) => el.value == -1)
      .forEach((el) => (gameState.value[el.index].markState = MarkState.Flag));
    clearInterval(timerInterval);
    iconState.value = IconState.Win;
  }
  if (newState.value == 0)
    getNeighboursIds(myInd).forEach((el) => {
      if (gameState.value[el]) onCellMouseUp(e, gameState.value[el]);
    });

  gameState.value[myInd] = newState;
}

function onRestartClick(e: MouseEvent) {
  firstMove = true;
  gameState.value = generateNewGame();
  clearInterval(timerInterval);
  gameTimer.value = 0;
  iconState.value = IconState.Default;
}

function onNewClick() {
  onRestartClick(undefined as any);
}

function onDifficultyClick(newDifficulty: GameDifficulty) {
  const newPresset = gamePressets[newDifficulty]!;

  gameSize = newPresset.gameSize;
  minesCount.value = newPresset.minesCount;

  apps.apps[myId].windowSize = {
    width: gameSize.width * 16 + 30,
    height: gameSize.height * 16 + 112,
  };

  gameDifficulty.value = newDifficulty;
  onNewClick();
}

function generateNewGame() {
  const newGameState: CellState[] = [];

  const cellsLength = gameSize.width * gameSize.height;

  // Generate random bombs ids
  const bombCells = new Set(
    [...Array(cellsLength).keys()]
      .sort(() => 0.5 - Math.random())
      .slice(0, minesCount.value)
  );

  const getCellValue = (cellId: number) => {
    if (bombCells.has(cellId)) return -1;

    return getNeighboursIds(cellId).reduce(
      (prev, el) => prev + (bombCells.has(el) ? 1 : 0),
      0
    );
  };

  for (let i = 0; i < cellsLength; i++)
    newGameState.push({
      index: i,
      value: getCellValue(i),
      isOppened: false,
      markState: MarkState.Empty,
    });

  return newGameState;
}

function onOpenClb() {
  onRestartClick(undefined as any);
}

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
    :id="myId"
    :icon="`images/win95/minesweeper-mine.png`"
    :title="`Minesweeper`"
    :init-icon="{ position: { x: 10, y: 200 } }"
    :init-window="{
      position: { x: 50, y: 50 },
      size: { width: 158, height: 240 },
    }"
    :is-resizable="false"
    :is-maximizable="false"
    @open-clb="onOpenClb"
  >
    <template #toolbar>
      <Win95ToolbarDropdownList
        :is-menu-active="apps.apps[myId].isToolbarActive"
      >
        <template #header>Game</template>
        <template #dropdown>
          <Win95ListButton :on-click-clb="onNewClick">
            <template #default
              ><div class="list-button-content">New</div></template
            >
          </Win95ListButton>
          <Win95ListButton
            :on-click-clb="() => onDifficultyClick(GameDifficulty.Easy)"
          >
            <template #default
              ><div
                v-if="gameDifficulty == GameDifficulty.Easy"
                class="tick-icon"
              >
                ✔
              </div>
              <div class="list-button-content">Begginer</div></template
            >
          </Win95ListButton>
          <Win95ListButton
            :on-click-clb="() => onDifficultyClick(GameDifficulty.Normal)"
          >
            <template #default
              ><div
                v-if="gameDifficulty == GameDifficulty.Normal"
                class="tick-icon"
              >
                ✔
              </div>
              <div class="list-button-content">Entermidiate</div></template
            >
          </Win95ListButton>
          <Win95ListButton
            :on-click-clb="() => onDifficultyClick(GameDifficulty.Hard)"
          >
            <template #default>
              <div
                v-if="gameDifficulty == GameDifficulty.Hard"
                class="tick-icon"
              >
                ✔
              </div>
              <div class="list-button-content">Expert</div></template
            >
          </Win95ListButton>
        </template>
      </Win95ToolbarDropdownList>
      <Win95ToolbarDropdownList
        :is-menu-active="apps.apps[myId].isToolbarActive"
      >
        <template #header>Help</template>
      </Win95ToolbarDropdownList>
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
            :value="
              (
                minesCount -
                gameState.reduce(
                  (prev, el) => prev + (el.markState == MarkState.Flag ? 1 : 0),
                  0
                )
              ).toString()
            "
          ></Win95SegmentDisplay>
          <div class="v-spacer" />
          <div
            class="reset-button win95-button"
            :style="{
              backgroundImage: `url(${iconState})`,
            }"
            @mousedown="preventPropagation"
            @mouseup="onRestartClick"
          ></div>
          <div class="v-spacer" />
          <Win95SegmentDisplay
            :segments="3"
            :value="gameTimer.toString()"
          ></Win95SegmentDisplay>
        </div>
        <div class="game-field" ref="gameFieldRef" @mouseleave="onMouseLeave">
          <div
            v-for="myState in gameState"
            :class="`field-cell ${
              myState.isOppened ||
              (activeCell == myState.index &&
                myState.markState != MarkState.Flag)
                ? 'active'
                : ''
            } ${myState.isOppened ? `cell${myState.value}` : ''} ${
              !myState.isOppened && myState.markState == MarkState.Flag
                ? 'flag'
                : ''
            } ${
              !myState.isOppened && myState.markState == MarkState.Question
                ? 'question'
                : ''
            }`"
            @mousedown="(e) => onCellMouseDown(e, myState)"
            @mouseup="(e) => onCellMouseUp(e, myState)"
          >
            <template v-if="myState.isOppened && myState.value > 0">
              <div class="cell-text">
                {{ myState.value }}
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
  height: 100%;
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

.cell-11 {
  background: url(/images/win95/mine.png) #ff0000;
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

.list-button-content {
  padding: 2px;
  padding-left: 13px;

  transform: translate(0px, 2px);
}

.list-button-content::first-letter {
  text-decoration: underline;
}

.tick-icon {
  position: absolute;
}
</style>
