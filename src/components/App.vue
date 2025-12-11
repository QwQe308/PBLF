// src/components/App.vue
<script lang="ts">
import { Interval } from "../support/interval";
import DesktopIcon from "./constructors/desktopIcon.vue";
import FooterNavigation from "./constructors/footerNavigation.vue";
import StartNavigation from "./constructors/startNavigation.vue";
import { AppInfos, type AppEntryInfo } from "./apps/appInfos";
import InternetExplorer from "./apps/internetExplorer/internetExplorer.vue";
import WindowSpawner, { type CustomWindowSpawnEvent } from "./apps/windowSpawner/windowSpawner.vue";
import SpawnedWindow, { type SpawnedWindowProps } from "./apps/windowSpawner/spawnedWindow.vue";

// 定义运行中的窗口实例类型
interface WindowInstance {
  windowId: string;
  appId: string;
  index: number;
  hidden: boolean;
  title: string;
  icon: string;
  componentName: string;
  positionX: number;
  positionY: number;
  isFullscreen: boolean;
  customProps?: Partial<SpawnedWindowProps>;
}

export default {
  name: "App",
  components: {
    StartNavigation,
    FooterNavigation,
    DesktopIcon,
    InternetExplorer,
    WindowSpawner,
    SpawnedWindow
  },
  data() {
    return {
      interval: undefined as Interval | undefined,
      currentTime: new Date(),
      currentWindows: new Map<string, WindowInstance>(),
      currentTabIndex: 0,
      isStartMenuOpen: false,
      AppInfos: AppInfos,
    };
  },

  computed: {
    // ... (processedTime 和 desktopIcons 保持不变) ...
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
    sortedWindows(): WindowInstance[] {
      return Array.from(this.currentWindows.values()).sort(
        (a, b) => a.index - b.index
      );
    },
  },

  methods: {
    update() {
      this.currentTime = new Date();
    },

    getWindow(windowId: string): WindowInstance | undefined {
      return this.currentWindows.get(windowId);
    },

    handleWindowFocus(windowId: string) {
      const item = this.getWindow(windowId);
      if (item) {
        item.index = this.currentTabIndex++; // 提升 Z-index (这是导致问题的根源，但现在状态已提升，不会丢失数据)
        item.hidden = false; // 聚焦时取消隐藏 (最小化)
      }
    },

    toggleWindowHide(windowId: string) {
      const item = this.getWindow(windowId);
      if (item) {
        item.hidden = !item.hidden;
        if (!item.hidden) {
          item.index = this.currentTabIndex++; // 重新显示时提升 Z-index
        }
      }
    },

    closeWindow(windowId: string) {
      this.currentWindows.delete(windowId);
    },

    // 【新增】更新窗口的位置
    updateWindowPosition(windowId: string, x: number, y: number) {
      const item = this.getWindow(windowId);
      if (item) {
        item.positionX = x;
        item.positionY = y;
      }
    },

    // 【新增】更新窗口的全屏状态
    updateWindowFullscreen(windowId: string, isFullscreen: boolean) {
      const item = this.getWindow(windowId);
      if (item) {
        item.isFullscreen = isFullscreen;
        this.handleWindowFocus(windowId); // 全屏/恢复时也应聚焦
      }
    },// 【新增】处理自定义窗口生成事件
    handleCustomSpawn(payload: CustomWindowSpawnEvent){
      this.createWindow(payload.appId, payload);
    },
    
    // 【修改】重载 createWindow 以支持可选的 customPayload
    createWindow(appId: string, customPayload?: CustomWindowSpawnEvent){
      const appInfo: AppEntryInfo | undefined = AppInfos[appId];

      if (!appInfo) return;
      if (!appInfo.windowComponent) {
        if (appId === "shutdown") {
          console.log("Shutting down... (action not implemented)");
        }
        this.isStartMenuOpen = false;
        return;
      }

      if (appInfo.isSingleInstance) {
        const existingWindow = Array.from(this.currentWindows.values()).find(
          (w) => w.appId === appId
        );
        if (existingWindow) {
          this.handleWindowFocus(existingWindow.windowId);
          this.isStartMenuOpen = false;
          return;
        }
      }

      const newWindowId = `${appId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const newIndex = this.currentTabIndex++;
      
      const offset = newIndex % 10;
      const positionX = offset * 20 + 60 + (offset) * 2;
      const positionY = offset * 20 + 100 + (offset) * 5;

      const newWindow: WindowInstance = {
        windowId: newWindowId,
        appId: appId,
        index: newIndex,
        hidden: false,
        // 使用自定义 Payload 的 title 和 icon
        title: customPayload?.title || appInfo.title,
        icon: customPayload?.icon || appInfo.icon,
        componentName: appInfo.windowComponent,
        positionX: positionX,
        positionY: positionY,
        isFullscreen: false,
      };

      // 【新增】存储自定义 Props
      if (customPayload) {
          newWindow.customProps = {
              content: customPayload.content,
              dynamicWidth: customPayload.width,
              dynamicHeight: customPayload.height,
              canHide: customPayload.canHide,
              canFullscreen: customPayload.canFullscreen,
              canClose: customPayload.canClose,
          }
      }

      this.currentWindows.set(newWindowId, newWindow);
      this.isStartMenuOpen = false;
    },

    toggleStartMenu() {
      this.isStartMenuOpen = !this.isStartMenuOpen;
    },
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
          v-for="item in sortedWindows.filter(w => !w.hidden)"
          :key="item.windowId"
          :is="item.componentName"
          :index="item.index"
          :title="item.title"
          :icon="item.icon"
          :windowId="item.windowId"
          
          :positionX="item.positionX"
          :positionY="item.positionY"
          :isFullscreen="item.isFullscreen"
          
          v-bind="item.customProps" 
          
          @spawnCustomWindow="handleCustomSpawn" 
          
          @update:position="updateWindowPosition"
          @update:fullscreen="updateWindowFullscreen"
          @hide="toggleWindowHide"
          @focus="handleWindowFocus"
          @close="closeWindow"
          
          @createWindow="createWindow(item.appId)"
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
            v-for="item in sortedWindows"
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
/* 样式保持不变 */
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
