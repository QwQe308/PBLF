<script lang="ts">
import Window from "../../constructors/window.vue";
import {
  FlappyBirdGame,
  type GameState,
  type PlayerState,
} from "./flappyBirdGame.ts";
import SwapImages from "../../constructors/swapImages.vue";
import type { StyleRecord } from "../../../support/types.ts";

const PlayerImages = [
  "./resources/apps/flappy-bird/0.png",
  "./resources/apps/flappy-bird/1.png",
  "./resources/apps/flappy-bird/2.png",
  "./resources/apps/flappy-bird/3.png",
  "./resources/apps/flappy-bird/4.png",
  "./resources/apps/flappy-bird/5.png",
  "./resources/apps/flappy-bird/6.png",
  "./resources/apps/flappy-bird/7.png",
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
    SwapImages,
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

    playerStyle(): StyleRecord {
      const position = this.gameState.player.position;

      if (!position || !position.leftTopCorner) {
        return {};
      }

      return {
        transform: `translate(${position.leftTopCorner.x}px, ${position.leftTopCorner.y}px)`,
        position: "absolute",
        left: "-11px",
        top: "-12px",
        "flex-grow": 0
      };
    },

    isHintActive(): boolean {
      return !this.gameState.running && !this.gameState.isGameover;
    },
    isGameoverActive(): boolean {
      return this.gameState.isGameover;
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
    handleGameoverCallback() {},

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
    canHide
    canClose
    @hide="$emit('hide', windowId)"
    @focus="$emit('focus', windowId)"
    @close="$emit('close', windowId)"
  >
    <div
      class="warpper flappy-bird-bg column"
      @click="handleClick"
      draggable="false"
      :style="bgStyle"
    >
      <div class="flappy-bird-score">{{ scoreText }}</div>

      <div class="flappy-bird-fly-area">
        <img
          v-for="obstacle in gameState.obstacles"
          :key="obstacle.id"
          class="flappy-bird-obstacle"
          src="/resources/apps/flappy-bird/pipe.png"
          :style="{ transform: obstacle.transform }"
          draggable="false"
        />

        <SwapImages
          :interval="0.5"
          :images="playerImages"
          :playing="!gameState.isGameover"
          :style="playerStyle"
        ></SwapImages>
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
.flappy-bird-bg {
  background-image: url("./resources/apps/flappy-bird/bg.png");
  background-size: contain;
  background-repeat: repeat-x;

  overflow: hidden;
  position: relative;

  background-position-x: var(--bg-offset);
}

.obstacle img {
  position: absolute;
  flex-grow: 0;
}

.flappy-bird-player {
}

.flappy-bird-score {
  position: absolute;
  left: 50%;
  top: 30px;
  transform: translateX(-50%) scaleY(1.1);
  font-family: var(--font-Press-Start-2P);
  font-size: 24px;
  color: #895628;
}

.flappy-bird-fly-area {
  position: relative;
  height: 77.4%;
  width: 100%;
  overflow: hidden;
}

.flappy-bird-ground {
  position: relative;
  height: 22.6%;
  width: 100%;
  background-image: url("./resources/apps/flappy-bird/ground.png");
  background-position-x: var(--ground-offset);
  background-repeat: repeat-x;
}

.flappy-bird-obstacle {
  position: absolute;
}

.flappy-bird-hint-filter {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: #0003;
  transition: opacity 0.6s;
  z-index: 9;
}

.flappy-bird-hint {
  position: absolute;
  height: 100%;
  left: 50%;
  transform: translateX(-50%);
}

.flappy-bird-hint-filter.inactive {
  opacity: 0;
}

.flappy-bird-hint.inactive {
  opacity: 0;
}

.flappy-bird-hint-score {
  position: absolute;
  left: 49.2%;
  top: 47%;
  transform: translateX(-50%) translateY(-50%) scaleY(1.1);
  font-family: var(--font-Press-Start-2P);
  font-size: 28px;
  color: #ffa24a;
}

.flappy-bird-hint.inactive + .flappy-bird-hint-score {
  opacity: 0;
}
</style>
