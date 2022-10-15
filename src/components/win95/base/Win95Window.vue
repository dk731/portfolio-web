<script setup lang="ts">
const props = defineProps<{ icon: string }>();
</script>

<template>
  <div class="window-holder">
    <img class="application" :src="`images/win95/${props.icon}`" />
  </div>
</template>

<style scoped>
.window-holder {
  position: absolute;
}
</style>
