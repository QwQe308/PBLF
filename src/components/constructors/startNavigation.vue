<script lang="ts">
export default {
  name: "startNavigation",

  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },

  methods: {
    openWindow(){
      this.$emit("openWindow")
    },
  },
};
</script>

<template>
  <div class="start-navigation-block" @mousedown="openWindow">
    <div class="row y-center"><img :src="icon"><span>{{ title }}</span></div>
  </div>
</template>

<style scoped>
</style>
