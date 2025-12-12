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
  <div class="warpper column">
    <div
      v-for="item in startMenuItems"
      :key="item.appId"
      class="start-navigation-block"
      @click="handleClick(item.appId)"
    >
      <div class="row y-center">
        <img :src="item.icon" draggable="false" />
        <span>{{ item.title }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.start-navigation-content {
  display: flex;
  flex-direction: column-reverse;
  background-color: #c3c3c3;
  padding: 2px;
  width: 200px;
}

.start-navigation-block {
  display: flex;
  flex-direction: row;
  padding: 10px;
  height: 50px;
  cursor: var(--pointer);
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
}
</style>
