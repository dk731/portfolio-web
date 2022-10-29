<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    icon: string;
    title: string;
    onClick: () => void;

    disabled?: boolean;
  }>(),
  {
    disabled: true,
  }
);
</script>

<template>
  <div class="win95-widnow-icon-button">
    <div
      class="button-icon"
      :style="{ backgroundImage: `url(${props.icon})`, filter: `grey` }"
    ></div>
    <div class="button-title">{{ props.title }}</div>
  </div>
</template>

<style scoped>
.win95-widnow-icon-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;

  height: 100%;
  width: 40px;

  filter: gray;
  -webkit-filter: grayscale(1);
  filter: grayscale(1);
}

.button-icon {
  width: 32px;
  height: 32px;

  background-size: 100%;
}

.button-title {
  font-size: 12px;
  width: 100%;
  text-align: center;
}

.win95-widnow-icon-button:hover {
  filter: none;
  -webkit-filter: grayscale(0);
  filter: grayscale(0);
}
</style>
