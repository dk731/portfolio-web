<script setup lang="ts">
import { useAppsState } from "@/stores/Win95AppsState";
import { useDesktopState } from "@/stores/Win95DesktopState";
import { useTaskbarState } from "@/stores/Win95TaskbarState";
import { useWindowsState } from "@/stores/Win95WindowsState";
import { onMounted, onUnmounted, ref, watch } from "vue";
import Win95ListButton from "../base/Win95ListButton.vue";
import Win95Window from "../base/Win95Window.vue";

enum ShutDownVariant {
  ShutDown,
  Restart,
}

const desktop = useDesktopState();
const apps = useAppsState();
const windows = useWindowsState();
const taskbar = useTaskbarState();
const myId = "start-app";
const windowId = `${myId}-window`;

const isShutDown = ref<boolean>(false);
const shutDownVariant = ref<ShutDownVariant>(ShutDownVariant.ShutDown);

function onOpenClb() {
  desktop.activeApp = myId;
}

function onShutDownExecute() {
  desktop.needBoot = false;

  localStorage.clear();

  if (shutDownVariant.value == ShutDownVariant.Restart) location.reload();

  desktop.storageState.booted = false;
}

function onShutdownClick() {
  desktop.activeApp = windowId;
  isShutDown.value = true;

  desktop.add(windowId);
  windows.add(windowId);
}

function onShutDownClose() {
  desktop.activeApp = undefined;
  isShutDown.value = false;

  desktop.remove(windowId);
  windows.remove(windowId);
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key == "Escape") onShutDownClose();
}

function preventPropagation(e: MouseEvent) {
  e.stopPropagation();
}

apps.apps[myId] = {
  id: myId,
  title: "Start",
  icon: "images/win95/windows-4.png",
  onOpenClb: onOpenClb,
  onCloseClb: () => {},
  onFocusClb: onOpenClb,
  onMinimizeClb: () => {},
  onMaximizeClb: () => {},
  windowPosition: { x: 0, y: 0 },
  windowSize: { width: 0, height: 0 },
};

apps.apps[windowId] = {
  id: windowId,
  title: "Shut Down Windows",
  onOpenClb: () => {},
  onCloseClb: onShutDownClose,
  onFocusClb: () => {},
  onMinimizeClb: () => {},
  onMaximizeClb: () => {},
  windowPosition: {
    x: desktop.size.width / 2 - 175,
    y: desktop.size.height / 2 - 100,
  },
  windowSize: { width: 350, height: 200 },
};

watch(
  () => desktop.size,
  () => {
    apps.apps[windowId].windowPosition = {
      x: desktop.size.width / 2 - 175,
      y: desktop.size.height / 2 - 100,
    };
  }
);

// Unshift taskbar record, so that it allways is first
taskbar.apps.unshift(myId);

onMounted(() => {
  document.addEventListener("keydown", onKeyDown);
});
onUnmounted(() => {
  document.removeEventListener("keydown", onKeyDown);
});
</script>

<template>
  <div
    v-if="desktop.activeApp == myId"
    class="win95-start-menu-holder"
    @mousedown="preventPropagation"
  >
    <div class="window-icon"></div>
    <div class="navigation-holder">
      <Win95ListButton
        :title="`Shut Down...`"
        :icon="`images/win95/shut_down_normal-2.png`"
        :on-click-clb="onShutdownClick"
      ></Win95ListButton>
    </div>
  </div>
  <div v-if="isShutDown" class="shutdown-prompt">
    <Win95Window
      v-if="isShutDown"
      :id="windowId"
      :is-draggable="false"
      :is-resizable="false"
      :maximize-visible="false"
      :minimize-visible="false"
    >
      <template #content>
        <div class="action-select-holder">
          <div class="action-select">
            <div class="shutdown-icon"></div>
            <div class="variant-holder">
              <div class="variant-header">Are you sure you want to:</div>
              <div
                class="shutdown-variant"
                @mousedown="() => (shutDownVariant = ShutDownVariant.ShutDown)"
              >
                <div
                  :class="`radio-button ${
                    shutDownVariant == ShutDownVariant.ShutDown && 'active'
                  }`"
                ></div>
                <div class="variant-text">Shut down the portfolio?</div>
              </div>

              <div
                class="shutdown-variant"
                @mousedown="() => (shutDownVariant = ShutDownVariant.Restart)"
              >
                <div
                  :class="`radio-button ${
                    shutDownVariant == ShutDownVariant.Restart && 'active'
                  }`"
                ></div>
                <div class="variant-text">Restart the portfolio?</div>
              </div>
            </div>
          </div>
          <div class="v-spacer"></div>
          <div class="buttons-holder">
            <div
              class="win95-button submit-button"
              style="border: solid black 1px"
            >
              <div class="button-text" @mouseup="onShutDownExecute">Yes</div>
            </div>
            <div class="win95-button submit-button" @mouseup="onShutDownClose">
              <div class="button-text">No</div>
            </div>
          </div>
        </div>
      </template>
    </Win95Window>
  </div>
</template>

<style scoped>
.win95-start-menu-holder {
  position: absolute;
  width: 162px;
  height: 271px;

  left: 2px;
  bottom: 24px;

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

.shutdown-prompt {
  position: absolute;
  width: 100%;
  height: 100%;

  z-index: 1000001;

  background: repeating-conic-gradient(#000000 0% 25%, transparent 0% 50%) 0px
    0px / 2px 2px;
}

.variant-holder {
  display: flex;
  flex-direction: column;

  margin-top: 3px;
  margin-left: 20px;
  font-size: 14px;
}

.variant-header {
  margin-bottom: 15px;
}

.action-select-holder {
  width: 100%;
  height: 100%;

  padding: 20px 10px 10px 15px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
}

.action-select {
  display: flex;
  flex-direction: row;
}

.shutdown-icon {
  width: 32px;
  height: 32px;

  background-image: url(/images/win95/shut_down_with_computer-0.png);
}

.shutdown-variant {
  display: flex;
  flex-direction: row;

  margin-bottom: 6px;
}

.radio-button {
  width: 12px;
  height: 12px;

  margin-right: 6px;

  background-image: url(/images/win95/radio-button.png);
}

.radio-button.active {
  background-image: url(/images/win95/radio-button-active.png);
}

.variant-text:first-letter {
  text-decoration: underline;
}

.submit-button {
  width: 76px;
  height: 23px;
  text-align: center;

  margin-left: 8px;
}

.submit-button:first-letter {
  text-decoration: underline;
}

.buttons-holder {
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.button-text {
  font-size: 14px;
  transform: translate(0px, 5px);
}
</style>
