<script lang="ts">
import { Vector } from "../../support/vector";
import type { ClassRecord, StyleRecord } from "../../support/types";

export default {
  name: "Window",
  props: {
    index: {
      type: Number,
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
    canHide: {
      type: Boolean,
      required: false,
      default: true
    },
    canFullscreen: {
      type: Boolean,
      required: false,
      default: true
    },
    canClose: {
      type: Boolean,
      required: false,
      default: true
    },
  },
  data() {
    return {
      position: new Vector(0, 0),
      dragging: false,
      recordedMousePosition: new Vector(0, 0),
      fullscreen: false,
      hidden: false,
    };
  },

  computed: {
    style(): StyleRecord {
      if (this.fullscreen) return {};

      return {
        transform: `translate(${
          (this.index % 10) * 20 + 60 + (this.index - (this.index % 10)) * 2
        }px, ${
          (this.index % 10) * 20 + 100 + (this.index - (this.index % 10)) * 5
        }px)`,
      };
    },

    class(): ClassRecord {
      return {
        fullscreen: this.fullscreen
      }
    }
  },

  methods: {
    startDrag(event: MouseEvent) {
      if (this.fullscreen) return;
      this.dragging = true;
      this.recordedMousePosition = new Vector(event.clientX, event.clientY);

      document.addEventListener("mousemove", this.drag);
      document.addEventListener("mouseleave", this.endDrag);
      document.addEventListener("mouseup", this.endDrag);
    },

    drag(event: MouseEvent) {
      if (!this.dragging || this.fullscreen) return;
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
      this.$emit("hide");
    },

    toggleFullscreen() {},

    close() {
      this.$emit("close");
    },
  },
};
</script>

<template>
  <div class="window" tabindex="0" :style="style" :class="class">
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
            v-if="canFullscreen && !fullscreen"
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
      <slot></slot>
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

.window.fullscreen {
  height: 100%;
  width: 100%;
  top: 0;
  left: -2px;
  transform: none;
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
}
</style>
