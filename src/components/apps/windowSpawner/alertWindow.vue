<script lang="ts">
import Window from "../../constructors/window.vue";

export default {
  name: "AlertWindow",
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

    content: { type: String, required: true },
  },

  emits: ["hide", "createWindow", "focus", "close"],
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

    :width="500"
    :height="200"

    canClose

    @hide="$emit('hide', $event)"
    @focus="$emit('focus', $event)"
    @close="$emit('close', $event)"
  >
    <div class="row">
      <img class="alert-error-img" src="/resources/window-icons/error.ico" />
      <span>{{ content }}</span>
    </div>
    <button
      class="basic-button bottom-center normal-size"
      @click="$emit('close', windowId)"
    >
      <span>OK</span>
    </button>
  </Window>
</template>

<style scoped>
.alert-error-img{
  display: block;
  width: 32px;
  height: 32px;
  margin-right: 16px;
}
</style>
