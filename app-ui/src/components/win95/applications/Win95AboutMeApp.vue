<script lang="ts" setup>
import { useAppsState } from "@/stores/Win95AppsState";
import { useDesktopState } from "@/stores/Win95DesktopState";
import { onMounted, ref } from "vue";
import Win95Application from "../base/Win95DesktopApplication.vue";
import { marked } from "marked";
import axios from "axios";

const apps = useAppsState();
const desktop = useDesktopState();

const contentRef = ref<HTMLElement>();
const aboutMeContent = ref<string>("");

const myId = "about-me-app";
var firstTimeFocus = true;
var initialOpen = true;

function onOpenClb() {
  if (initialOpen && !desktop.storageState.needAboutVisible) {
    apps.apps[myId].onMinimizeClb();
  } else {
    localStorage.setItem(
      "win95State",
      JSON.stringify({
        ...desktop.storageState,
        needAboutVisible: false,
      })
    );
  }
  initialOpen = false;

  if (firstTimeFocus) {
    apps.apps[myId].windowPosition = { x: 20, y: 20 };
    apps.apps[myId].windowSize = {
      width: desktop.size.width - 40,
      height: desktop.size.height - 40,
    };
  }
  firstTimeFocus = false;
}

axios
  .get("https://raw.githubusercontent.com/dk731/dk731/main/README.md")
  .then((res) => {
    aboutMeContent.value = aboutMeContent.value + marked.parse(res.data);
  });
axios.get("/markdown/about-me.md").then((res) => {
  aboutMeContent.value = marked.parse(res.data) + aboutMeContent.value;
});

onMounted(() => {
  setTimeout(apps.apps[myId].onOpenClb, 800);
});
</script>

<template>
  <Win95Application
    :id="myId"
    :icon="`images/win95/computer_explorer-4.png`"
    :title="`About Me`"
    :init-icon="{ position: { x: 20, y: 20 } }"
    :init-window="{
      position: { x: 0, y: 0 },
      size: { width: 0, height: 0 },
    }"
    @open-clb="onOpenClb"
    @focus-clb="onOpenClb"
  >
    <template #content>
      <div v-html="aboutMeContent" class="about-me-content"></div>
    </template>
  </Win95Application>
</template>

<style scoped>
.about-me-content {
  padding: 10px;
  width: 100%;
  height: 100%;

  box-sizing: border-box;
  user-select: text;

  overflow-y: auto;
}
</style>
