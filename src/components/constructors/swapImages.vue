<script lang="ts">
import type { PropType } from "vue";
import { Interval } from "../../support/interval";

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
    }
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
      return {
        opacity: index === this.currentImageIndex ? 1 : 0,
      };
    },
  },
  
  mounted() {
    this.intervalUpdater = new Interval(this.update.bind(this), this.interval);
    this.imagesLength = this.images.length;
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
