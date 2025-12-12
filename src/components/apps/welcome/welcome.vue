<script lang="ts">
import Window from "../../constructors/window.vue";

export default {
  // 组件名称为 "Welcome"，用于 appInfos.ts 中的 windowComponent
  name: "Welcome",
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

  emits: ["hide", "focus", "close", "createWindow"],

  methods: {
    openIE() {
      this.$emit("createWindow", "InternetExplorer");
    },

    openWindowSpawner() {
      this.$emit("createWindow", "WindowSpawner");
    },

    openFlappyBird() {
      this.$emit("createWindow", "FlappyBirdWindow");
    },
  },
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
    
    :canHide="false"
    :canFullscreen="false"
    :canClose="true"
    
    @hide="$emit('hide', windowId)"
    @focus="$emit('focus', windowId)"
    @close="$emit('close', windowId)"
  >
    <div class="welcome-window warpper">
      <div class="column full-width">
        <h1 class="font-Times-New-Roman">Welcome to <span class="bolder">Windows</span><span class="white thin margin-left-3">95</span></h1>
        <div class="row full-width">
          <div class="welcome-window-yellow-inner">
            <p class="bold font-17"><img class="tour" src="/resources/window-icons/tour.png" />您知道...</p>
            <p>要再次打开这个窗口，只需单击 “开始” 按钮，然后单击 “欢迎” 图标。</p>
          </div>
          <div class="column x-center">
            <button class="basic-button normal-size margin-bottom-10" @click="openIE"><span>体验IE</span></button>
            <button class="basic-button normal-size margin-bottom-10" @click="openWindowSpawner"><span>创建自定义窗口</span></button>
            <button class="basic-button normal-size margin-bottom-10" @click="openFlappyBird"><span>游玩Flappy Bird</span></button>
          </div>
        </div>
      </div>
    </div>
  </Window>
</template>

<style scoped>
.welcome-window{
  position: relative;
  margin: 0 0 20px 20px;
}

.welcome-window-yellow-inner{
  width: 500px;
  height: 290px;
  border: 2px inset #fff;
  background: #FDFCE8;
  color: #424242;
  box-shadow: -1px -1px #000;

  padding: 10px 80px;
}

.tour{
  width: 32px;
  margin-left: -47px;
  margin-right: 15px;
  transform: translateY(50%);
}
</style>