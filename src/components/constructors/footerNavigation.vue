<script lang="ts">
export default {
  name: "footerNavigation",

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
    toggleWindowHide() {
      this.$emit("toggleWindowHide");
    },
  },
};
</script>

<template>
    <button class="basic-button footer-navigation-block" @click="toggleWindowHide">
      <img class="title-icon" :src="icon" /><span>{{ title }}</span>
    </button>
</template>

<style scoped>
.footer-navigation-block {
  display: flex;
  width: 200px;
  height: 25px;
  flex-shrink: 1;
  margin: auto 3px;
  text-overflow: ellipsis;
  overflow: hidden;
  flex-wrap: nowrap;
  text-wrap-mode: nowrap;
  font-family: var(--font-Sans-Serif);
  font-size: 14px;
}

.title-icon {
  display: block;
  margin: auto 2px auto 0;
  height: 18px;
  width: 18px;
}
</style>
