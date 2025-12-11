<script lang="ts">
import Window from "../../constructors/window.vue";

export default {
  name: "InternetExplorer",
  components: {
    Window,
  },

  props: {
    index: {
      type: Number,
      required: true,
    },
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
};
</script>

<template>
  <Window
    :index="index"
    title="Internet Explorer"
    icon="/resources/desktop-icons/internet-explorer.ico"
    @hide="handleHide"
  >
    <div class="window-content column">
      <div class="IE-navigation">
        <span>Address:</span>
        <input
          id="IE-input"
          type="string"
          class="basic-input IE-address-input"
          value="https://www.lingrui.club"
          v-keydown="loadPage"
          v-model="inputLink"
        />
      </div>
      <iframe id="IE-inner" :src="iframeLink" class="IE-inner" />
    </div>
  </Window>
</template>

<style scoped>
.IE-navigation {
  display: flex;
  justify-items: center;
  margin-bottom: 2px;
}

.IE-address-input {
  flex-grow: 1;
}

.IE-inner {
  flex-grow: 1;
}
</style>
