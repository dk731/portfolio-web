<script setup lang="ts">
import { ref } from "vue";

// Number of divisions
const heightSize = ref<number>(26);
</script>

<template>
  <div class="taskbar-holder" :style="{ height: `${heightSize}px` }"></div>
</template>

<style scoped>
.taskbar-holder {
  position: relative;

  background-color: #c0c7c8;

  bottom: 0;
  left: 0;
  width: 100%;
}

.taskbar-holder:before {
  position: absolute;
  top: 1px;
  left: 0;

  background-color: #ffffff;

  height: 1px;
  width: 100%;
  content: "";
}
</style>
