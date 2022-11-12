<script lang="ts" setup>
import { onMounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    optionsList?: string[];
    onSubmitClb?: () => void;
    isMultiline?: boolean;
  }>(),
  { optionsList: [] as any, onSubmitClb: () => {}, isMultiline: false }
);

const emit = defineEmits(["update:modelValue"]);
const editRef = ref(null as any);

function onEditKeyPress(e: KeyboardEvent) {
  if (e.key != "Enter") return;

  e.preventDefault();
  (e.target as any).blur();
  props.onSubmitClb();
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

function onInputChange(e: Event) {
  emit("update:modelValue", (e.target as any).textContent);
}

onMounted(() => {
  editRef.value.textContent = props.modelValue;
});
</script>

<template>
  <div class="win95-edit-box-holder">
    <div
      spellcheck="false"
      class="edit-box"
      contenteditable="true"
      ref="editRef"
      @focus="onTextFocus"
      @blur="onTextBlur"
      @input="onInputChange"
      @keypress="onEditKeyPress"
      :style="{
        whiteSpace: props.isMultiline ? 'normal' : 'nowrap',
      }"
    ></div>
  </div>
</template>

<style scoped>
.win95-edit-box-holder {
  position: relative;
  display: flex;
  flex-direction: row;
  /* align-items: center; */

  box-shadow: 0.5px 0.5px 0 0.5px #ffffff, inset 1px 1px #85898d,
    inset -1px -1px #c0c7c8, inset 2px 2px #000000;
  background: #c0c7c8;

  width: 100%;
  height: 100%;
  /* height: 18px; */
  overflow: hidden;
}

.edit-box {
  font-size: 12px;
  transform: translate(0px, 4px);
  display: inline;
  width: 100%;
  text-overflow: ellipsis;

  margin-left: 5px;
}

.edit-box[contenteditable] {
  outline: 0px solid transparent;
}

.edit-box::selection {
  color: #ffffff;
  background: #0407a4;
}

.edit-box:hover {
  cursor: url("/cursors/text-cursor.cur"), auto;
}
</style>
