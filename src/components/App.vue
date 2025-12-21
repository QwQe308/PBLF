<script lang="ts">
import { Interval } from "../support/interval";
import DesktopIcon from "./constructors/desktopIcon.vue";
import FooterNavigation from "./constructors/footerNavigation.vue";
import StartNavigation from "./constructors/startNavigation.vue";
import { AppInfos, type AppEntryInfo } from "./apps/appInfos";
import InternetExplorer from "./apps/internetExplorer/internetExplorer.vue";
import WindowSpawner from "./apps/windowSpawner/windowSpawner.vue";
import SpawnedWindow, { type SpawnedWindowProps } from "./apps/windowSpawner/spawnedWindow.vue";
import AlertWindow from "./apps/windowSpawner/alertWindow.vue";
import Welcome from "./apps/welcome/welcome.vue";
import FlappyBird from "./apps/flappyBird/flappyBird.vue";
import GomokuLogin from "./apps/gomoku/login.vue";
import GomokuHub from "./apps/gomoku/hub.vue";
import GomokuGame from "./apps/gomoku/game.vue";

// Window Infos
interface WindowInstance {
  windowId: string;
  appId: string;
  index: number;
  layer: number;
  hidden: boolean;
  title: string;
  icon: string;
  componentName: string;
  customProps?: Partial<SpawnedWindowProps>;
}

export interface CustomWindowSpawnEvent {
  title?: string;
  width?: number;
  height?: number;
  content?: string;
  icon?: string;
  canHide?: boolean;
  canFullscreen?: boolean;
  canClose?: boolean;
}

export default {
  name: "App",
  components: {
    StartNavigation,
    FooterNavigation,
    DesktopIcon,
    AlertWindow,
    Welcome,
    InternetExplorer,
    WindowSpawner,
    SpawnedWindow,
    FlappyBird,
    GomokuLogin,
    GomokuHub,
    GomokuGame
  },
  data() {
    return {
      interval: undefined as Interval | undefined,
      currentTime: new Date(),
      currentWindows: {} as Record<string, WindowInstance>,
      currentTabIndex: 9,
      currentTabLayer: 0,
      isStartMenuOpen: false,
      AppInfos: AppInfos,
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
    desktopIcons(): AppEntryInfo[] {
      return Object.values(this.AppInfos).filter((info) => info.showOnDesktop);
    },
  },

  methods: {
    update() {
      this.currentTime = new Date();
    },

    getWindow(windowId: string): WindowInstance | undefined {
      return this.currentWindows[windowId];
    },

    handleWindowFocus(windowId: string) {
      const item = this.getWindow(windowId);
      if (item) {
        item.layer = this.currentTabLayer++;
        item.hidden = false;
      }
    },

    toggleWindowHide(windowId: string) {
      const item = this.getWindow(windowId);
      if (item) {
        item.hidden = !item.hidden;
        if (!item.hidden) {
          item.layer = this.currentTabLayer++;
        }
      }
    },

    closeWindow(windowId: string) {
      delete this.currentWindows[windowId];
    },

    handleCustomWindowSpawn(appId: string, payload: CustomWindowSpawnEvent){
      this.createWindow(appId, payload);
    },
    
    createWindow(appId: string, customPayload?: CustomWindowSpawnEvent){
      const appInfo: AppEntryInfo | undefined = AppInfos[appId];

      if (!appInfo) {
        this.alert("捕获到了一个错误信息! 请检查控制台!")
        return console.error(`A window with no appInfo is created! Creating appId: ${appId}`)
      };

      if (appInfo.isSingleInstance) {
        const existingWindow = this.currentWindows[appId]
        if (existingWindow) {
          this.handleWindowFocus(existingWindow.windowId);
          this.isStartMenuOpen = false;
          return;
        }
      }

      const newWindowId = `${appId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const newWindow: WindowInstance = {
        windowId: newWindowId,
        appId: appId,
        index: this.currentTabIndex++,
        layer: this.currentTabLayer,
        hidden: false,
        title: customPayload?.title || appInfo.title,
        icon: customPayload?.icon || appInfo.icon,
        componentName: appInfo.windowComponent,
      };

      if (customPayload) {
          newWindow.customProps = customPayload
      }

      this.currentWindows[newWindowId] = newWindow;
      this.isStartMenuOpen = false;
    },

    alert(content: string){
      this.createWindow("Alert", {content: content})
    },

    toggleStartMenu() {
      this.isStartMenuOpen = !this.isStartMenuOpen;
    },
  },

  mounted() {
    this.interval = new Interval(this.update, 0);
    this.interval.set();
    Interval.startMainInterval(120);

    window.alert = (content: string) => {this.alert(content)};

    this.createWindow("Welcome")
  },
};
</script>

<template>
  <div class="app">
    <div class="main-content">
      <div id="icons">
        <DesktopIcon
          v-for="info in desktopIcons"
          :key="info.appId"
          :title="info.title"
          :icon="info.icon"
          @launch="createWindow(info.appId)"
        />
      </div>
      <div id="windows">
        <component
          v-for="item in currentWindows"
          :key="item.windowId"
          :is="item.componentName"
          :index="item.index"
          :layer="item.layer"
          :title="item.title"
          :icon="item.icon"
          :windowId="item.windowId"
          :isHidden="item.hidden"
          
          v-bind="item.customProps" 
          
          @spawnCustomWindow="handleCustomWindowSpawn" 
          
          @hide="toggleWindowHide"
          @focus="handleWindowFocus"
          @close="closeWindow"
          
          @createWindow="createWindow"
        />
      </div>
    </div>
    <footer class="footer">
      <div class="footer-warpper">
        <button
          id="start-button"
          class="basic-button start-button"
          @click="toggleStartMenu"
        >
          <img class="start-icon" src="/resources/footer-icons/w95_40.ico" />
          <span class="start-text">Start</span>
        </button>
        <div
          id="start-navigation"
          class="border-outset"
          :class="{ inactive: !isStartMenuOpen }"
        >
          <StartNavigation @launch-app="createWindow" />
        </div>
        <div id="footer-navigation">
          <FooterNavigation
            v-for="item in currentWindows"
            :key="item.windowId"
            :title="item.title"
            :icon="item.icon"
            :windowId="item.windowId"
            :isHidden="item.hidden"
            @click="toggleWindowHide"
            @focus="handleWindowFocus"
          />
        </div>
        <div class="border-inset time">
          <span id="time" class="time-text"> {{ processedTime }} </span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app{
  height: 100vh;
  width: 100vw;
}

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
