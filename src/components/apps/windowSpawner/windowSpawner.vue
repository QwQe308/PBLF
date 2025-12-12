<script lang="ts">
import Window from "../../constructors/window.vue";
import type { StyleRecord } from "../../../support/types";
import type { CustomWindowSpawnEvent } from "../../App.vue";

interface WindowToSpawnData {
  title: string;
  width: number | string;
  height: number | string;
  content: string;
  noHide: boolean;
  noFullscreen: boolean;
  noClose: boolean;
}

export default {
  name: "WindowSpawner",
  components: {
    Window,
  },
  
  props: {
    windowId: { type: String, required: true },
    index: { type: Number, required: true },
    layer: { type: Number, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    isHidden: { type: Boolean, required: true },
  },
  
  emits: [
    'hide',
    'createWindow', 
    'mousedown', 
    'close', 
    'spawnCustomWindow'
  ],
  
  data() {
    return {
      windowToSpawn: {
        title: "新窗口",
        width: 700 as number | string,
        height: 400 as number | string,
        content: "Hello World!",
        noHide: false,
        noFullscreen: false,
        noClose: false,
      } as WindowToSpawnData,
    };
  },

  computed: {
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
      
      const key = target.getAttribute("name") as keyof WindowToSpawnData;

      if (key === 'title' || key === 'content') {
        this.windowToSpawn[key] = value;
      } else if (key === 'width' || key === 'height') {
        this.windowToSpawn[key] = value;
      }
    },

    updateCheckbox(event: Event) {
      const target = event.target as HTMLInputElement;
      const value: boolean = target.checked;
      
      const key = target.getAttribute("name");
      
      if (key === 'noHide' || key === 'noFullscreen' || key === 'noClose') {
          this.windowToSpawn[key] = value;
      }
    },

    spawnWindow() {
      const width = Number(this.windowToSpawn.width);
      const height = Number(this.windowToSpawn.height);
      const title = this.windowToSpawn.title || "Spawned Window";
      
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
        canHide: !this.windowToSpawn.noHide,
        canFullscreen: !this.windowToSpawn.noFullscreen,
        canClose: !this.windowToSpawn.noClose,
      };

      this.$emit('spawnCustomWindow', "SpawnedWindow", payload);
    }
  }
};
</script>

<template>
  <Window
    :windowId="windowId"
    :index="index"
    :layer="layer"
    :title="title"
    :icon="icon"
    :isHidden="isHidden"

    :width="700"
    :height="400"
    
    :canHide="true"
    :canFullscreen="false"
    :canClose="true"

    :style="windowStyle"

    @hide="$emit('hide', windowId)"
    @mousedown="$emit('mousedown', $event)"
    @close="$emit('close', $event)"
    @createWindow="$emit('createWindow')"
  >
    <div class="column warpper">
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
.row {
  display: flex;
  width: 100%;
  justify-content: center; 
  align-items: center; 
}

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

.checkbox-container {
    height: 16px;
    width: 16px;
    display: inline-block;
}
</style>