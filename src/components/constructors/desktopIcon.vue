<script lang="ts">
import { AppInfos } from "../apps/appInfos";
import type { appInfo } from "../apps/appInfos";

export default {
  name: "desktopIcon",

  props: {
    id: {
      type: String,
      required: true,
    },
  },

  computed: {
    info(): appInfo{
      return AppInfos[this.id]
    }
  },

  methods: {
    openWindow() {
      this.$emit("openWindow");
    },
  },
};
</script>

<template>
  <div class="desktop-icon-container" @click="openWindow">
    <img src="icon" />
    <span>{{ info!.title }}</span>
  </div>
</template>

<style scoped></style>
