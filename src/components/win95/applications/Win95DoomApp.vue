<script lang="ts" setup>
import Win95Application from "../base/Win95DesktopApplication.vue";
</script>

<template>
  <Win95Application
    :id="`dos-doom-app`"
    :icon="`images/Doom-1-icon.png`"
    :title="`DOOM`"
    :init-icon="{ position: { x: 10, y: 80 } }"
    :init-window="{
      position: { x: 5, y: 5 },
      size: { width: 688, height: 428 },
    }"
    :is-resizable="false"
  >
    <template #content>
      <div class="dos-doom-holder">
        <iframe
          class="dos-doom"
          src="https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fdoom.jsdos?anonymous=1"
        >
          <div>123</div>
        </iframe>
      </div>
    </template>
  </Win95Application>
</template>

<style scoped>
.dos-doom-holder {
  margin-top: 2px;
  position: relative;
  left: 0px;
  top: 0px;

  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #000000;
}

.dos-doom {
  border: none;
  margin: 0;
  width: 100%;
  height: 100%;
}
</style>
