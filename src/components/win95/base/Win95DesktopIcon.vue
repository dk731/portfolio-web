<script setup lang="ts">
const props = defineProps<{ icon: string }>();
</script>

<template>
  <div class="win95-desktop-icon-holder">
    <div
      class="icon-image"
      draggable="false"
      :style="{ backgroundImage: `url(${props.icon})` }"
    />
  </div>
</template>

<style scoped>
.win95-desktop-icon-holder {
  position: relative;
}

.icon-image {
  width: 32px;
  height: 32px;

  background-size: 100%;
}
</style>
