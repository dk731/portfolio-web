<script setup lang="ts">
import {
  Win95Cursor,
  useDesktopState,
  type DesktopPoint,
  type DesktopSize,
} from "@/stores/Win95DesktopState";
import { onMounted, onUnmounted, ref, useSlots } from "vue";

import { useTaskbarState } from "@/stores/Win95TaskbarState";
import { useWindowsState } from "@/stores/Win95WindowsState";
import { useAppsState, type AppMeta } from "@/stores/Win95AppsState";

enum ResizeState {
  UpperLeft,
  UpperMiddle,
  UpperRight,
  MiddleRight,
  BottomRight,
  BottomMiddle,
  BottomLeft,
  MiddleLeft,
  None,
}

const props = withDefaults(
  defineProps<{
    id: string;

    isResizable?: boolean;
    isDraggable?: boolean;
    isMaximizable?: boolean;

    minimizeVisible?: boolean;
    maximizeVisible?: boolean;
    closeVisible?: boolean;
  }>(),
  {
    minimizeVisible: true,
    maximizeVisible: true,
    closeVisible: true,
    isResizable: true,
    isDraggable: true,
    isMaximizable: true,
  }
);

const slots = useSlots();

const apps = useAppsState();
const taskbar = useTaskbarState();
const windows = useWindowsState();
const desktop = useDesktopState();

const windowRef = ref(null as any);

const mySize = () => apps.apps[props.id].windowSize;
const myPosition = () => apps.apps[props.id].windowPosition;

// Width of resize border
const RESIZE_WIDTH = 4;
const RESIZE_CORNER_SIZE = 22;

const isMaximized = ref<boolean>(false);
const isResizing = ref<boolean>(false);
const isDragged = ref<boolean>(false);
var resizeState: ResizeState = ResizeState.None;

function onMouseMove(e: MouseEvent) {
  if (desktop.activeApp != props.id) return;

  if (
    !isResizing.value &&
    !isDragged.value &&
    !isMaximized.value &&
    props.isResizable
  ) {
    const el = windowRef.value.getBoundingClientRect();

    const relativePosition = {
      x: e.clientX - el.left,
      y: e.clientY - el.top,
    };

    const sideCheck = relativePosition.x < RESIZE_WIDTH;
    const sideCheckInv = mySize().width - relativePosition.x < RESIZE_WIDTH;
    const topBotCheck = relativePosition.y < RESIZE_WIDTH;
    const topBotCheckInv = mySize().height - relativePosition.y < RESIZE_WIDTH;

    const cornerSideCheck = relativePosition.x < RESIZE_CORNER_SIZE;
    const cornerSideCheckInv =
      mySize().width - relativePosition.x < RESIZE_CORNER_SIZE;
    const cornerTopBottmoCheck = relativePosition.y < RESIZE_CORNER_SIZE;
    const cornerTopBottmoCheckInv =
      mySize().height - relativePosition.y < RESIZE_CORNER_SIZE;

    if (
      (sideCheck || sideCheckInv) &&
      !cornerTopBottmoCheck &&
      !cornerTopBottmoCheckInv
    ) {
      desktop.cursor = Win95Cursor.sideResize;
      resizeState = sideCheck
        ? ResizeState.MiddleLeft
        : ResizeState.MiddleRight;
    } else if (
      (topBotCheck || topBotCheckInv) &&
      !cornerSideCheck &&
      !cornerSideCheckInv
    ) {
      desktop.cursor = Win95Cursor.topBotResize;
      resizeState = topBotCheck
        ? ResizeState.UpperMiddle
        : ResizeState.BottomMiddle;
    } else if (
      (sideCheck && cornerTopBottmoCheck) ||
      (cornerSideCheck && topBotCheck) ||
      (sideCheckInv && cornerTopBottmoCheckInv) ||
      (cornerSideCheckInv && topBotCheckInv)
    ) {
      desktop.cursor = Win95Cursor.cornerResizeNeg;
      resizeState =
        cornerSideCheck && cornerTopBottmoCheck
          ? ResizeState.UpperLeft
          : ResizeState.BottomRight;
    } else if (
      (sideCheckInv && cornerTopBottmoCheck) ||
      (cornerSideCheckInv && topBotCheck) ||
      (sideCheck && cornerTopBottmoCheckInv) ||
      (cornerSideCheck && topBotCheckInv)
    ) {
      desktop.cursor = Win95Cursor.cornerResizePos;
      resizeState =
        cornerSideCheckInv && cornerTopBottmoCheck
          ? ResizeState.UpperRight
          : ResizeState.BottomLeft;
    } else {
      desktop.cursor = Win95Cursor.default;
      resizeState = ResizeState.None;
    }
  }
}

function onMouseCornerOver(e: MouseEvent) {
  const el = windowRef.value.getBoundingClientRect();

  onMouseMove({
    ...e,
    clientX: el.left + mySize().width,
    clientY: el.top + mySize().height,
  });

  e.stopPropagation();
}
function onWindowLeave(e: MouseEvent) {
  desktop.cursor = Win95Cursor.default;
}

var prevMousePos: DesktopPoint = { x: 0, y: 0 };
function onMouseDown(e: MouseEvent) {
  apps.apps[props.id].isToolbarActive = false;
  desktop.activeApp = props.id;
  windows.moveFront(props.id);

  if (resizeState != ResizeState.None) {
    isResizing.value = true;
    isDragged.value = false;
    prevMousePos = { x: e.clientX, y: e.clientY };
  }

  apps.apps[props.id].onFocusClb();
  e.stopPropagation();
}

function onDraggableMouseDown() {
  setTimeout(() => {
    if (props.isDraggable && desktop.activeApp == props.id) {
      isResizing.value = false;
      isDragged.value = true;
    }
  }, 10);
}

function resize(e: MouseEvent) {
  if (desktop.activeApp != props.id) return;

  const movement = {
    x: e.clientX - prevMousePos.x,
    y: e.clientY - prevMousePos.y,
  };

  const currentSize = mySize();
  const currentPosition = myPosition();

  const sizeDelta = { ...movement };
  const positionDelta = { ...movement };

  // Scale
  if (
    resizeState == ResizeState.UpperMiddle ||
    resizeState == ResizeState.BottomMiddle
  )
    sizeDelta.x = 0;
  if (
    resizeState == ResizeState.MiddleRight ||
    resizeState == ResizeState.MiddleLeft
  )
    sizeDelta.y = 0;
  if (
    resizeState == ResizeState.UpperLeft ||
    resizeState == ResizeState.MiddleLeft ||
    resizeState == ResizeState.BottomLeft
  )
    sizeDelta.x *= -1;
  if (
    resizeState == ResizeState.UpperLeft ||
    resizeState == ResizeState.UpperMiddle ||
    resizeState == ResizeState.UpperRight
  )
    sizeDelta.y *= -1;

  // Position
  if (
    resizeState == ResizeState.UpperMiddle ||
    resizeState == ResizeState.UpperRight ||
    resizeState == ResizeState.MiddleRight ||
    resizeState == ResizeState.BottomRight ||
    resizeState == ResizeState.BottomMiddle
  )
    positionDelta.x = 0;
  if (
    resizeState == ResizeState.MiddleLeft ||
    resizeState == ResizeState.MiddleRight ||
    resizeState == ResizeState.BottomRight ||
    resizeState == ResizeState.BottomMiddle ||
    resizeState == ResizeState.BottomLeft
  )
    positionDelta.y = 0;

  currentSize.width += sizeDelta.x;
  currentSize.height += sizeDelta.y;

  if (currentSize.width < 112) {
    currentSize.width = 112;
    positionDelta.x = 0;
  }
  if (currentSize.height < 65) {
    currentSize.height = 65;
    positionDelta.y = 0;
  }

  currentPosition.x += positionDelta.x;
  currentPosition.y += positionDelta.y;

  apps.apps[props.id].windowSize = currentSize;
  apps.apps[props.id].windowPosition = currentPosition;

  prevMousePos = { x: e.clientX, y: e.clientY };
}

function move(e: MouseEvent) {
  if (isMaximized.value) return;

  const currentPosition = myPosition();

  currentPosition.x += e.movementX;
  currentPosition.y += e.movementY;
}

function onMouseUp(e: MouseEvent) {
  isResizing.value = false;
  isDragged.value = false;
}

var beforeMaximizeState = {
  position: { ...myPosition() },
  size: { ...mySize() },
};

function onMaximizeButton(e: MouseEvent) {
  desktop.activeApp = props.id;

  if (!props.isMaximizable) return;

  e.stopPropagation();

  windows.moveFront(props.id);

  if (!isMaximized.value) {
    isMaximized.value = true;

    beforeMaximizeState = {
      position: { ...myPosition() },
      size: { ...mySize() },
    };

    apps.apps[props.id].windowPosition = { x: 0, y: 0 };
    apps.apps[props.id].windowSize = {
      width: desktop.size.width + 1,
      height: desktop.size.height + 1,
    };
  } else {
    isMaximized.value = false;

    apps.apps[props.id].windowPosition = beforeMaximizeState.position;
    apps.apps[props.id].windowSize = beforeMaximizeState.size;
  }

  apps.apps[props.id].onMaximizeClb();
}

function onMinimizeButton(e: MouseEvent) {
  desktop.activeApp = props.id;

  e.stopPropagation();

  windows.moveFront(props.id);

  apps.apps[props.id].onMinimizeClb();
}

function onCloseButton(e: MouseEvent) {
  desktop.activeApp = props.id;

  e.stopPropagation();

  windows.moveFront(props.id);

  apps.apps[props.id].onCloseClb();
}

function preventPropagation(e: MouseEvent) {
  e.stopPropagation();
}

// To determine proper window movement
function onGlobalMouseMove(e: MouseEvent) {
  if (isResizing.value) resize(e);
  else if (isDragged.value) move(e);
}

function onGlobalMouseDown(e: MouseEvent) {
  apps.apps[props.id].isToolbarActive = false;
}

var wasMouseUp = false;
function toolbarMouseDown(e: MouseEvent) {
  apps.apps[props.id].isToolbarActive = true;
  wasMouseUp = false;
  e.stopPropagation();
}

function toolbarMouseLeave(e: MouseEvent) {
  if (!wasMouseUp) apps.apps[props.id].isToolbarActive = false;
}

function toolbarMouseUp(e: MouseEvent) {
  var wasMouseUp = true;
}

onMounted(() => {
  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("mousemove", onGlobalMouseMove);
  document.addEventListener("mousedown", onGlobalMouseDown);
});
onUnmounted(() => {
  document.removeEventListener("mouseup", onMouseUp);
  document.removeEventListener("mousemove", onGlobalMouseMove);
  document.removeEventListener("mousedown", onGlobalMouseDown);
});

desktop.$subscribe(() => {
  if (!isMaximized.value) return;

  apps.apps[props.id].windowSize = {
    width: desktop.size.width + 1,
    height: desktop.size.height + 1,
  };
});
</script>

<template>
  <div
    v-if="desktop.isRunning(props.id)"
    :class="`win95-window-holder ${
      desktop.activeApp != props.id && 'input-innactive'
    }`"
    :style="{
      left: `${apps.apps[props.id].windowPosition.x}px`,
      top: `${apps.apps[props.id].windowPosition.y}px`,
      width: `${apps.apps[props.id].windowSize.width}px`,
      height: `${apps.apps[props.id].windowSize.height}px`,
      zIndex: windows.oppened.indexOf(props.id) * 10 + 10,
      display: windows.oppened.includes(props.id) ? 'flex' : 'none',
    }"
    @mousemove="onMouseMove"
    @mousedown="onMouseDown"
    @mouseleave="onWindowLeave"
    ref="windowRef"
  >
    <div
      class="window-upper-bar"
      @mousedown="onDraggableMouseDown"
      :style="{
        pointerEvents: 'all',
        background: desktop.activeApp == props.id ? `#0000a8` : `#87888f`,
      }"
    >
      <div
        v-if="apps.apps[props.id].icon"
        class="window-icon"
        :style="{ backgroundImage: `url(${apps.apps[props.id].icon})` }"
      />
      <div v-if="apps.apps[props.id].title" class="window-name">
        {{ apps.apps[props.id].title }}
      </div>
      <div class="v-spacer"></div>
      <div
        v-if="props.minimizeVisible"
        class="window-button win95-button"
        :style="{
          backgroundImage: `url(images/win95/minimize-icon.png)`,
          backgroundPosition: `3px 3px`,
        }"
        @mousedown="preventPropagation"
        @click="onMinimizeButton"
      />
      <div
        v-if="props.maximizeVisible"
        :class="`window-button win95-button ${
          props.isMaximizable || 'disabled'
        }`"
        :style="{
          backgroundImage: `url(images/win95/maximize${
            isMaximized ? '1' : ''
          }-icon.png)`,
          backgroundPosition: `3px 2px`,
          marginRight: `2px`,
        }"
        @mousedown="preventPropagation"
        @click="onMaximizeButton"
      />
      <div
        v-if="props.closeVisible"
        class="window-button win95-button"
        :style="{
          backgroundImage: `url(images/win95/close-icon.png)`,
          backgroundPosition: `4px 3px`,
        }"
        @mousedown="preventPropagation"
        @click="onCloseButton"
      />
    </div>
    <div class="window-content-holder">
      <div
        v-if="slots['toolbar']"
        class="window-toolbar-holder"
        @mousedown="toolbarMouseDown"
        @mouseleave="toolbarMouseLeave"
        @mouseup="toolbarMouseUp"
      >
        <slot name="toolbar"></slot>
      </div>
      <div v-if="slots['content']" class="window-content">
        <slot name="content"></slot>
      </div>
      <div v-if="slots['bottom-bar']" class="window-bottom-bar">
        <slot name="bottom-bar"></slot>

        <div
          class="window-resize-corner-holder"
          :style="{
            width: slots['bottom-bar'] == undefined ? '100%' : 'auto',
            flexGrow: slots['bottom-bar'] == undefined ? 0 : 1,
          }"
        >
          <slot name="bottom-bar-corner"></slot>
          <div
            class="widnow-resize-corner"
            @mousemove="onMouseCornerOver"
            :style="{
              zIndex: windows.oppened.indexOf(props.id) * 10 + 11,
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.win95-window-holder {
  position: absolute;

  display: flex;
  flex-direction: column;

  padding: 4px;
  box-sizing: border-box;
  background: #c0c7c8;
  box-shadow: inset 0px 0px 0px 1px #c0c7c8, inset -1px -1px 0px 1px #87888f,
    inset 1px 1px 0px 1px #ffffff;
}

.input-innactive > * {
  pointer-events: none;
}

.win95-window-holder:before {
  content: "";
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  border: solid 1px #000000;
  border-left: none;
  border-top: none;
}

.window-overlay {
  position: absolute;

  left: 0px;
  top: 0px;

  width: 100%;
  height: 100%;

  /* pointer-events: ; */
  z-index: 1000;
}

.window-upper-bar {
  position: relative;
  width: 100%;
  height: 18px;

  display: flex;
  flex-direction: row;
  align-items: center;

  box-sizing: border-box;

  padding: 1px;
  padding-left: 3px;
  padding-right: 3px;
}

.window-icon {
  min-width: 16px;
  min-height: 16px;
  background-size: 100%;

  margin-right: 3px;
}

.window-name {
  font-family: win95-bold;
  color: #ffffff;
  font-size: 11px;

  text-align: center;

  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  transform: translate(0px, -2px);
}

.window-content-holder {
  position: relative;
  display: flex;
  flex-direction: column;

  flex-grow: 1;

  max-width: 100%;
  max-height: 100%;

  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.window-toolbar-holder {
  display: flex;
  flex-direction: row;

  padding: 1px;

  box-sizing: border-box;

  width: 100%;
  min-height: 20px;

  z-index: 5000;
}

.window-content {
  position: relative;

  flex-grow: 1;

  overflow: hidden;
  margin-bottom: 2px;
}

.window-bottom-bar {
  display: flex;
  flex-direction: row;
  align-items: center;

  width: 100%;
  height: 16px;
}

.window-resize-corner-holder {
  position: relative;

  height: 100%;
}

.widnow-resize-corner {
  position: absolute;

  right: 0px;
  bottom: 0px;

  width: 12px;
  height: 12px;

  background-image: url(/images/win95/corner-scale.png);
}

.window-button {
  min-width: 15px;
  min-height: 13px;

  transform: translate(0px, -1px);

  margin-left: 1px;
  background-repeat: no-repeat;
}
</style>

<style>
.window-bottom-bar > * {
  box-shadow: inset 0px 0px 0px 0px #c0c7c8, inset -1px -1px 0px 0px #ffffff,
    inset 0px 0px 0px 1px #87888f;
  margin-left: 2px;
  height: 100%;
}

.window-bottom-bar > *:first-child {
  margin-left: 0px;
}
</style>
