<script lang="ts">
import { Interval } from "../support/interval";
import DesktopIcon from "./constructors/desktopIcon.vue";
import FooterNavigation from "./constructors/footerNavigation.vue";
import StartNavigation from "./constructors/startNavigation.vue";

interface tabInfos {
  id: string;
  index: number;
  hidden: boolean;
};

export default {
  name: "App",
  components: {
    StartNavigation,
    FooterNavigation,
    DesktopIcon,
  },
  data() {
    return {
      interval: undefined as Interval | undefined,
      currentTime: new Date(),
      currentTabs: new Set() as Set<tabInfos>,
      currentTabIndex: 0,
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

    handleWindowFocus(item: tabInfos) {
      item.index = this.currentTabIndex++;
    },

    toggleWindowHide(item: tabInfos) {
      item.hidden = !item.hidden;
      item.index = this.currentTabIndex++;
    },

    closeWindow(item: tabInfos) {
      this.currentTabs.delete(item);
    },

    createWindow(id: string){
      this.currentTabs.add({
        id: id,
        index: this.currentTabIndex ++,
        hidden: false
      })
    }
  },

  mounted() {
    this.interval = new Interval(this.update, 0);
    this.interval.set();
    Interval.startMainInterval(60);
  },
};
</script>

<template>
  <div>
    <div class="main-content">
      <div id="icons"></div>
      <div id="windows">
        <component
          v-for="item in currentTabs"
          :is="item.id"
          :index="item.index"
          @hide="toggleWindowHide(item)"
          @focus="handleWindowFocus(item)"
          @createWindow="createWindow(item.id)"
        />
      </div>
    </div>
    <footer class="footer">
      <div class="footer-warpper">
        <button id="start-button" class="basic-button start-button">
          <img class="start-icon" src="/resources/footer-icons/w95_40.ico" />
          <span class="start-text">Start</span>
        </button>
        <div id="start-navigation" class="border-outset inactive">
        </div>
        <div id="footer-navigation"></div>
        <div class="border-inset time">
          <span id="time" class="time-text"> {{ processedTime }} </span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.main-content {
  display: flex;
  position: relative;
  height: calc(100% - 30px);
  width: 100%;
}

#windows {
  display: flex;
  width: 100%;
  height: 100%;
}

/* Desktop icons style */

#icons {
  position: absolute;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.desktop-icon-container {
  display: flex;
  flex-direction: column;
  height: 70px;
  width: 88px;
  font-size: 12px;
  color: #fffe;

  cursor: var(--pointer);
  user-select: none;
}

.desktop-icon-container img {
  height: 32px;
  width: 32px;
  margin: auto auto 3px auto;
}

.desktop-icon-container span {
  text-wrap-mode: nowrap;
  margin: 0 auto auto auto;
}

/* Footer style */

footer {
  position: fixed;
  display: flex;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #c3c3c3;
  height: 30px;
  padding: 0 2px;
  box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf,
    inset -2px -2px grey, inset 2px 2px #fff;
  z-index: 999999;
}

.footer-warpper {
  display: flex;
  position: relative;
  height: inherit;
  width: inherit;
}

.start-button {
  display: flex;
  margin: auto 0;
  padding: 3px 4px;
  height: 15px;
  background-color: inherit;
  box-sizing: content-box;
}

.start-icon {
  height: 15px;
}

.start-text {
  display: block;
  margin: auto 0 auto 5px;
  font-weight: 700;
  font-size: 12px;
}

#start-navigation {
  position: absolute;
  bottom: 95%;
  left: -2px;
  display: flex;
  background-color: #c3c3c3;
  flex-direction: column-reverse;
  width: 200px;
  z-index: 9999999;
}

#footer-navigation {
  display: flex;
  flex-grow: 1;
  max-width: calc(100% - 150px);
  margin: 0 5px;
}

#start-navigation.inactive {
  visibility: hidden;
}

.start-navigation-block {
  display: flex;
  flex-direction: row;
  padding: 10px;
  height: 50px;
  cursor: var(--pointer);
}

.start-navigation-block:hover {
  background-color: #0001ab;
  color: #fff;
}

.start-navigation-block img {
  display: block;
  height: 16px;
  width: 16px;
  margin-right: 4px;
}

.start-navigation-block > span {
  display: block;
}

.time {
  display: flex;
  margin: auto 3px auto auto;
  height: 16px;
  width: 60px;
  background-color: inherit;
  box-sizing: content-box;
}

.time-text {
  display: flex;
  text-align: center;
  justify-content: center;
  margin: auto;
  font-size: 12px;
}
</style>
