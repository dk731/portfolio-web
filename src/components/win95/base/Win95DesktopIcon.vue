<script setup lang="ts">
const props = defineProps<{ icon: string }>();
</script>

<template>
  <div class="icon-holder">
    <img
      class="icon-image"
      draggable="false"
      :src="`images/win95/${props.icon}`"
    />
  </div>
</template>

<style scoped>
.icon-holder {
  position: relative;
}

.icon-image {
  width: 32px;
  height: 32px;
}
</style>
