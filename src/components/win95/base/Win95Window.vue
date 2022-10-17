<script setup lang="ts">
const props = defineProps<{ icon: string }>();
</script>

<template>
  <div class="win95-window-holder">
    <img class="application" :src="`images/win95/${props.icon}`" />
  </div>
</template>

<style scoped>
.win95-window-holder {
  position: absolute;
}
</style>
