<script lang="ts" setup>
import { useDesktopState } from "@/stores/Win95DesktopState";
import gsap from "gsap";
import { onMounted, onUnmounted } from "vue";

const dekstop = useDesktopState();

const quickDataList: { line: Number; key: string; value: string }[] = [
  { line: 3, key: "Name:", value: "DEMID" },
  { line: 4, key: "Age:", value: "20" },
  { line: 5, key: "Location:", value: "LATVIA/RIGA" },
  { line: 6, key: "Currently Studying:", value: "RTU" },
  { line: 7, key: "Pursuing Bachelors:", value: "EMBEDDED SYSTEMS" },
  { line: 8, key: "Graduation Year:", value: "2024" },
  {
    line: 9,
    key: "Currently Employed as:",
    value: "SOFTWARE ENGINEERE / DATA ANALYST",
  },
  {
    line: 10,
    key: "Currently Working on:",
    value: "HIGH PERFORMANCE TRADING SYSTEMS",
  },
];

onMounted(() => {
  const main_timeline = gsap.timeline({ paused: true });

  main_timeline
    .to("#line1", {
      text: {
        value: "Starting Portfolio...",
      },
      duration: 1,
      ease: "none",
    })
    .to("#line2", {
      text: {
        value: "Quick ABOUTME:",
      },
      duration: 0.3,
      delay: 0.5,
      ease: "none",
    });

  quickDataList.forEach((animate_frame) => {
    main_timeline
      .to(`#line${animate_frame.line}`, {
        text: {
          value: animate_frame.key,
        },
        duration: 0.5,
        delay: 0.2,
        ease: "none",
      })
      .to(`#line${animate_frame.line}_1`, {
        text: {
          value: animate_frame.value,
        },
        duration: 0.5,
        delay: 0.2,
        ease: "none",
      });
  });

  main_timeline.to("#line11", {
    text: {
      value: "Boot sequence finished",
    },
    duration: 1,
    ease: "none",
  });

  main_timeline.to("#line12", {
    text: {
      value: "Press a key to continue",
    },
    duration: 1,
    ease: "none",
  });

  main_timeline.play().then(() => {
    console.log("Animation finished");
    dekstop.storageState.booted = true;
  });
});

onUnmounted(() => {
  //
});
</script>

<template>
  <div class="win95-bootscreen-holder">
    <pre id="boot-text">
<span id="line1"/>

<span id="line2"/>
<span id="line3"/>                           <span id="line3_1"/>
<span id="line4"/>                            <span id="line4_1"/>
<span id="line5"/>                       <span id="line5_1"/>

<span id="line6"/>             <span id="line6_1"/>
<span id="line7"/>             <span id="line7_1"/>
<span id="line8"/>                <span id="line8_1"/>

<span id="line9"/>          <span id="line9_1"/>
<span id="line10"/>           <span id="line10_1"/>

<span id="line11"/>
<span id="line12"/>
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

.tab {
  display: inline-block;
  margin-left: 40px;
}

#boot-text {
  /* font-family: win95-non-bold; */
}
</style>
