<script lang="ts">
import Window from "../../constructors/window.vue";

export default {
  name: "InternetExplorer",
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
  data() {
    return {
      inputLink: "https://www.lingrui.club",
      iframeLink: "https://www.lingrui.club",
    };
  },

  methods: {
    loadPage(event: KeyboardEvent) {
      if (event.key !== "Enter") return;
      this.iframeLink = this.inputLink;
    },
  },
  emits: ["hide", "focus", "close", "createWindow"],
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

    :width="1200"
    :height="800"
    
    canHide
    canFullscreen
    canClose
    
    @hide="$emit('hide', windowId)"
    @focus="$emit('focus', windowId)"
    @close="$emit('close', windowId)"
    @createWindow="$emit('createWindow')"
  >
    <div class="column warpper">
      <div class="IE-navigation">
        <span>Address:</span>
        <input
          id="IE-input"
          type="string"
          class="basic-input IE-address-input"
          value="https://www.lingrui.club"
          @keydown="loadPage"
          v-model="inputLink"
        />
      </div>
      <iframe id="IE-inner" :src="iframeLink" class="IE-inner" />
    </div>
  </Window>
</template>

<style scoped>
.IE-navigation{
  display: flex;
  justify-items: center;
  margin-bottom: 2px;
}

.IE-address-input{
  margin-left: 2px;
  flex-grow: 1;
}

.IE-inner{
  flex-grow: 1;
}
</style>
