<script lang="ts" setup>
import { ref } from "vue";

const props = withDefaults(
  defineProps<{
    icon: string;
    title: string;
    onClick?: () => void;

    disabled?: boolean;
  }>(),
  {
    onClick: () => {},
    disabled: false,
  }
);

const isHover = ref<boolean>(false);

function onMouseEnter(e: MouseEvent) {
  if (props.disabled) return;
  isHover.value = true;
}

function onMouseLeave(e: MouseEvent) {
  if (props.disabled) return;
  isHover.value = false;
}
</script>

<template>
  <div
    :class="`win95-widnow-icon-button ${isHover ? '' : 'grayscale'}`"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div
      class="button-icon"
      :style="{
        backgroundImage: `url(${props.icon})`,
        opacity: props.disabled ? `0.3` : `1.0`,
      }"
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

.grayscale {
  filter: gray;
  -webkit-filter: grayscale(1);
  filter: grayscale(1);
}
</style>
