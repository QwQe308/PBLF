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
    playerId: { type: String, required: true },
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
    console.log("test2", this.playerId)
  },

  methods: {
    async refreshRooms() {
      let data = await GomokuApi.getRooms();
      if (data === "notLogin") {
        this.$emit("createWindow", "GomokuLogin");
        this.$emit("close", this.windowId);
        return;
      }
      this.rooms = data;
    },

    async createRoom() {
      if (!this.newRoomName) return;
      const response = await GomokuApi.createRoom(this.newRoomName);
      if (response === "failed") return;
      this.enterGame(response.id, response.name);
    },

    async joinRoom(roomId: string) {
      const response = await GomokuApi.joinRoom(roomId);
      if (response === "failed") return;
      let roomData = this.getRoomDataWithId(roomId)
      if(roomData === undefined){
        window.alert("加入房间时产生了一个错误!<br>错误信息: 房间列表中未找到对应的房间.")
        return
      }
      this.enterGame(roomId, roomData.name);
    },

    getRoomDataWithId(roomId: string): Room{
      return this.rooms.filter(room => room.id === roomId)[0]
    },

    enterGame(roomId: string, roomName: string) {
      this.$emit("createWindow", "GomokuGame", {
        roomId: roomId,
        roomName: roomName,
        playerId: this.playerId,
      });
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
        <input
          v-model="newRoomName"
          placeholder="新房间名"
          class="basic-input"
        />
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
          <button class="basic-button small" @click="joinRoom(room.id)">
            加入
          </button>
        </div>
      </div>
    </div>
  </Window>
</template>

<style scoped>
.room-icon {
  width: 1em;
  height: 1em;
}

.room-status {
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
  border-bottom: 1.5px dashed #ccc;
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
