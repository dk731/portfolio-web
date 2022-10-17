<script setup lang="ts">
import type { DesktopPoint } from "@/stores/Win95DesktopState";
import type { StyleValue } from "vue";

// p1 - left, top
// p2 - right, bottom
const props = withDefaults(
  defineProps<{
    isFirst?: boolean;
    width: number;
    p1: DesktopPoint;
    p2: DesktopPoint;
  }>(),
  {
    isFirst: true,
  }
);
</script>

<template>
  <div
    class="win95-dotted-border"
    :style="
      props.isFirst
        ? {
            position: `absolute`,
            left: `${props[props.p1.x < props.p2.x ? 'p1' : 'p2'].x}px`,
            top: `${props[props.p1.y < props.p2.y ? 'p1' : 'p2'].y}px`,
            width: `${Math.abs(props.p2.x - props.p1.x)}px`,
            height: `${Math.abs(props.p2.y - props.p1.y)}px`,
          }
        : {
            position: `relative`,
            left: `0px`,
            top: `0px`,
            width: `100%`,
            height: `100%`,
          }
    "
  >
    <Win95DottedBorder
      v-if="props.width > 1"
      :width="props.width - 1"
      :isFirst="false"
      :p1="{ x: 0, y: 0 }"
      :p2="{ x: 0, y: 0 }"
    ></Win95DottedBorder>
  </div>
</template>

<style scoped>
.win95-dotted-border {
  border: 1px dotted #ff9191;
  box-sizing: border-box;
  mix-blend-mode: difference;

  pointer-events: none;
}
</style>
