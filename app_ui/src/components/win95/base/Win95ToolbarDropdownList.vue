<script lang="ts" setup>
import { ref, useSlots, watch } from "vue";

const props = withDefaults(
  defineProps<{
    isMenuActive?: boolean;
  }>(),
  {
    isMenuActive: false,
  }
);

const slots = useSlots();

const dropdownVisible = ref<boolean>(false);

function onMouseEnter(e: MouseEvent) {
  dropdownVisible.value = props.isMenuActive;
}
function onMouseLeave(e: MouseEvent) {
  dropdownVisible.value = false;
}

function onMenuMouseDown(e: MouseEvent) {
  dropdownVisible.value = true;
}
</script>

<template>
  <div
    class="win95-toolbar-list-holder"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @mousedown="onMenuMouseDown"
  >
    <div :class="`toolbar-header ${dropdownVisible && 'active'}`">
      <div class="header-content">
        <slot name="header"></slot>
      </div>
    </div>
    <div v-if="dropdownVisible && 'dropdown' in slots" class="toolbar-dropdown">
      <slot name="dropdown"></slot>
    </div>
  </div>
</template>

<style scoped>
.win95-toolbar-list-holder {
  position: relative;
  font-size: 13px;
}

.toolbar-header {
  /* margin-right: 8px; */
  height: 100%;
  padding-left: 4px;
  padding-right: 4px;
}

.header-content::first-letter {
  text-decoration: underline;
}

.toolbar-header.active {
  background-color: #0000a8;
  color: #ffffff;
}

.header-content {
  transform: translate(0px, 3px);
}

.toolbar-dropdown {
  position: absolute;
  left: 0px;
  width: 127px;

  padding: 4px;

  background: #bfc6c7;
  box-shadow: inset 0px 0px 0px 1px #c0c7c8, inset -1px -1px 0px 1px #87888f,
    inset 1px 1px 0px 1px #ffffff;
}
</style>
