<script lang="ts">
import Window from "../../constructors/window.vue";
import { GomokuApi } from "./api";

export default {
  name: "GomokuLogin",

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

  data() {
    return {
      // inputed datas
      username: "",
      password: "",
      message: "",
    };
  },

  methods: {
    // login
    async handleLogin() {
      // to be changed
      const response = await GomokuApi.login(this.username, this.password);
      console.log(response)
      if (response === "failed") {
        this.message = "用户名或密码错误。";
        return;
      }
      if (response === "noInput") {
        this.message = "请输入用户名和密码。";
        return;
      }
      if (response === "tooLong") {
        this.message = "用户名或密码过长。";
        return;
      }
      if (response === "error") {
        this.message = "发生了一个错误。";
        return;
      }
      const playerId = await GomokuApi.getProfile()
      console.log("test1", playerId)
      this.$emit("createWindow", "GomokuHub", {playerId: playerId});
      this.$emit("close", this.windowId);
    },

    // register
    async handleRegister() {
      const response = await GomokuApi.register(this.username, this.password);
      if (response === "failed") {
        this.message = "用户名已被注册。";
        return;
      }
      if (response === "noInput") {
        this.message = "请输入用户名和密码。";
        return;
      }
      if (response === "tooLong") {
        this.message = "用户名或密码过长。";
        return;
      }
      if (response === "error") {
        this.message = "发生了一个错误。";
        window.alert("进行网络连接时发生了一个错误! 请检查控制台.")
        return;
      }
      this.password = "";
      this.message = `用户 ${this.username} 注册成功! 请登录。`;
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
    :width="500"
    :height="250"
    canHide
    canClose
    @hide="$emit('hide', windowId)"
    @focus="$emit('focus', windowId)"
    @close="$emit('close', windowId)"
  >
    <div class="gomoku-warpper column">
      <div class="login-register-view column">
        <h2>五子棋 - 登录/注册</h2>
        <div class="form-group">
          <label for="username">用户名:</label>
          <input
            id="username"
            type="text"
            v-model="username"
            class="basic-input"
          />
        </div>
        <div class="form-group">
          <label for="password">密码:</label>
          <input
            id="password"
            type="password"
            v-model="password"
            class="basic-input"
          />
        </div>
        <div class="button-group">
          <button class="basic-button" @click="handleLogin">登录</button>
          <button class="basic-button" @click="handleRegister">注册</button>
        </div>
        <p class="message-text">{{ message }}</p>
      </div>
    </div>
  </Window>
</template>

<style scoped>
.gomoku-warpper {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

h2 {
  font-size: 16px;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 10px;
  text-align: center;
}

.login-register-view,
.room-list-view,
.game-view {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
}

.message-text {
  font-family: var(--font-ms-sans-serif);
  color: darkred;
  text-align: center;
  min-height: 20px;
}

.room-list-content,
.game-content {
  flex-grow: 1;
  min-height: 100px;
  padding: 10px;
  font-family: var(--font-ms-sans-serif);
  border: 1px solid #000;
  border-right-color: #fff;
  border-bottom-color: #fff;
  background-color: #fff;
  background-color: #fff;
}
</style>
