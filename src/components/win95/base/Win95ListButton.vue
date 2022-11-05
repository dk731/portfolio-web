<script lang="ts" setup>
const props = defineProps<{
  title?: string;
  icon?: string;
  onClickClb: () => void;
}>();

function onMouseEnter(e: MouseEvent) {
  (e as any).target.classList.add("active");
}

function onMouseLeave(e: MouseEvent) {
  (e as any).target.classList.remove("active");
}
</script>

<template>
  <div
    class="win95-list-button"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div
      class="icon-holder"
      :style="{ backgroundImage: `url(${props.icon})` }"
    ></div>
    <div class="title-holder">
      {{ props.title }}
    </div>
  </div>
</template>

<style scoped>
.win95-list-button {
  position: relative;
  width: 100%;

  box-sizing: border-box;
  padding-left: 6px;

  display: flex;
  flex-direction: row;
  align-items: center;
}

.win95-list-button.active {
  background-color: #0000a8;
  color: #ffffff;
}

.icon-holder {
  height: 100%;

  aspect-ratio: 1;
  background-size: 100%;
  background-repeat: no-repeat;

  margin-right: 6px;
}

.title-holder {
  font-size: 11px;

  transform: translate(0px, 2px);
}

.title-holder::first-letter {
  text-decoration: underline;
}
</style>
