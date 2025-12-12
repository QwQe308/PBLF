<script lang="ts">
export default {
  name: "FooterNavigation",
  props: {
    windowId: {
        type: String,
        required: true,
    },
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    isHidden: {
        type: Boolean,
        required: true,
    }
  },

  methods: {
    handleClick() {
        if (this.isHidden) {
            this.$emit('focus', this.windowId);
        } else {
            this.$emit('click', this.windowId); 
        }
    }
  },
  
  emits: ['click', 'focus']
};
</script>

<template>
  <button
    class="basic-button footer-navigation-block"
    @click="handleClick"
  >
    <img class="title-icon" :src="icon" draggable="false" />
    <span>{{ title }}</span>
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
  padding: 0 2px;
}

.title-icon{
  display: block;
  margin: auto 2px auto 0;
  height: 18px;
  width: 18px;
}
</style>