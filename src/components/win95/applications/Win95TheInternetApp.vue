<script lang="ts" setup>
import { useInternerState } from "@/stores/Win95InternetAppState";
import Win95Application from "../base/Win95DesktopApplication.vue";

import { onMounted, ref } from "vue";
import Win95WindowIconButton from "../base/Win95WindowIconButton.vue";

const internetState = useInternerState();

const isValidPage = ref<boolean>(true);

internetState.activeUrl = "https://google.com/";

function onPageLoad(e: Event) {
  internetState.historyState.push(internetState.activeUrl!);
}

function onApplicationClose() {
  internetState.historyState = [];
}

function onBackClick() {
  console.log("back");
}
</script>

<template>
  <Win95Application
    :id="`the-internet-app`"
    :icon="`images/win95/the-internet.png`"
    :title="`The Internet`"
    :init-icon="{ position: { x: 10, y: 140 } }"
    :init-window="{
      position: { x: 50, y: 50 },
      size: { width: 300, height: 150 },
    }"
    @close-clb="onApplicationClose"
  >
    <template #toolbar>
      <div>123</div>
    </template>
    <template #content>
      <div class="navigation-buttons">
        <Win95WindowIconButton
          :icon="`images/win95/the-internet.png`"
          :title="'BACL'"
          :on-click="onBackClick"
        ></Win95WindowIconButton>
      </div>
      <div>123</div>
      <iframe
        v-if="internetState.activeUrl && isValidPage"
        @load="onPageLoad"
        class="internet-content"
        :src="internetState.activeUrl"
      >
        <script type="text/javascript"></script>
      </iframe>
      <div v-else-if="internetState.activeUrl && !isValidPage">
        <div>This page could not be previewed :(</div>
      </div>
    </template>
    <template #bottom-bar>
      <div>123</div>
    </template>
  </Win95Application>
</template>

<style scoped>
.internet-content {
  position: relative;

  border: none;
  margin: 0;
  margin-top: 2px;

  left: 0px;
  top: 0px;

  height: 100%;
  width: 100%;
}

.navigation-buttons {
  display: flex;
  flex-direction: row;
  height: 40px;
  width: 100%;
}
</style>
