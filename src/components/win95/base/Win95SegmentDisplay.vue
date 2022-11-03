<script lang="ts" setup>
const props = defineProps<{
  segments: number;
  value: string;
}>();

const SEGMENT_MAP = {
  0: ["a", "b", "c", "d", "e", "f"],
  1: ["b", "c"],
  2: ["a", "b", "g", "e", "d"],
  3: ["a", "b", "g", "c", "d"],
  4: ["f", "b", "g", "c"],
  5: ["a", "f", "g", "c", "d"],
  6: ["a", "f", "g", "e", "c", "d"],
  7: ["a", "b", "c"],
  8: ["a", "b", "c", "d", "e", "f", "g"],
  9: ["a", "b", "c", "d", "f", "g"],
  // Define letters?? (if needed)
  UNDEFINED: ["a", "g", "d"],
};

function getValueMask(val?: string): string {
  if (!val) return `url(/images/win95/segment/empty.png)`;
  if (val in SEGMENT_MAP == false) val = "UNDEFINED";

  return (SEGMENT_MAP as any)[val]
    .map((el: string) => `url(/images/win95/segment/${el}.png)`)
    .join(", ");
}
</script>

<template>
  <div
    class="win95-segment-display-holder"
    :style="{ width: `${props.segments * 13}px` }"
  >
    <div
      class="segment"
      v-for="(_, i) in props.segments"
      :style="{
        '--mask-img': getValueMask(
          props.value[props.value.length - props.segments + i]
        ),
      }"
    ></div>
  </div>
</template>

<style scoped>
.win95-segment-display-holder {
  display: flex;
  flex-direction: row;

  height: 23px;

  background-color: #000000;

  box-shadow: -1px -1px #85898d, 1px 1px #ffffff;
}

.segment {
  position: relative;

  width: 13px;
  height: 23px;

  background: repeating-conic-gradient(#a41455 0% 25%, #000000 0% 50%) 0px 0px /
    2px 2px;

  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;

  -webkit-mask-image: url(/images/win95/segment/a.png),
    url(/images/win95/segment/b.png), url(/images/win95/segment/c.png),
    url(/images/win95/segment/d.png), url(/images/win95/segment/e.png),
    url(/images/win95/segment/f.png), url(/images/win95/segment/g.png);

  mask-image: url(/images/win95/segment/a.png), url(/images/win95/segment/b.png),
    url(/images/win95/segment/c.png), url(/images/win95/segment/d.png),
    url(/images/win95/segment/e.png), url(/images/win95/segment/f.png),
    url(/images/win95/segment/g.png);
}

.segment:before {
  content: "";
  position: absolute;
  left: 0px;
  top: 0px;

  width: 100%;
  height: 100%;

  background: #ff0000;

  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;

  -webkit-mask-image: var(--mask-img);
  mask-image: var(--mask-img);
}
</style>
