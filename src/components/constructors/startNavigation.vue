<script lang="ts">
import { AppInfos } from "../apps/appInfos"; // 导入 AppInfos

export default {
  name: "StartNavigation",

  data() {
    return {
      // 过滤出要在开始菜单中显示的项
      startMenuItems: Object.values(AppInfos).filter(
        (info) => info.showInStartMenu
      ),
    };
  },

  methods: {
    // 点击菜单项时，发送 app ID 给父组件 (App.vue)
    handleClick(appId: string) {
      this.$emit("launch-app", appId);
    },
  },

  emits: ["launch-app"], // 定义自定义事件
};
</script>

<template>
  <div class="start-navigation-content">
    <div
      v-for="item in startMenuItems"
      :key="item.appId"
      class="start-navigation-block"
      @click="handleClick(item.appId)"
    >
      <img :src="item.icon" draggable="false" />
      <span>{{ item.title }}</span>
    </div>
  </div>
</template>

<style scoped>
.start-navigation-content {
  /* 容器样式，与 App.vue 中的 #start-navigation 配合 */
  display: flex;
  flex-direction: column-reverse;
  background-color: #c3c3c3;
  padding: 2px;
  width: 200px;
}

.start-navigation-block {
  display: flex;
  flex-direction: row;
  padding: 3px 4px; /* 调整为更像菜单项的样式 */
  height: 20px;
  align-items: center;
  cursor: var(--pointer);
  width: 100%;
  box-sizing: border-box;
}

.start-navigation-block:hover {
  background-color: #0001ab;
  color: #fff;
}

.start-navigation-block img {
  display: block;
  height: 16px;
  width: 16px;
  margin-right: 4px;
}

.start-navigation-block > span {
  display: block;
  flex-grow: 1;
  white-space: nowrap;
}
</style>
