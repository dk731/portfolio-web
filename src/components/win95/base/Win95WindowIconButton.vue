<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";

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
const isPressed = ref<boolean>(false);
var wasPressed = false;

function onMouseEnter(e: MouseEvent) {
  if (props.disabled) return;
  if (wasPressed) isPressed.value = true;

  isHover.value = true;
}

function onMouseLeave(e: MouseEvent) {
  if (props.disabled) return;
  isHover.value = false;
  isPressed.value = false;
}

function onMouseDown(e: MouseEvent) {
  isPressed.value = true;
  wasPressed = true;
}
function onMouseUp(e: MouseEvent) {
  if (isPressed.value) props.onClick();

  isPressed.value = false;
  wasPressed = false;
}

onMounted(() => {
  window.addEventListener("mouseup", onMouseUp);
});
onUnmounted(() => {
  window.removeEventListener("mouseup", onMouseUp);
});
</script>

<template>
  <div
    :class="`win95-widnow-icon-button ${isHover ? 'hovered' : 'grayscale'} ${
      isPressed ? 'pressed' : ''
    }`"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @mousedown="onMouseDown"
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
  width: 50px;
}

.win95-widnow-icon-button.hovered.pressed {
  box-shadow: inset 1px 1px #85898d, inset -1px -1px #ffffff;
}

.win95-widnow-icon-button.hovered {
  box-shadow: inset 1px 1px #ffffff, inset -1px -1px #85898d;
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
