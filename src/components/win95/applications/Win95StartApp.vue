<script setup lang="ts">
import { useAppsState } from "@/stores/Win95AppsState";
import { useDesktopState } from "@/stores/Win95DesktopState";
import { useTaskbarState } from "@/stores/Win95TaskbarState";
import Win95ListButton from "../base/Win95ListButton.vue";

const desktop = useDesktopState();
const apps = useAppsState();
const taskbar = useTaskbarState();
const myId = "start-app";

function onOpenClb() {
  desktop.activeApp = myId;
}

// Leave some callbacks empty as 'Start' is not interested in them
apps.apps[myId] = {
  id: myId,
  title: "Start",
  icon: "images/win95/windows-4.png",
  onOpenClb: () => onOpenClb,
  onCloseClb: () => {},
  onFocusClb: () => {},
  onMinimizeClb: () => {},
  onMaximizeClb: () => {},
};
taskbar.apps.unshift(myId);

function onShutdownClick() {
  console.log("Shutdown");
}
</script>

<template>
  <div class="win95-start-menu-holder">
    <div class="window-icon"></div>
    <div class="navigation-holder">
      <Win95ListButton
        :title="`Shut Down...`"
        :icon="`images/win95/shut_down_normal-2.png`"
        :on-click-clb="onShutdownClick"
      ></Win95ListButton>
      <!-- <div class="list-button">Shutdown</div> -->
    </div>
  </div>
</template>

<style scoped>
.win95-start-menu-holder {
  position: absolute;
  width: 162px;
  height: 271px;

  left: 2px;
  bottom: -4px;

  padding: 3px;
  box-sizing: border-box;

  display: flex;
  flex-direction: row;

  background: #bfc6c7;
  z-index: 1000000000;

  box-shadow: inset 0px 0px 0px 1px #c0c7c8, inset -1px -1px 0px 1px #87888f,
    inset 1px 1px 0px 1px #ffffff;
}

.win95-start-menu-holder:before {
  content: "";
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  border: solid 1px #000000;
  border-left: none;
  border-top: none;
}

.window-icon {
  width: 21px;
  min-width: 21px;
  height: 265px;
  min-height: 265px;

  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(/images/win95/start-logo.png);
}

.navigation-holder {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column-reverse;
}

.navigation-holder > * {
  height: 34px;
}
</style>
