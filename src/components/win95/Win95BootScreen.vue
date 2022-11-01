<script lang="ts" setup></script>

<template>
  <div class="win95-bootscreen-holder">
    <pre id="boot-text">
Starting Windows 95...

Quick ABOUTME:
Name:                           DEMID
Age:                            20
Location:                       LATVIA/RIGA

Currently studying:             RTU
Pursuing Bachelors:             EMBEDDED SYSTEMS
Graduation Year:                2024

Currently Working as:           SOFTWARE ENGINEERE / DATA ANALYST
Currently Working on:           HIGH PERFORMANCE TRADING SYSTEMS

Boot sequence finished
Press a key to continue
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
