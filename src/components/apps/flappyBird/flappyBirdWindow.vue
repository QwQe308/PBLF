<script lang="ts">
import Window from "../../constructors/window.vue";
import {
  FlappyBirdGame,
  type GameState,
  type PlayerState,
} from "./flappyBirdGame.ts";
import SwapImages from "../../constructors/swapImages.vue";

const PlayerImages = [
  './resources/apps/flappy-bird/0.png',
  './resources/apps/flappy-bird/1.png',
  './resources/apps/flappy-bird/2.png',
  './resources/apps/flappy-bird/3.png',
  './resources/apps/flappy-bird/4.png',
  './resources/apps/flappy-bird/5.png',
  './resources/apps/flappy-bird/6.png',
  './resources/apps/flappy-bird/7.png',
];

const createInitialPlayerState = (): PlayerState => ({
  position: null as any,
  speed: null as any,
  obstacleSpawnTimer: 0,
  score: 0,
  bgOffset: 0,
  groundOffset: 0,
  startSlowdown: 0,
});

export default {
  name: "FlappyBird",

  components: {
    Window,
    SwapImages
  },

  props: {
    windowId: { type: String, required: true },
    index: { type: Number, required: true },
    layer: { type: Number, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    isHidden: { type: Boolean, required: true },
  },

  emits: ["hide", "focus", "close"],

  data() {
    return {
      game: null as FlappyBirdGame | null,

      gameState: {
        running: false,
        isGameover: false,
        player: createInitialPlayerState(),
        obstacles: new Set(),
        gameoverCounter: 0,
      } as GameState,

      playerImages: PlayerImages,
    };
  },

  computed: {
    bgStyle(): Record<string, string> {
      return {
        "--bg-offset": `${this.gameState.player.bgOffset * -1}px`,
        "--ground-offset": `${this.gameState.player.groundOffset * -1}px`,
      };
    },

    playerTransform(): string {
      const position = this.gameState.player.position;
      if (!position || !position.leftTopCorner) return "";

      return `translate(${position.leftTopCorner.x}px, ${position.leftTopCorner.y}px)`;
    },

    isHintActive(): boolean {
      return !this.gameState.running && this.gameState.gameoverCounter <= 0;
    },
    isGameoverActive(): boolean {
      return this.gameState.isGameover && this.gameState.gameoverCounter > 0;
    },
    scoreText(): number {
      return this.gameState.player.score;
    },
    hintScoreText(): string {
      return `Score:${this.gameState.player.score}`;
    },
  },

  mounted() {
    this.game = new FlappyBirdGame({
      onGameover: this.handleGameoverCallback,
      onStateUpdate: this.handleStateUpdateCallback,
    });

    this.game.start();
    this.game.state.running = false;
    this.game.close();
    this.handleStateUpdateCallback(this.game.state as GameState);
  },

  beforeUnmount() {
    this.handleClose();
  },

  methods: {
    handleGameoverCallback() {
    },

    handleStateUpdateCallback(state: GameState) {
      this.gameState = {
        ...state,
        obstacles: new Set(state.obstacles),
      };
    },

    handleClick() {
      if (!this.game) return;

      if (this.gameState.gameoverCounter > 0) return;

      if (!this.gameState.running) {
        this.game.start();
      } else {
        this.game.handleClick();
      }
    },

    handleClose() {
      this.game?.close();
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
    :width="1200"
    :height="800"
    :canHide="true"
    :canFullscreen="false"
    :canClose="true"
    @hide="$emit('hide', windowId)"
    @focus="$emit('focus', windowId)"
    @close="handleClose"
  >
    <div
      class="flappy-bird-bg column"
      @click="handleClick"
      draggable="false"
      :style="bgStyle"
    >
      <div class="flappy-bird-score">{{ scoreText }}</div>

      <div class="flappy-bird-fly-area">
        <template v-for="obstacle in gameState.obstacles" :key="obstacle.id">
          <img
            class="flappy-bird-obstacle"
            src="/resources/apps/flappy-bird/pipe.png"
            :style="{ transform: obstacle.transform }"
            draggable="false"
          />
        </template>

        <SwapImages :interval="0.5" :images="playerImages" :playing="!gameState.isGameover"></SwapImages>
      </div>

      <div class="flappy-bird-ground"></div>

      <div
        class="flappy-bird-hint-filter"
        :class="{ inactive: !isHintActive && !isGameoverActive }"
      >
        <img
          class="flappy-bird-hint"
          name="start"
          src="/resources/apps/flappy-bird/start.png"
          draggable="false"
          :class="{ inactive: gameState.running || gameState.isGameover }"
        />
        <img
          class="flappy-bird-hint"
          name="gameover"
          src="/resources/apps/flappy-bird/gameover.png"
          draggable="false"
          :class="{ inactive: !isGameoverActive }"
        />
        <div class="flappy-bird-hint-score" v-if="isGameoverActive">
          {{ hintScoreText }}
        </div>
      </div>
    </div>
  </Window>
</template>

<style scoped>
/* 保持原 Flappy Bird 的样式类和逻辑 */
.flappy-bird-bg {
  /* 定义 CSS 变量用于滚动动画 */
  --bg-offset: 0px;
  --ground-offset: 0px;

  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background-image: url("/resources/apps/flappy-bird/bg.png");
  background-position: var(--bg-offset) 0;
  background-repeat: repeat-x;
  background-size: auto 100%;
}

.flappy-bird-fly-area {
  flex-grow: 1;
  position: relative;
  overflow: hidden;
}

.flappy-bird-ground {
  height: 100px;
  min-height: 100px;
  background-image: url("/resources/apps/flappy-bird/ground.png");
  background-position: var(--ground-offset) 0;
  background-repeat: repeat-x;
  background-size: auto 100px;
}

.flappy-bird-player {
  position: absolute;
  width: 45px;
  height: 45px;
  will-change: transform;
}

.flappy-bird-obstacle {
  position: absolute;
  width: 78px;
  height: 1000%;
  top: 50%;
  left: 0;
  will-change: transform;
}

.flappy-bird-score {
  position: absolute;
  top: 20px;
  width: 100%;
  text-align: center;
  font-size: 40px;
  color: #fff;
  text-shadow: 2px 2px #000;
  z-index: 10;
  pointer-events: none;
}

.flappy-bird-hint-filter {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 50;
  pointer-events: none;
}

.flappy-bird-hint-filter.inactive {
  display: none;
}

.flappy-bird-hint {
  margin: 10px 0;
}

.flappy-bird-hint.inactive {
  display: none;
}

.flappy-bird-hint-score {
  font-size: 24px;
  color: #fff;
  text-shadow: 1px 1px #000;
}
</style>
