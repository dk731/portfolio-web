<script lang="ts" setup>
import { ref, type VNodeRef } from "vue";
import Win95AppIcon from "./base/Win95DesktopIcon.vue";
import moment from "moment";

import { useDesktopState } from "@/stores/Win95DesktopState";
import Win95StartApp from "./applications/Win95StartApp.vue";

const desktopState = useDesktopState();

const currentTime = ref<moment.Moment>(moment());
setInterval(() => (currentTime.value = moment()), 1000);
</script>

<template>
  <div class="win95-holder">
    <div class="desktop-holder">
      <Win95StartApp></Win95StartApp>

      <Win95AppIcon icon="computer_explorer-4.png"></Win95AppIcon>
      <Win95AppIcon icon="computer_explorer-3.png"></Win95AppIcon>
      <Win95AppIcon icon="computer_explorer-5.png"></Win95AppIcon>
    </div>

    <div class="taskbar-holder">
      <div class="taskbar-drabble"></div>
      <div class="taskbar-icons-wrapper">
        <div class="taskbar-icons-holder">
          <div
            v-for="app in desktopState.taskbar.taskbarApps"
            :class="`taskbar-app ${
              app.id == desktopState.taskbar.activeApp?.id ? 'active' : ''
            }`"
            @click="app.onOpenClb"
          >
            <img
              v-if="app.iconName"
              class="taskbar-task-icon"
              draggable="false"
              :src="app.iconName"
            />
            <div v-if="app.taskbarTitle" class="taskbar-task-title">
              {{ app.taskbarTitle }}
            </div>
          </div>
        </div>
        <div class="special-icons-holder">
          <img draggable="false" src="images/win95/loudspeaker_rays-1.png" />
          <div class="clock-icon">{{ currentTime.format("hh:mm A") }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@font-face {
  font-family: win95-non-bold;
  src: url("fonts/win95/MS Sans Serif 8pt.ttf");
}

@font-face {
  font-family: win95-bold;
  src: url("fonts/win95/MS Sans Serif 8pt bold.ttf");
}

.win95-holder {
  position: relative;
  width: 800px;
  height: 600px;
  /* width: 100%;
  height: 100%; */

  display: flex;
  flex-direction: column;

  background-color: #57a8a8;

  font-family: win95-non-bold;
  cursor: url(/cursors/arrow.cur), auto;
}

.desktop-holder {
  position: relative;

  width: 100%;
  height: 100%;
}

.taskbar-holder {
  position: relative;

  display: flex;
  flex-direction: column;

  bottom: 0;
  left: 0;

  width: 100%;
  min-height: 28px;

  background-color: #c0c7c8;
}

.taskbar-icons-wrapper {
  height: 22px;
  width: 100%;

  display: flex;
  flex-direction: row;

  padding-top: 2px;
  padding-left: 2px;
  padding-right: 3px;

  box-sizing: border-box;
}

.taskbar-icons-wrapper > div {
  height: 21px;

  display: flex;
  flex-direction: row;
}

.taskbar-icons-holder {
  width: 100%;
}

.taskbar-drabble {
  height: 1px;
  width: 100%;
  border-bottom: 1px solid #ffffff;
}

.special-icons-holder {
  width: 79px;
  box-shadow: 0.5px 0.5px 0 0.5px #ffffff, inset 1px 1px #87888f;
  align-items: center;
  justify-content: center;

  padding: 2px;
  box-sizing: border-box;
}

.special-icons-holder > * {
  height: 16px;
}

.clock-icon {
  width: 100%;
  text-align: center;
  font-size: 10px;
  line-height: 18px;

  user-select: none;
}

.taskbar-task-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}

.taskbar-task-title {
  font-family: win95-bold;
  font-size: 12px;
  transform: translate(0px, -2px);
  user-select: none;
}

.taskbar-app {
  display: flex;
  flex-direction: row;

  align-items: center;
  padding: 4px;
  box-shadow: inset 1px 1px #ffffff, 0.5px 0.5px 0 0.5px #000000,
    1px 1px #87888f, inset -1px -1px #85898d;
}

.taskbar-app.active {
  box-shadow: 0.5px 0.5px 0 0.5px white, inset 1px 1px black,
    inset -1px -1px #c0c7c8, inset 2px 2px #85898d;
}
</style>
