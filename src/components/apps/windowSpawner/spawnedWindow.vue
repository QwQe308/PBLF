<script lang="ts">
import Window from "../../constructors/window.vue";
import type { StyleRecord } from "../../../support/types";

// 定义 SpawnedWindow 特有的 Props 接口
export interface SpawnedWindowProps {
  content: string;
  dynamicWidth: number;
  dynamicHeight: number;
  canHide: boolean;
  canFullscreen: boolean;
  canClose: boolean;
}

export default {
  name: "SpawnedWindow",
  components: {
    Window,
  },
  
  // 必须显式声明所有 props 以满足 TS 检查
  props: {
    // 基础窗口状态 props (从 App.vue 接收)
    windowId: { type: String, required: true },
    index: { type: Number, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    positionX: { type: Number, required: true },
    positionY: { type: Number, required: true },
    isFullscreen: { type: Boolean, required: true },

    // Spawned Window 特有 props (从 App.vue 接收的 customProps)
    content: { type: String, required: true },
    dynamicWidth: { type: Number, required: true },
    dynamicHeight: { type: Number, required: true },
    canHide: { type: Boolean, required: true },
    canFullscreen: { type: Boolean, required: true },
    canClose: { type: Boolean, required: true },
  },
  
  // 显式声明所有需要转发的事件
  emits: [
    'createWindow', 
    'hide', 
    'focus', 
    'close', 
    'update:position', 
    'update:fullscreen'
  ],
  
  computed: {
    // 模仿原来的 style getter 来设置尺寸
    windowStyle(): StyleRecord {
      return {
        height: `${this.dynamicHeight}px`,
        width: `${this.dynamicWidth}px`,
      };
    },
    // 将 canHide, canFullscreen, canClose 反转，匹配 Window.vue 的 prop 名称
    canHideProp(): boolean {
        return this.canHide;
    },
    canFullscreenProp(): boolean {
        return this.canFullscreen;
    },
    canCloseProp(): boolean {
        return this.canClose;
    }
  }
};
</script>

<template>
  <Window
    :windowId="windowId"
    :index="index"
    :title="title"
    :icon="icon"
    
    :positionX="positionX"
    :positionY="positionY"
    :isFullscreen="isFullscreen"
    
    :canHide="canHideProp"
    :canFullscreen="canFullscreenProp"
    :canClose="canCloseProp"

    @hide="$emit('hide', $event)"
    @focus="$emit('focus', $event)"
    @close="$emit('close', $event)"
    @update:position="$emit('update:position', $event[0], $event[1], $event[2])" 
    @update:fullscreen="$emit('update:fullscreen', $event[0], $event[1])"
    @createWindow="$emit('createWindow')"
  >
    <div class="content" v-html="content" :style="windowStyle">
    </div>
  </Window>
</template>

<style scoped>
</style>