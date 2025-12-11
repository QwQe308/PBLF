<script lang="ts">
import Window from "../../constructors/window.vue";
import type { StyleRecord } from "../../../support/types";

interface WindowToSpawnData {
  title: string;
  width: number | string;
  height: number | string;
  content: string;
  noHide: boolean;
  noFullscreen: boolean;
  noClose: boolean;
}

// 定义 WindowSpawner 传递给 App.vue 的数据结构
export interface CustomWindowSpawnEvent {
  title: string;
  width: number;
  height: number;
  content: string;
  icon: string;
  appId: string;
  canHide: boolean;
  canFullscreen: boolean;
  canClose: boolean;
}

export default {
  name: "WindowSpawner",
  components: {
    Window,
  },
  
  // 必须显式声明所有 props 以满足 TS 检查
  props: {
    windowId: { type: String, required: true },
    index: { type: Number, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    positionX: { type: Number, required: true },
    positionY: { type: Number, required: true },
    isFullscreen: { type: Boolean, required: true },
  },
  
  // 显式声明所有需要转发的事件，以及自身发出的 spawnCustomWindow 事件
  emits: [
    'createWindow', 
    'hide', 
    'focus', 
    'close', 
    'update:position', 
    'update:fullscreen',
    'spawnCustomWindow' // 自定义的创建窗口事件
  ],
  
  data() {
    // 模仿原始 JS 的 this.windowToSpawn 结构
    return {
      windowToSpawn: {
        title: "新窗口",
        width: 700 as number | string, // 初始值模仿原文件，注意类型可以是 string
        height: 400 as number | string,
        content: "Hello World!",
        noHide: false,
        noFullscreen: false,
        noClose: false,
      } as WindowToSpawnData,
    };
  },

  computed: {
    // 模仿原来的 style getter 来设置固定的窗口尺寸
    windowStyle(): StyleRecord {
        return {
          height: "400px",
          width: "700px",
        };
    }
  },

  methods: {
    updateInput(event: Event) {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      const value: string = target.value;
      
      // 提取 key 并断言为我们接口的 key
      const key = target.getAttribute("name") as keyof WindowToSpawnData;

      // 使用类型缩小 (Type Narrowing) 来确保赋值安全
      if (key === 'title' || key === 'content') {
        // 'title' 和 'content' 预期为 string
        this.windowToSpawn[key] = value;
      } else if (key === 'width' || key === 'height') {
        // 'width' 和 'height' 预期为 string | number。赋值 string 是安全的。
        this.windowToSpawn[key] = value;
      }
      // 其他键（如 noHide）在这里不处理
    },

    // 【修正后的 updateCheckbox】
    updateCheckbox(event: Event) {
      const target = event.target as HTMLInputElement;
      const value: boolean = target.checked;
      
      // 提取 key
      const key = target.getAttribute("name");
      
      // 使用类型缩小，只允许对布尔属性进行赋值
      if (key === 'noHide' || key === 'noFullscreen' || key === 'noClose') {
          // 在此块中，key 已经被 TypeScript 缩小为仅是布尔类型属性之一
          this.windowToSpawn[key] = value;
      }
    },

    // 模仿原来的 spawnWindow 逻辑和验证
    spawnWindow() {
      const width = Number(this.windowToSpawn.width);
      const height = Number(this.windowToSpawn.height);
      const title = this.windowToSpawn.title || "Spawned Window"; // 默认标题
      
      // 模仿原来的 AlertWindow.js 验证逻辑
      if (!width || width < 100 || width > 1000) {
        return alert("宽度应为100~1000的合法数字!");
      }
      if (!height || height < 100 || height > 1000) {
        return alert("宽度应为100~1000的合法数字!");
      }
      
      const payload: CustomWindowSpawnEvent = {
        title: title,
        width: width,
        height: height,
        content: this.windowToSpawn.content || "",
        icon: this.icon,
        appId: "spawnedWindow", // AppInfos 中注册的 SpawnedWindow ID
        canHide: !this.windowToSpawn.noHide,
        canFullscreen: !this.windowToSpawn.noFullscreen,
        canClose: !this.windowToSpawn.noClose,
      };

      // 发送自定义事件给 App.vue，触发创建自定义窗口
      this.$emit('spawnCustomWindow', payload);
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
    
    :canHide="true"
    :canFullscreen="true"
    :canClose="true"

    :style="windowStyle"

    @hide="$emit('hide', $event)"
    @focus="$emit('focus', $event)"
    @close="$emit('close', $event)"
    @update:position="$emit('update:position', $event[0], $event[1], $event[2])" 
    @update:fullscreen="$emit('update:fullscreen', $event[0], $event[1])"
    @createWindow="$emit('createWindow')"
  >
    <div class="window-content column">
      <div class="row x-center margin-bottom-2">
        <span class="y-center">生成的窗口名叫什么?</span>
      </div>
      <div class="row x-center margin-bottom-10">
        <input class="basic-input" type="text" placeholder="取个名吧" @input="updateInput" name="title" :value="windowToSpawn.title" />
      </div>
      <div class="row x-center margin-bottom-2">
        <span class="y-center">生成的窗口大小是多少? (单位:像素, 参考该窗口为700*400)</span>
      </div>
      <div class="row x-center margin-bottom-10">
        <input class="basic-input" type="number" placeholder="宽" @input="updateInput" name="width" :value="windowToSpawn.width" />
        <input class="basic-input" type="number" placeholder="高" @input="updateInput" name="height" :value="windowToSpawn.height" />
      </div>
      <div class="row x-center margin-bottom-2">
        <span class="y-center">生成的窗口内容是什么?</span>
      </div>
      <div class="row x-center margin-bottom-10">
        <textarea class="basic-text-area" placeholder="Hello World!" draggable="false" @input="updateInput" name="content" :value="windowToSpawn.content"></textarea>
      </div>
      <div class="row x-center">
        <span class="margin-right-2">不可最小化</span>
        <div class="checkbox-container margin-right-10">
          <input class="checkbox" type="checkbox" @change="updateCheckbox" name="noHide" :checked="windowToSpawn.noHide">
          <span></span>
        </div>
        <span class="margin-right-2">不可全屏</span>
        <div class="checkbox-container margin-right-10">
          <input class="checkbox" type="checkbox" @change="updateCheckbox" name="noFullscreen" :checked="windowToSpawn.noFullscreen">
          <span></span>
        </div>
        <span class="margin-right-2">不可关闭 (!慎重勾选)</span>
        <div class="checkbox-container margin-right-10">
          <input class="checkbox" type="checkbox" @change="updateCheckbox" name="noClose" :checked="windowToSpawn.noClose">
          <span></span>
        </div>
      </div>
      <button class="basic-button normal-size center" @click="spawnWindow"><span>生成窗口</span></button>
    </div>
  </Window>
</template>

<style scoped>
/* 模仿原始 JS 文件中的布局类 */
.window-content.column {
  margin: auto;
  flex-direction: column;
  align-items: center; 
  padding: 10px;
}
.row {
  display: flex;
  width: 100%;
  justify-content: center; 
  align-items: center; 
}
.row.margin-bottom-2 { margin-bottom: 2px; }
.row.margin-bottom-10 { margin-bottom: 10px; }

.basic-input {
    flex-grow: 1;
    margin: 0 5px;
    height: 20px;
}

.basic-input[name="width"], .basic-input[name="height"] {
    max-width: 100px;
}

.basic-text-area {
    flex-grow: 1;
    margin: 0 5px;
    min-height: 80px;
    resize: none;
}

.center { margin: 10px auto; } 

.margin-right-2 { margin-right: 2px; }
.margin-right-10 { margin-right: 10px; }
.checkbox-container {
    height: 16px;
    width: 16px;
    display: inline-block;
}
</style>