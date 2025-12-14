<script lang="ts">
import Window from "../../constructors/window.vue";
import { GomokuApi, type GameState } from "./api";

function usePolling(callback: () => void, interval: number) {
  let timer: any = null;
  const start = () => {
    timer = setInterval(callback, interval);
  };
  const stop = () => {
    if (timer) clearInterval(timer);
  };
  return { start, stop };
}

export default {
  name: "GomokuGame",
  components: { Window },
  props: {
    windowId: { type: String, required: true },
    index: { type: Number, required: true },
    layer: { type: Number, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    isHidden: { type: Boolean, required: true },
    roomId: { type: String, required: true },
    roomName: { type: String, required: true },
    playerId: { type: String, required: true },
  },
  emits: ["hide", "focus", "close", "createWindow"],

  data() {
    return {
      gameState: {
        board: Array(15)
          .fill(0)
          .map(() => Array(15).fill(0)) as Array<Array<-1 | 0 | 1>>,
        status: "WAITING",
        turn: false,
        winner: null,
      } as GameState,
      myColor: undefined as undefined | number, // -1: Black, 1: White, to be edited
      statusText: "等待加载信息...",
      fetcher: null as any,
    };
  },

  mounted() {
    // Start fetching data
    this.fetcher = usePolling(this.fetchGameState, 500);
    this.fetcher.start();
    this.fetchGameState();
  },

  beforeUnmount() {
    if (this.fetcher) this.fetcher.stop();
  },

  methods: {
    async fetchGameState() {
      if (!this.roomId) return;
      const newState = await GomokuApi.getGameState(this.roomId, this.playerId);
      if (newState === "timeout") return;
      if (newState === "failed") return;
      if (newState && newState.board) {
        this.gameState = newState;
        this.updateStatus();
      }
    },

    async handleCellClick(x: number, y: number) {
      if (!this.myColor) return;
      if (this.gameState.board[y][x] !== 0) return;
      if (this.gameState.status !== "PROCEEDING") return;
      if (this.gameState.turn) return;

      this.gameState.turn = false;
      this.gameState.board[y][x] = this.myColor;

      await GomokuApi.makeMove(this.roomId, x, y);
      this.fetchGameState();
    },

    updateStatus() {
      if (this.gameState.status === "FINISHED") {
        this.statusText = this.gameState.winner ? "你赢了!" : "你输了!";
      } else if (this.gameState.status === "PROCEEDING") {
        this.statusText = this.gameState.turn ? "你的回合" : "等待对方落子...";
      } else {
        this.statusText = `等待对手加入...`;
      }
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
    :height="550"
    canHide
    canClose
    @hide="$emit('hide', windowId)"
    @focus="$emit('focus', windowId)"
    @close="$emit('close', windowId)"
  >
    <div class="warpper column game-wrapper">
      <div class="game-info border-inset">{{ statusText }} (房间名: {{ roomName }})</div>

      <div class="board-container border-inset">
        <div class="board">
          <div v-for="(row, y) in gameState.board" :key="y" class="board-row">
            <div
              v-for="(cell, x) in row"
              :key="x"
              class="board-cell"
              @click="handleCellClick(x, y)"
            >
              <div v-if="cell === -1" class="stone black"></div>
              <div v-if="cell === 1" class="stone white"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Window>
</template>

<style scoped>
.game-wrapper {
  padding: 10px;
  gap: 10px;
  height: 100%;
  background-color: #c0c0c0;
}
.game-info {
  background: #fff;
  padding: 5px;
  text-align: center;
  font-weight: bold;
}
.board-container {
  flex: 1;
  background: #dcb35c; /* 棋盘底色 */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.board {
  display: flex;
  flex-direction: column;
}
.board-row {
  display: flex;
}
.board-cell {
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: crosshair;
  position: relative;
}
.board-cell::before {
  content: "";
  position: absolute;
  width: inherit;
  height: inherit;
  transform: translate(-50%, -50%);
  border: 1px solid #555;
  border-color: #555;
  border-style: solid;
  border-width: 0 1.5px 1.5px 0;
  pointer-events: none;
}

.board-cell:first-child::before {
  border-width: 0 1.5px 0 0;
}

.board-row:first-child .board-cell::before {
  border-width: 0 0 1.5px 0;
}
.board-row:first-child .board-cell:first-child::before {
  border: none !important;
}

.stone {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
  z-index: 2;
}
.stone.black {
  background: #000;
  background-image: radial-gradient(circle at 5px 5px, #444, #000);
}
.stone.white {
  background: #fff;
  background-image: radial-gradient(circle at 5px 5px, #fff, #ddd);
}
</style>
