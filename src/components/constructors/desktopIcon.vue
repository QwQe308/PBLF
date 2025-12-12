<script lang="ts">
export default {
  name: "DesktopIcon",
  
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
    handleDoubleClick() {
      this.$emit("launch");
    },
  },
  
  emits: ['launch']
};
</script>

<template>
  <div class="desktop-icon-container" @click="handleDoubleClick"> 
    <img :src="icon" draggable="false" />
    <span>{{ title }}</span>
  </div>
</template>

<style scoped>
.desktop-icon-container {
  display: flex;
  flex-direction: column;
  height: 70px;
  width: 88px;
  font-size: 12px;
  color: #fffe;

  cursor: var(--pointer);
  user-select: none;
}

.desktop-icon-container img {
  height: 32px;
  width: 32px;
  margin: auto auto 3px auto;
}

.desktop-icon-container span {
  text-wrap-mode: nowrap; 
  margin: 0 auto auto auto;
}
</style>