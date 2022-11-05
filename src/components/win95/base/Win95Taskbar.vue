<script setup lang="ts">
import { useAppsState } from "@/stores/Win95AppsState";
import { useDesktopState } from "@/stores/Win95DesktopState";
import { useTaskbarState } from "@/stores/Win95TaskbarState";
import moment from "moment";
import { ref } from "vue";

const desktop = useDesktopState();
const taskbar = useTaskbarState();
const apps = useAppsState();

const currentTime = ref<moment.Moment>(moment());
setInterval(() => (currentTime.value = moment()), 1000);

function onFocusClick(appId: string) {
  apps.apps[appId].onFocusClb();
}
</script>

<template>
  <div class="win95-taskbar-holder">
    <div class="taskbar-drabble"></div>
    <div class="taskbar-icons-wrapper">
      <div class="taskbar-icons-holder">
        <div
          v-for="appId in taskbar.apps"
          :class="`taskbar-app win95-button ${
            desktop.activeApp == appId ? 'active-application' : ''
          }`"
          @click="onFocusClick(appId)"
        >
          <div
            v-if="apps.apps[appId].icon"
            class="taskbar-task-icon"
            draggable="false"
            :style="{ backgroundImage: `url(${apps.apps[appId].icon})` }"
          />
          <div v-if="apps.apps[appId].title" class="taskbar-task-title">
            {{ apps.apps[appId].title }}
          </div>
        </div>
      </div>
      <div class="special-icons-holder">
        <div
          class="sound-icon"
          :style="{
            backgroundImage: `url(images/win95/loudspeaker_rays-1.png)`,
          }"
        />
        <div class="clock-icon">{{ currentTime.format("h:mm A") }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.win95-taskbar-holder {
  position: relative;

  display: flex;
  flex-direction: column;

  bottom: 0;
  left: 0;

  width: 100%;
  min-height: 28px;

  background-color: #c0c7c8;
  z-index: 1000000;
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
  position: absolute;
  right: 3px;
  bottom: 3px;

  min-width: 80px;
  box-shadow: 0.5px 0.5px 0 0.5px #ffffff, inset 1px 1px #87888f;
  align-items: center;
  justify-content: center;

  background: #bfc6c7;
  padding: 2px;
  padding-left: 3px;
  box-sizing: border-box;
}

.special-icons-holder > * {
  height: 16px;
}

.taskbar-task-icon {
  width: 16px;
  height: 16px;
  background-size: 100%;
  margin-right: 3px;
}

.taskbar-task-title {
  font-family: win95-bold;
  font-size: 11px;
  transform: translate(0px, -2px);
  user-select: none;
}

.taskbar-app {
  position: relative;

  display: flex;
  flex-direction: row;

  align-items: center;
  padding: 3px;
  margin-right: 3px;
  width: 160px;
}

.taskbar-app:first-child {
  /* padding-right: 5px; */
  margin-right: 4px;
  width: 45px;
}

.sound-icon {
  min-width: 16px;
  height: 16px;
}

.clock-icon {
  width: 100%;
  height: 100%;

  text-align: center;
  font-size: 11px;
  line-height: 20px;
  letter-spacing: 1px;

  user-select: none;
}

.active-application {
  box-shadow: 0.5px 0.5px 0 0.5px white, inset 1px 1px black,
    inset -1px -1px #c0c7c8, inset 2px 2px #85898d;
  overflow: hidden;
}

.active-application:before {
  content: "";
  position: absolute;

  left: 1px;
  top: 1px;

  width: calc(100% - 2px);
  height: calc(100% - 2px);

  mix-blend-mode: multiply;
  background: repeating-conic-gradient(#c0c7c8 0% 25%, transparent 0% 50%) 0px
    0px / 2px 2px;
}
</style>
