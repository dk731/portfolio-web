<script lang="ts" setup>
import { useAppsState } from "@/stores/Win95AppsState";
import { onMounted, ref } from "vue";
import Win95Application from "../base/Win95DesktopApplication.vue";
import Win95EditBox from "../base/Win95EditBox.vue";
import axios from "axios";

const apps = useAppsState();

const sendName = ref<string>("");
const sendEmail = ref<string>("");
const sendContent = ref<string>("");

function onSendClick(e: MouseEvent) {
  if (
    !(
      sendContent.value.length > 4 &&
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(sendEmail.value) &&
      sendName.value.length > 1
    )
  )
    return;

  axios
    .post("/api/send_message", {
      name: sendName.value,
      email: sendEmail.value,
      content: sendContent.value,
    })
    .then((res) => {
      if (res.status == 200) console.log("succ");
    });
}

onMounted(() => {
  apps.apps["send-message-app"].onOpenClb();
});
</script>

<template>
  <Win95Application
    :id="`send-message-app`"
    :icon="`images/win95/winrep-1.png`"
    :title="`Contanct Me`"
    :init-icon="{ position: { x: 80, y: 20 } }"
    :init-window="{
      position: { x: 50, y: 50 },
      size: { width: 350, height: 200 },
    }"
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
  height: 30px;
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
</style>
