<script lang="ts">
import Window from "../../constructors/window.vue";
import { GomokuApi, type Room } from "./api";

export default {
  name: "GomokuHub",
  components: { Window },
  props: {
    windowId: { type: String, required: true },
    index: { type: Number, required: true },
    layer: { type: Number, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    isHidden: { type: Boolean, required: true },
    // 假设通过某种方式传参进来，或者使用全局状态
    username: { type: String, default: "Guest" },
  },
  emits: ["hide", "focus", "close", "createWindow"],

  data() {
    return {
      rooms: [] as Room[],
      newRoomName: "",
    };
  },

  mounted() {
    this.refreshRooms();
  },

  methods: {
    async refreshRooms() {
      this.rooms = await GomokuApi.getRooms();
    },

    async createRoom() {
      if (!this.newRoomName) return;
      const res = await GomokuApi.createRoom(this.newRoomName);
      this.enterGame(res.roomId);
    },
 
    async joinRoom(roomId: string) {
      await GomokuApi.joinRoom(roomId);
      this.enterGame(roomId);
    },

    enterGame(roomId: string) {
      this.$emit("createWindow", "GomokuGame", { roomId: roomId });
      this.$emit("close", this.windowId); 
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
    :width="400"
    :height="300"
    canHide
    canClose
    @hide="$emit('hide', windowId)"
    @focus="$emit('focus', windowId)"
    @close="$emit('close', windowId)"
  >
    <div class="warpper column room-wrapper">
      <div class="toolbar">
        <input v-model="newRoomName" placeholder="新房间名" class="basic-input" />
        <button class="basic-button" @click="createRoom">创建房间</button>
        <button class="basic-button" @click="refreshRooms">刷新</button>
      </div>
      
      <div class="room-list">
        <div 
          v-for="room in rooms" 
          :key="room.id" 
          class="room-item"
          @dblclick="joinRoom(room.id)"
        >
          <img src="/resources/apps/gomoku/waiting.png" class="room-icon" />
          <span class="room-name">{{ room.name }}</span>
          <span class="room-status">({{ room.players }}/2)</span>
          <button class="basic-button small" @click="joinRoom(room.id)">加入</button>
        </div>
      </div>
    </div>
  </Window>
</template>

<style scoped>
.room-icon{
  width: 1em;
  height: 1em;
}

.room-status{
  margin-right: 4px;
}

.room-wrapper {
  padding: 10px;
  gap: 10px;
}

.toolbar {
  display: flex;
  gap: 5px;
}

.room-list {
  flex: 1;
  background: #fff;
  padding: 5px;
  overflow-y: scroll;
  border: 2px inset #dfdfdf;
}

.room-item {
  display: flex;
  align-items: center;
  padding: 4px;
  cursor: pointer;
  border-bottom: 1px dashed #ccc;
}

.room-item:hover {
  background-color: #000080;
  color: #fff;
}

.room-name {
  flex: 1;
  padding-left: 10px;
}

.small {
  padding: 2px 5px;
}
</style>