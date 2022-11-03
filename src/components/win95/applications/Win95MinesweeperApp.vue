<script lang="ts" setup>
import { useAppsState } from "@/stores/Win95AppsState";
import { onMounted } from "vue";
import Win95SegmentDisplay from "../base/Win95SegmentDisplay.vue";
import Win95Application from "../base/Win95DesktopApplication.vue";

const apps = useAppsState();

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
      <div class="game-holder">
        <div class="score-holder">
          <Win95SegmentDisplay
            :segments="3"
            :value="`123`"
          ></Win95SegmentDisplay>
          123
          <Win95SegmentDisplay :segments="3" :value="`8`"></Win95SegmentDisplay>
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
</style>
