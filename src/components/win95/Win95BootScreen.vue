<script lang="ts" setup>
import {
  useDesktopState,
  Win95Cursor,
  type DesktopStorageState,
} from "@/stores/Win95DesktopState";
import gsap from "gsap";
import moment from "moment-timezone";
import { defineSSRCustomElement, onMounted, onUnmounted } from "vue";

const dekstop = useDesktopState();

const quickDataList: { line: number; key: string; value: string }[] = [
  { line: 3, key: "Name:", value: "DEMID" },
  {
    line: 4,
    key: "Age:",
    value: moment
      .tz("Europe/Riga")
      .diff(
        moment.tz({ year: 2002, month: 6, day: 21 }, "Europe/Riga"),
        "years"
      )
      .toString(),
  },
  { line: 5, key: "Location:", value: "LATVIA / RIGA" },
  { line: 6, key: "Studying At:", value: "RTU" },
  { line: 7, key: "Pursuing Bachelors:", value: "EMBEDDED SYSTEMS" },
  { line: 8, key: "Graduation Year:", value: "2024" },
  {
    line: 9,
    key: "Employed as:",
    value: "SOFTWARE ENGINEERE / DATA ANALYST",
  },
  {
    line: 10,
    key: "Working on:",
    value: "HIGH PERFORMANCE TRADING SYSTEMS",
  },
];

var cursorInterval: number;
var activeCursor: Element | undefined;
var bootFinished: boolean = false;
var hasPressed: boolean = false;
var main_timeline: gsap.core.Timeline;

function updateCursor(cursorId: string) {
  const currentCursor = document.querySelector(`#${cursorId}`)!;
  const prevCursor = activeCursor;

  activeCursor = currentCursor;
  prevCursor?.classList.remove("active");
}

async function onFinishClb() {
  if (!bootFinished || hasPressed) return;

  localStorage.setItem(
    "win95State",
    JSON.stringify({ booted: true } as DesktopStorageState)
  );

  hasPressed = true;
  dekstop.cursor = Win95Cursor.loading;
  await new Promise((r) => setTimeout(r, 1000));
  document.querySelector(".clear-canvas")?.classList.add("active");
  await new Promise((r) => setTimeout(r, 1000));
  new Audio("/sounds/startup_sound.wav").play();
  await new Promise((r) => setTimeout(r, 1000));
  setTimeout(() => (dekstop.cursor = Win95Cursor.default), 2000);
  dekstop.storageState.booted = true;
}

function playBootSequence() {
  main_timeline = gsap.timeline({ paused: true });

  // main_timeline.timeScale(10);

  document.addEventListener("keypress", onFinishClb);
  document.addEventListener("touchstart", onFinishClb);

  main_timeline.to("#line1", {
    text: {
      value: "Starting Portfolio...",
    },
    duration: 0.8,
    delay: 0.8,
    ease: "none",
  });

  main_timeline.to("#line2", {
    text: {
      value: "Quick ABOUTME:",
    },
    duration: 0.5,
    delay: 0.4,
    ease: "none",
    onStart: () => updateCursor("cursor2"),
  });

  quickDataList.forEach((animate_frame, i) => {
    main_timeline
      .to(`#line${animate_frame.line}`, {
        text: {
          value: animate_frame.key,
        },
        duration: 0.2,
        delay: i == 0 ? 0.3 : 0.1,
        ease: "none",
        onStart: () => updateCursor(`cursor${animate_frame.line}`),
      })
      .to(`#line${animate_frame.line}_1`, {
        text: {
          value: animate_frame.value,
        },
        duration: 0.4,
        delay: 0.3,
        ease: "none",
        onStart: () => updateCursor(`cursor${animate_frame.line}_1`),
      });
  });

  main_timeline.to("#line11", {
    text: {
      value: "Boot sequence finished",
    },
    duration: 0.8,
    ease: "none",
    delay: 0.8,
    onStart: () => updateCursor(`cursor11`),
  });

  main_timeline.to("#line12", {
    text: {
      value: "Press a key to continue",
    },
    duration: 0.6,
    delay: 0.6,
    ease: "none",
    onStart: () => updateCursor(`cursor12`),
  });

  main_timeline.play().then(() => {
    bootFinished = true;
  });
}

dekstop.$subscribe(() => {
  if (dekstop.needBoot && !main_timeline?.isActive()) playBootSequence();
});

onMounted(() => {
  cursorInterval = setInterval(() => {
    activeCursor?.classList.toggle("active");
  }, 200);
  updateCursor("cursor1");

  // Do not start boot sequence if no need
  if (!dekstop.needBoot) return;

  playBootSequence();
});

onUnmounted(() => {
  clearInterval(cursorInterval);

  document.removeEventListener("keypress", onFinishClb);
  document.removeEventListener("touchstart", onFinishClb);
});
</script>

<template>
  <div class="win95-bootscreen-holder">
    <div class="clear-canvas"></div>
    <pre id="boot-text">
<span id="line1"/><div class="cursor" id="cursor1" />

<span id="line2"/><div class="cursor" id="cursor2" />
<span id="line3"/><div class="cursor" id="cursor3" />               <span id="line3_1"/><div class="cursor" id="cursor3_1" />
<span id="line4"/><div class="cursor" id="cursor4" />                <span id="line4_1"/><div class="cursor" id="cursor4_1" />
<span id="line5"/><div class="cursor" id="cursor5" />           <span id="line5_1"/><div class="cursor" id="cursor5_1" />

<span id="line6"/><div class="cursor" id="cursor6" />        <span id="line6_1"/><div class="cursor" id="cursor6_1" />
<span id="line7"/><div class="cursor" id="cursor7" /> <span id="line7_1"/><div class="cursor" id="cursor7_1" />
<span id="line8"/><div class="cursor" id="cursor8" />    <span id="line8_1"/><div class="cursor" id="cursor8_1" />

<span id="line9"/><div class="cursor" id="cursor9" />        <span id="line9_1"/><div class="cursor" id="cursor9_1" />
<span id="line10"/><div class="cursor" id="cursor10" />         <span id="line10_1"/><div class="cursor" id="cursor10_1" />

<span id="line11"/><div class="cursor" id="cursor11" />
<span id="line12"/><div class="cursor" id="cursor12" />
    </pre>
  </div>
</template>

<style scoped>
.win95-bootscreen-holder {
  padding: 20px;

  width: 100%;
  height: 100%;

  background: black;

  color: #ffffff;

  line-height: 22px;
}

.clear-canvas {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;

  background-color: #57a8a8;
  opacity: 0;
}

.cursor {
  width: 0.8em;

  display: inline-block;

  border-bottom: solid 2px #ffffff;
  opacity: 0;
}

.active {
  opacity: 1;
}
</style>
