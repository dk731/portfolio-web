<script lang="ts" setup>
const props = defineProps<{
  icon: string;
  title: string;
  onClick: () => void;
}>();
</script>

<template>
  <div class="win95-widnow-icon-button">
    <div
      class="button-icon"
      :style="{ backgroundImage: `url(${props.icon})` }"
    ></div>
    <div>{{ props.title }}</div>
  </div>
</template>

<style scoped>
.win95-widnow-icon-button {
  display: flex;
  flex-direction: column;

  height: 100%;
  width: 50px;
}

.button-icon {
  width: 20px;
  height: 20px;

  background-size: 100%;
}
</style>
