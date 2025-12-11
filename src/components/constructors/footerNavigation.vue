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
    class="basic-button footer-navigation-item"
    :class="{ 
        'border-outset': isHidden, 
        'border-inset': !isHidden // 非隐藏时使用 inset 样式模拟按下
    }"
    @click="handleClick"
  >
    <img class="footer-item-icon" :src="icon" draggable="false" />
    <span class="footer-item-text">{{ title }}</span>
  </button>
</template>

<style scoped>
.footer-navigation-item {
  display: flex;
  max-width: 150px;
  min-width: 30px;
  height: 23px;
  margin: auto 2px;
  padding: 2px 4px;
  background-color: inherit;
  box-sizing: content-box;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  /* 基础样式继承自 basic-button */
}

/* 在 win95 风格中，非激活按钮是 outset，激活/聚焦按钮是 inset */
.border-outset {
    border-style: outset;
}
.border-inset {
    border-style: inset;
    box-shadow: inset 1px 1px #0a0a0a, inset -1px -1px #dfdfdf,
      inset 2px 2px #424242, inset -2px -2px #fff;
}


.footer-item-icon {
  height: 15px;
  width: 15px;
  margin: auto 4px auto 0;
}

.footer-item-text {
  display: block;
  margin: auto 0;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 1;
}
</style>