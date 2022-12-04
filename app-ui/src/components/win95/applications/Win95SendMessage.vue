<script lang="ts" setup>
import { useAppsState } from "@/stores/Win95AppsState";
import { onMounted, ref } from "vue";
import Win95Application from "../base/Win95DesktopApplication.vue";
import Win95EditBox from "../base/Win95EditBox.vue";
import axios from "axios";
import Win95Window from "../base/Win95Window.vue";
import { useWindowsState } from "@/stores/Win95WindowsState";
import { useDesktopState } from "@/stores/Win95DesktopState";
import { useTaskbarState } from "@/stores/Win95TaskbarState";

const apps = useAppsState();
const windows = useWindowsState();
const desktop = useDesktopState();
const taskbar = useTaskbarState();

const sendName = ref<string>("");
const sendEmail = ref<string>("");
const sendContent = ref<string>("");
const modalContent = ref<string>("asdasd");

const myId = `send-message-app`;
const modalId = `send-message-app-modal`;
var isModalActive = false;

async function onSendClick(e: MouseEvent) {
  if (
    !(
      sendContent.value.length > 4 &&
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(sendEmail.value) &&
      sendName.value.length > 1
    )
  )
    return;

  var successeeded = false;

  try {
    const resp = await axios.post("/api/send_message", {
      name: sendName.value,
      email: sendEmail.value,
      content: sendContent.value,
    });

    successeeded = resp.status == 200;
  } catch {
    successeeded = false;
  }

  if (successeeded) {
    modalContent.value =
      "Thank you for your interest !\nMessage has been successfully delivered !";
  } else {
    modalContent.value =
      "Was not able to send your message, please try again :(";
  }

  onModalOpen();

  isModalActive = true;
}

function onModalOpen() {
  windows.add(modalId);
  desktop.add(modalId);

  const baseApp = apps.apps[myId];
  const modalApp = apps.apps[modalId];

  apps.apps[modalId].windowPosition = {
    x:
      baseApp.windowPosition.x +
      baseApp.windowSize.width / 2 -
      modalApp.windowSize.width / 2,
    y:
      baseApp.windowPosition.y +
      baseApp.windowSize.height / 2 -
      modalApp.windowSize.height / 2,
  };

  desktop.activeApp = modalId;
  windows.moveFront(modalId);
}

function onBaseAppFocus() {
  if (!isModalActive) return;

  desktop.activeApp = modalId;
  windows.moveFront(modalId);
}

onMounted(() => {
  // apps.apps["send-message-app"].onOpenClb();
  // onModalOpen();
});

function onCloseClick() {
  isModalActive = false;

  windows.remove(modalId);
  desktop.remove(modalId);
  windows.remove(myId);
  desktop.remove(myId);

  sendName.value = "";
  sendEmail.value = "";
  sendContent.value = "";
}

apps.apps[modalId] = {
  id: modalId,
  title: "Message Status",
  onOpenClb: onModalOpen,
  onCloseClb: onCloseClick,
  onFocusClb: () => {},
  onMinimizeClb: () => {},
  onMaximizeClb: () => {},
  windowPosition: { x: 0, y: 0 },
  windowSize: { width: 250, height: 120 },
  isToolbarActive: false,
};
</script>

<template>
  <Win95Application
    :id="myId"
    :icon="`images/win95/winrep-1.png`"
    :title="`Contanct Me`"
    :init-icon="{ position: { x: 20, y: 80 } }"
    :init-window="{
      position: { x: 5, y: 5 },
      size: { width: 350, height: 200 },
    }"
    :on-focus-clb="onBaseAppFocus"
  >
    <template #content>
      <div class="message-form-holder">
        <div class="sender-info-holder">
          <div class="input-holder">
            <span
              >Name:
              <span
                class="input-status"
                :style="{ display: sendName.length > 1 ? 'none' : 'inline' }"
                >*</span
              ></span
            >
            <Win95EditBox v-model="sendName"></Win95EditBox>
          </div>
          <div class="input-holder">
            <span
              >Email:
              <span
                class="input-status"
                :style="{
                  display: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(sendEmail)
                    ? 'none'
                    : 'inline',
                }"
                >*</span
              ></span
            >
            <Win95EditBox v-model="sendEmail"></Win95EditBox>
          </div>
        </div>
        <div class="content-holder">
          <span
            >Message:
            <span
              class="input-status"
              :style="{
                display: sendContent.length > 4 ? 'none' : 'inline',
              }"
              >*</span
            ></span
          >
          <Win95EditBox
            v-model="sendContent"
            :is-multiline="true"
          ></Win95EditBox>
        </div>
        <div class="button-holder">
          <div
            :class="`send-button win95-button ${
              (sendContent.length > 4 &&
                /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(sendEmail) &&
                sendName.length > 1) ||
              'disabled'
            }`"
            @click="onSendClick"
          >
            <div class="text-holder">Send</div>
          </div>
        </div>
      </div>
    </template>
  </Win95Application>
  <Win95Window
    :id="modalId"
    :is-resizable="false"
    :minimize-visible="false"
    :maximize-visible="false"
  >
    <template #content>
      <div class="modal-holder">
        <div style="flex-grow: 1; padding: 8px; font-size: 14px">
          {{ modalContent }}
        </div>
        <div style="display: flex; flex-direction: row-reverse">
          <div class="win95-button modal-button" @click="onCloseClick">
            <div style="transform: translate(0px, 2px)">Ok</div>
          </div>
        </div>
      </div>
    </template>
  </Win95Window>
</template>

<style scoped>
.message-form-holder {
  width: 100%;
  height: 100%;

  margin-top: 2px;

  display: flex;
  flex-direction: column;

  overflow: hidden;
}

.sender-info-holder {
  width: 100%;

  padding: 4px;
  box-sizing: border-box;

  display: flex;
  flex-direction: row;
}

.input-holder {
  min-height: 32px;
  display: flex;
  flex-direction: column;

  min-width: calc(50% - 4px);
  max-width: calc(50% - 4px);

  font-size: 12px;

  margin-right: 8px;
}

.content-holder {
  margin-top: 6px;
  font-size: 12px;
  width: 100%;
  flex-grow: 1;

  padding: 4px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.button-holder {
  height: 20px;
  width: 100%;
  margin: 4px;

  display: flex;
  flex-direction: row-reverse;

  padding-right: 20px;
  box-sizing: border-box;
}

.send-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60px;
}

.text-holder {
  font-size: 12px;
  transform: translate(0px, 1px);
  margin: 0 auto;
}

.input-status {
  color: red;
}

.modal-holder {
  width: 100%;
  height: 100%;
  padding: 4px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: center;
}

.modal-button {
  width: 60px;
  text-align: center;
  min-height: 18px;

  margin-right: 10px;
}
</style>
