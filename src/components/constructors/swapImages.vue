<script lang="ts">
import type { PropType } from "vue";
import { Interval } from "../../support/interval";
import type { StyleRecord } from "../../support/types";

export default {
  name: "SwapImages",
  props: {
    interval: {
      type: Number,
      required: true,
    },
    images: {
      type: Array as PropType<string[]>,
      required: true,
    },
    playing: {
      type: Boolean,
      required: false,
      default: true
    },
    style: {
      type: Object as PropType<StyleRecord>,
      required: false,
      default: {}
    },
  },

  data() {
    return {
      currentImageIndex: 0,
      imagesLength: 0,
      intervalUpdater: null as null | Interval,
    };
  },

  methods: {
    update() {
      if(!this.playing) return
      this.currentImageIndex = (this.currentImageIndex + 1) % this.imagesLength;
    },

    getStyle(index: number) {
      let baseStyle = {
        opacity: index === this.currentImageIndex ? 1 : 0,
      }
      Object.assign(baseStyle, this.style)
      if(this.style.opacity) baseStyle.opacity = (index === this.currentImageIndex ? this.style.opacity : 0) as number;
      return baseStyle;
    },
  },

  mounted() {
    this.imagesLength = this.images.length;

    this.intervalUpdater = new Interval(this.update.bind(this), this.interval);
    this.intervalUpdater.set()
  },
};
</script>

<template>
  <img
    v-for="(item, index) in images"
    :src="item"
    :style="getStyle(index)"
    class="swapImage"
    draggable="false"
  />
</template>

<style scoped>
.swapImage {
  transition: none !important;
}
</style>
