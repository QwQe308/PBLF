<script lang="ts">
import Window from "../../constructors/window.vue";

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
  
  props: {
    windowId: { type: String, required: true },
    index: { type: Number, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    isHidden: { type: Boolean, required: true },

    content: { type: String, required: true },
    dynamicWidth: { type: Number, required: true },
    dynamicHeight: { type: Number, required: true },

    canHide: { type: Boolean, required: true },
    canFullscreen: { type: Boolean, required: true },
    canClose: { type: Boolean, required: true },
  },
  
  emits: [
    'hide',
    'createWindow', 
    'focus', 
    'close', 
  ],
};
</script>

<template>
  <Window
    :windowId="windowId"
    :index="index"
    :title="title"
    :icon="icon"
    :isHidden="isHidden"
    
    :width="dynamicWidth"
    :height="dynamicHeight"

    :canHide="canHide"
    :canFullscreen="canFullscreen"
    :canClose="canClose"

    @hide="$emit('hide', $event)"
    @focus="$emit('focus', $event)"
    @close="$emit('close', $event)"
    @createWindow="$emit('createWindow')"
  >
    <div class="content" v-html="content">
    </div>
  </Window>
</template>

<style scoped>
</style>