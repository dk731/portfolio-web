<script lang="ts" setup>
import { ref } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    optionsList?: string[];
    onSubmitClb?: () => void;
  }>(),
  { optionsList: [] as any, onSubmitClb: () => {} }
);

const emit = defineEmits(["update:modelValue"]);

// Dropdown button
const isActive = ref<boolean>(false);
const dropDownVisible = ref<boolean>(false);

function onEditKeyPress(e: KeyboardEvent) {
  if (e.key != "Enter") return;

  e.preventDefault();
  (e.target as any).blur();
  props.onSubmitClb();
}

function onMouseDown(e: MouseEvent) {
  if (!dropDownVisible.value) isActive.value = true;

  dropDownVisible.value = !dropDownVisible.value;
}
function onMouseUp(e: MouseEvent) {
  isActive.value = false;
}
function onMouseLeave(e: MouseEvent) {
  isActive.value = false;
}

function onTextFocus(e: FocusEvent) {
  const range = document.createRange();
  range.selectNodeContents(e.target as any);
  const sel = window.getSelection()!;
  sel.removeAllRanges();
  sel.addRange(range);
}

function onTextBlur(e: FocusEvent) {
  const sel = window.getSelection()!;
  sel.removeAllRanges();
}

function onVariantClick(newValue: string) {
  emit("update:modelValue", newValue);
  dropDownVisible.value = false;
  props.onSubmitClb();
}

function onInputChange(e: Event) {
  emit("update:modelValue", (e.target as any).textContent);
}
</script>

<template>
  <div class="win95-editable-select-holder">
    <div
      class="editable-value"
      contenteditable="true"
      @focus="onTextFocus"
      @blur="onTextBlur"
      @input="onInputChange"
      @keypress="onEditKeyPress"
    >
      {{ props.modelValue }}
    </div>
    <div
      :class="`dropdown-button ${isActive ? 'selected-dropdown' : ''}`"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
      @mouseleave="onMouseLeave"
    ></div>
    <div v-if="dropDownVisible" class="dropdown-menu">
      <div
        v-for="option in props.optionsList"
        class="selection-variant"
        @click="onVariantClick(option)"
      >
        <div class="variant-content">
          {{ option }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.win95-editable-select-holder {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;

  box-shadow: 0.5px 0.5px 0 0.5px #ffffff, inset 1px 1px #85898d,
    inset -1px -1px #c0c7c8, inset 2px 2px #000000;
  background: #c0c7c8;

  width: 100%;
  height: 18px;
}

.editable-value {
  flex-grow: 1;
  font-size: 12px;
  transform: translate(0px, 2px);

  margin-left: 4px;
}

.editable-value[contenteditable] {
  outline: 0px solid transparent;
}

.editable-value::selection {
  color: #ffffff;
  background: #0407a4;
}

.editable-value:hover {
  cursor: url("/cursors/text-cursor.cur"), auto;
}

.dropdown-button {
  height: calc(100% - 3px);
  min-width: 14px;

  transform: translate(0px, 0.5px);

  background-size: 100%;
  background-repeat: no-repeat;
  background-position: 0.5px 50%;
  margin-right: 1px;

  background-image: url("/images/win95/arrow-down.png");

  box-shadow: inset 1px 1px #ffffff, 0.5px 0.5px 0 0.5px #000000,
    1px 1px #87888f, inset -1px -1px #85898d;
}

.selected-dropdown {
  box-shadow: inset 1px 1px #87888f, 0.5px 0.5px 0 0.5px #87888f,
    1px 1px #87888f;
}

.dropdown-menu {
  position: absolute;

  display: flex;
  flex-direction: column;

  width: 100%;
  min-height: 5px;

  left: 0px;
  top: 20px;

  padding-top: 3px;

  box-sizing: border-box;
  border: solid #000000 1px;

  background: #ffffff;
}

.selection-variant {
  height: 16px;

  font-size: 12px;
  margin-left: 3px;

  box-sizing: border-box;
  padding: 1;
}

.variant-content {
  display: inline-block;
}
.selection-variant:hover > .variant-content {
  color: #ffffff;
  background: #0407a4;
  border: 1px dotted #ffff00;
}
</style>
