<script lang="ts" setup>
import { useInternerState } from "@/stores/Win95InternetAppState";
import Win95Application from "../base/Win95DesktopApplication.vue";

import { onMounted, ref } from "vue";
import Win95WindowIconButton from "../base/Win95WindowIconButton.vue";
import { useAppsState } from "@/stores/Win95AppsState";
import Win95EditableSelect from "../base/Win95EditableSelect.vue";

const apps = useAppsState();
const internetState = useInternerState();
const pageRef = ref<any>(null);
const pageStatus = ref<string>("");
const showPage = ref<boolean>(false);
const visibleUrl = ref<string>("");

var isLoading: boolean = false;

function onPageLoad(e: Event) {
  pageStatus.value = "Ready";
  isLoading = false;
}

function onApplicationClose() {
  internetState.forwardHistory = [];
  internetState.backHistory = [];
}

function loadPage(newUrl: string) {
  if (internetState.activeUrl == newUrl)
    pageRef.value.src = internetState.activeUrl;

  visibleUrl.value = newUrl;
  internetState.activeUrl = newUrl;
  isLoading = true;
  pageStatus.value = `Loading: ${internetState.activeUrl} ...`;
}

function onBackClick() {
  const newUrl = internetState.backHistory.pop();
  if (!newUrl) return;

  if (internetState.activeUrl)
    internetState.forwardHistory.push(internetState.activeUrl);

  loadPage(newUrl);
}

function onForwardClick() {
  const newUrl = internetState.forwardHistory.pop();
  if (!newUrl) return;

  if (internetState.activeUrl)
    internetState.backHistory.push(internetState.activeUrl);

  loadPage(newUrl);
}

function onStopClick() {
  if (!isLoading) return;

  pageStatus.value = `Stopped loading: ${internetState.activeUrl}`;
  internetState.activeUrl = undefined;
}

function onRefreshClick() {
  if (internetState.activeUrl) loadPage(internetState.activeUrl);
}

function onHomeClick() {
  if (internetState.activeUrl)
    internetState.backHistory.push(internetState.activeUrl);
  internetState.forwardHistory = [];

  loadPage("https://qwe.me/");
}

function onSearchClick() {
  if (internetState.activeUrl)
    internetState.backHistory.push(internetState.activeUrl);
  internetState.forwardHistory = [];
  internetState.activeUrl = visibleUrl.value;
}

function onPrintClick() {
  try {
    pageRef.value.contentWindow.print();
  } catch {}
}

function onMailClick() {
  console.log("mail");
}

// loadPage(`http://localhost:5173/`);
loadPage(`https://qwe.me/blog`);

onMounted(() => {
  apps.apps["the-internet-app"].onOpenClb();
});
</script>

<template>
  <Win95Application
    :id="`the-internet-app`"
    :icon="`images/win95/the-internet.png`"
    :title="`The Internet`"
    :init-icon="{ position: { x: 10, y: 140 } }"
    :init-window="{
      position: { x: 10, y: 10 },
      size: { width: 600, height: 400 },
    }"
    @close-clb="onApplicationClose"
  >
    <template #toolbar>
      <div class="toolbar-btn">File</div>
      <div class="toolbar-btn">Edit</div>
      <div class="toolbar-btn">View</div>
      <div class="toolbar-btn">Go</div>
      <div class="toolbar-btn">Favorites</div>
      <div class="toolbar-btn">Help</div>
    </template>
    <template #content>
      <div class="navigation-holder toolbar-border">
        <div class="panel-resize"></div>
        <div class="navigation-buttons">
          <Win95WindowIconButton
            :icon="`images/win95/back-icon.png`"
            :title="'Back'"
            :on-click="onBackClick"
            :disabled="internetState.backHistory.length == 0"
          ></Win95WindowIconButton>
          <Win95WindowIconButton
            :icon="`images/win95/forward-icon.png`"
            :title="'Forward'"
            :on-click="onForwardClick"
            :disabled="internetState.forwardHistory.length == 0"
          ></Win95WindowIconButton>
          <Win95WindowIconButton
            :icon="`images/win95/stop-icon.png`"
            :title="'Stop'"
            :on-click="onStopClick"
          ></Win95WindowIconButton>
          <Win95WindowIconButton
            :icon="`images/win95/refresh-icon.png`"
            :title="'Refresh'"
            :on-click="onRefreshClick"
          ></Win95WindowIconButton>
          <Win95WindowIconButton
            :icon="`images/win95/home-icon.png`"
            :title="'Home'"
            :on-click="onHomeClick"
          ></Win95WindowIconButton>
          <Win95WindowIconButton
            :icon="`images/win95/search-icon.png`"
            :title="'Search'"
            :on-click="onSearchClick"
          ></Win95WindowIconButton>
          <Win95WindowIconButton
            :icon="`images/win95/favorites-icon.png`"
            :title="'Favorites'"
            :disabled="true"
          ></Win95WindowIconButton>
          <Win95WindowIconButton
            :icon="`images/win95/print-icon.png`"
            :title="'Print'"
            :on-click="onPrintClick"
          ></Win95WindowIconButton>
          <Win95WindowIconButton
            :icon="`images/win95/font-size-icon.png`"
            :title="'Font'"
            :disabled="true"
          ></Win95WindowIconButton>
          <Win95WindowIconButton
            :icon="`images/win95/mail-icon.png`"
            :title="'Mail'"
            :on-click="onMailClick"
          ></Win95WindowIconButton>
        </div>
        <div class="explorer-icon toolbar-border"></div>
      </div>
      <div class="address-holder toolbar-border">
        <div class="panel-resize"></div>
        <div class="address-str">Adress</div>
        <Win95EditableSelect
          v-model="visibleUrl"
          :options-list="[
            'https://google.com/',
            'https://qwe.me/',
            ...internetState.backHistory,
            ...internetState.forwardHistory,
          ]"
          :on-submit-clb="onSearchClick"
        ></Win95EditableSelect>
        <div style="max-width: 42px; min-width: 42px; margin-left: 4px"></div>
        <div class="additional-address toolbar-border">
          <div class="panel-resize"></div>
          <div class="address-str">Links</div>
        </div>
      </div>

      <iframe
        ref="pageRef"
        v-if="internetState.activeUrl"
        @load="onPageLoad"
        class="internet-content"
        :src="internetState.activeUrl"
      >
      </iframe>
    </template>
    <template #bottom-bar>
      <div style="flex-grow: 5.5; position: relative">
        <div class="page-status">{{ pageStatus }}</div>
      </div>
      <div style="flex-grow: 1.6"></div>
    </template>
    <template #bottom-bar-corner>
      <div class="document-icon"></div>
    </template>
  </Win95Application>
</template>

<style scoped>
.internet-content {
  position: relative;

  border: solid #87888f 1px;
  box-sizing: border-box;
  margin: 0;
  margin-top: 2px;

  left: 0px;
  top: 0px;

  height: 100%;
  width: 100%;

  z-index: 0;
}

.navigation-holder {
  display: flex;
  flex-direction: row;
  align-items: center;

  height: 43px;
  width: 100%;

  padding: 1px;
  box-sizing: border-box;

  overflow-x: hidden;
}

.toolbar-border {
  box-shadow: inset 0px 0px 0px 1px #87888f, inset 1px 1px 0px 1px #ffffff;
}

.navigation-holder * {
  margin-right: 10px;
}

.navigation-buttons {
  top: 0px;
  display: flex;
  flex-direction: row;
  align-items: center;

  flex-grow: 1;
  height: calc(100% - 1px);
  transform: translate(0px, 0.3px);
}

.toolbar-btn {
  font-size: 13px;
  margin-right: 8px;
}
.toolbar-btn::first-letter {
  text-decoration: underline;
}

.panel-resize {
  margin-left: 4px;
  margin-right: 10px;

  height: calc(100% - 8px);
  min-width: 4px;

  box-sizing: border-box;

  box-shadow: inset 1px 1px #ffffff, inset -1px -1px #85898d;

  background-image: linear-gradient(
    90deg,
    #ffffff 25%,
    #87888f 25%,
    #87888f 50%,
    #ffffff 50%,
    #ffffff 75%,
    #87888f 75%,
    #87888f 100%
  );
}

.explorer-icon {
  position: absolute;
  right: 0px;

  min-width: 44px;
  min-height: 43px;

  background-color: black;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: 32px 32px;
  margin: 0px;

  transform: translate(0px, 0px);

  box-sizing: border-box;

  background-image: url("/images/win95/explorer-icon.png");
}

.additional-address {
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;

  right: 0px;

  height: 100%;

  max-width: 42px;
  min-width: 44px;
  box-sizing: border-box;

  background: #c0c7c8;
}

.additional-address > .panel-resize {
  margin-left: 4px;
  margin-right: 4px;
}

.address-holder {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1px;
  box-sizing: border-box;

  height: 29px;
  width: 100%;

  transform: translate(0px, -1px);
  z-index: 1;
}

.address-str {
  font-size: 12px;
  transform: translate(0px, 1px);
  margin-right: 4px;
}

.document-icon {
  background-image: url("/images/win95/web_file-1.png");
  margin-left: 1px;
  width: 15px;
  height: 15px;
  background-size: 100%;
}

.page-status {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;

  padding-left: 4px;
  box-sizing: border-box;
  font-size: 12px;

  transform: translate(0px, 2px);
}
</style>
