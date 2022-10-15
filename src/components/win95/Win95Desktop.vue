<script lang="ts" setup>
import { ref } from "vue";
import Win95AppIcon from "./base/Win95AppIcon.vue";
import moment from "moment";

const currentTime = ref<moment.Moment>(moment());
setInterval(() => (currentTime.value = moment()), 1000);
</script>

<template>
  <div class="win95-holder">
    <div class="desktop-holder">
      <Win95AppIcon icon="computer_explorer-4.png"></Win95AppIcon>
      <Win95AppIcon icon="computer_explorer-3.png"></Win95AppIcon>
      <Win95AppIcon icon="computer_explorer-5.png"></Win95AppIcon>
    </div>

    <div class="taskbar-holder">
      <div class="taskbar-drabble"></div>
      <div class="icons-holder">
        <div class="taskbar-icons-holder"></div>
        <div class="special-icons-holder">
          <img src="images/win95/loudspeaker_rays-1.png" />
          <div class="clock-icon">{{ currentTime.format("hh:mm A") }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.win95-holder {
  position: relative;
  width: 800px;
  height: 600px;

  display: flex;
  flex-direction: column;

  background-color: #57a8a8;

  font-family: "MS Sans Serif";
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

.icons-holder {
  height: 22px;
  width: 100%;

  display: flex;
  flex-direction: row;

  padding-top: 2px;
  padding-left: 2px;
  padding-right: 3px;

  box-sizing: border-box;
}

.icons-holder > div {
  height: 21px;

  display: flex;
  flex-direction: row;
}

.taskbar-icons-holder {
  width: 100%;

  /* background-color: red; */
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
}
</style>
