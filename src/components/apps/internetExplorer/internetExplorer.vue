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
    title: { type: String, required: true },
    icon: { type: String, required: true },

    positionX: { type: Number, required: true },
    positionY: { type: Number, required: true },
    isFullscreen: { type: Boolean, required: true },
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

    handleHide() {
      this.$emit("hide");
    },
  },
  emits: ["hide", "focus", "close", "createWindow"],
};
</script>

<template>
  <Window
    :windowId="windowId"
    :index="index"
    :title="title"
    :icon="icon"
    :canHide="true"
    :canFullscreen="true"
    :canClose="true"
    :positionX="positionX"
    :positionY="positionY"
    :isFullscreen="isFullscreen"
    @hide="$emit('hide', windowId)"
    @focus="$emit('focus', windowId)"
    @close="$emit('close', windowId)"
    @createWindow="$emit('createWindow')"
  >
    <div class="column content">
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
.content {
  height: 800px;
  width: 1200px;
}

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
