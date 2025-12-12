// src/components/constructors/window.vue
<script lang="ts">
import { Vector } from "../../support/vector";
import type { ClassRecord, StyleRecord } from "../../support/types";

export default {
  name: "Window",
  props: {
    windowId: { type: String, required: true },
    index: { type: Number, required: true },
    layer: { type: Number, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    isHidden: { type: Boolean, required: true },

    width: {type: Number, required: true},
    height: {type: Number, required: true},

    canHide: { type: Boolean, required: false, default: false },
    canFullscreen: { type: Boolean, required: false, default: false },
    canClose: { type: Boolean, required: false, default: false },
  },
  data() {
    const offset = this.index % 10;
    const positionX = this.index * 3 + 160 + offset * 20;
    const positionY = this.index * 2 + 100 + offset * 12;

    return {
      dragging: false,
      recordedMousePosition: new Vector(0, 0),

      position: new Vector(positionX, positionY),
      isFullscreen: false,
    };
  },

  emits: ["hide", "focus", "close"],

  computed: {
    style(): StyleRecord {
      if (this.isFullscreen) return {};

      return {
        width: this.isFullscreen ? "" : `${this.width}px`,
        height: this.isFullscreen ? "" : `${this.height}px`,
        transform: `translate(${this.position.x}px, ${this.position.y}px)`,
        zIndex: (this.layer + 100).toString(),
      };
    },

    class(): ClassRecord {
      return {
        fullscreen: this.isFullscreen,
        hidden: this.isHidden,
      };
    },
  },

  methods: {
    focus() {
      this.$emit("focus", this.windowId);
    },

    startDrag(event: MouseEvent) {
      this.focus();
      if (this.isFullscreen) return;

      this.dragging = true;
      this.recordedMousePosition = new Vector(event.clientX, event.clientY);

      document.addEventListener("mousemove", this.drag);
      document.addEventListener("mouseleave", this.endDrag);
      document.addEventListener("mouseup", this.endDrag);
    },

    drag(event: MouseEvent) {
      if (!this.dragging || this.isFullscreen) return;

      const NewMousePosition = new Vector(event.clientX, event.clientY);
      const DeltaPosition = NewMousePosition.sub(this.recordedMousePosition);

      this.position = this.position.add(DeltaPosition);

      this.recordedMousePosition = NewMousePosition;
    },

    endDrag() {
      this.dragging = false;

      document.removeEventListener("mousemove", this.drag);
      document.removeEventListener("mouseleave", this.endDrag);
      document.removeEventListener("mouseup", this.endDrag);
    },

    hide() {
      this.$emit("hide", this.windowId);
    },

    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen;
    },

    close() {
      this.$emit("close", this.windowId);
    },
  },
};
</script>

<template>
  <div class="window" tabindex="0" :style="style" :class="class" @mousedown="focus">
    <div class="window-warpper">
      <div class="window-header" @mousedown="startDrag">
        <div class="left">
          <span class="window-title" id="window-title">
            <img class="title-icon" :src="icon" /> {{ title }}
          </span>
        </div>
        <div class="right">
          <div v-if="canHide" id="hide" @click="hide">
            <img
              class="window-icon basic-button"
              src="/resources/window-icons/minimize.svg"
              draggable="false"
            />
          </div>
          <div
            v-if="canFullscreen && !isFullscreen"
            id="fullscreen"
            class="fullscreen-toggler"
            @click="toggleFullscreen"
          >
            <img
              class="window-icon basic-button"
              src="/resources/window-icons/fullscreen.svg"
              draggable="false"
            />
          </div>
          <div
            v-else-if="canFullscreen"
            id="resumeFullscreen"
            class="fullscreen-toggler"
            @click="toggleFullscreen"
          >
            <img
              class="window-icon basic-button"
              src="/resources/window-icons/fullscreen-resume.svg"
              draggable="false"
            />
          </div>
          <div v-if="canClose" id="close" @click="close">
            <img
              class="window-icon basic-button"
              src="/resources/window-icons/close.svg"
              draggable="false"
            />
          </div>
        </div>
      </div>
      <div class="window-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.window {
  position: absolute;
  top: 0;
  left: 0;

  border-width: 2px;
  border-style: outset;
  border-color: buttonface;
  border-right-color: #424242;
  border-bottom-color: #424242;

  background-color: #c2c7ca;

  border: solid #c0c0c0 3px;
  box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf,
    inset -2px -2px grey, inset 2px 2px #fff;

  padding: 0px 2px;
  box-sizing: content-box;

  will-change: transform;
}

.window.hidden {
  visibility: hidden;
}

.window.fullscreen {
  height: 100% !important;
  width: 100% !important;
  top: 0 !important;
  left: -2px !important;
  transform: none !important;
  z-index: 999999 !important;
}

.window-warpper {
  display: flex;
  flex-direction: column;
  height: inherit;
  width: inherit;
  position: relative;
}

.window-header {
  display: flex;
  flex-direction: row;
  background-color: #0001ab;
  color: #fff;
  width: 100%;
  margin: 0 auto;
  height: 20px;
}

.window-title {
  display: flex;
  margin: auto 0 auto 3px;
  text-align: center;
}

.title-icon {
  display: block;
  margin: auto 2px auto 0;
  height: 18px;
  width: 18px;
}

.window-header > .left {
  display: flex;
  flex-direction: row;
  margin: auto auto auto 0;
}

.window-header > .right {
  display: flex;
  flex-direction: row;
  margin: auto 0 auto auto;
}

.window-header img {
  display: block;
  height: 16px;
  width: 16px;
  margin: auto 2px;
  cursor: var(--pointer);
}

.window-content {
  display: flex;
  position: relative;
  flex-grow: 1;
  margin: 10px;
  overflow: hidden;
  min-width: 200px;
  min-height: 100px;
}
</style>
