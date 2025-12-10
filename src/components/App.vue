<script lang="ts">
import { mountUpdater } from '../main';

export default {
  name: "App",
  components: {},
  data() {
    return {
      currentTime: new Date() as Date,
      currentTabs: new Set() as Set<String>,
    };
  },

  computed: {
    processedTime() {
      const Hours = this.currentTime.getHours();
      const Minutes = this.currentTime.getMinutes();

      let displayedMinutes = Minutes < 10 ? `0${Minutes}` : Minutes;

      if (Hours === 0) {
        return `${Hours + 12}: ${displayedMinutes} AM`;
      } else if (Hours < 12) {
        return `${Hours}: ${displayedMinutes} AM`;
      } else if (Hours === 12) {
        return `${Hours}: ${displayedMinutes} PM`;
      } else {
        return `${Hours - 12}: ${displayedMinutes} PM`;
      }
    },
  },

  methods: {
    update() {
      this.currentTime = new Date();
    },
  },

  mounted(){
    mountUpdater(this)
  }
};
</script>

<template>
  <div>
    <div class="main-content">
      <div id="icons"></div>
      <div id="windows"></div>
    </div>
    <footer class="footer">
      <div class="footer-warpper">
        <button id="start-button" class="basic-button start-button">
          <img class="start-icon" src="./resources/footer-icons/w95_40.ico" />
          <span class="start-text">Start</span>
        </button>
        <div id="start-navigation" class="border-outset inactive"></div>
        <div id="footer-navigation"></div>
        <div class="border-inset time">
          <span id="time" class="time-text"> {{ processedTime }} </span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped></style>
