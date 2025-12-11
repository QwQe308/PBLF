/**
 * @interface AppEntryInfo Info for a sigle app / window.
 * 
 */
export interface AppEntryInfo {
  // Title of the app
  title: string;
  // Icon of the app
  icon: string;
  // Name of the main window component
  windowComponent: string;
  // The id of the app
  appId: string;
  // If the app shows in the start menu
  showInStartMenu: boolean;
  // If the app has an icon on the desktop
  showOnDesktop: boolean;
  // If the app could only have one window instance (for now all apps is able to open multiple windows)
  isSingleInstance: boolean;
}

type AppInfos = Record<string, AppEntryInfo>;

export const AppInfos: AppInfos = {
  internetExplorer: {
    appId: "internetExplorer",
    title: "Internet Explorer",
    icon: "/resources/desktop-icons/internet-explorer.ico",
    windowComponent: "InternetExplorer", // Name of the component
    showInStartMenu: true,
    showOnDesktop: true,
    isSingleInstance: false,
  },
  windowSpawner: {
    appId: "windowSpawner",
    title: "Window Spawner",
    icon: "/resources/desktop-icons/window-spawner.ico", // 模仿原文件路径
    windowComponent: "WindowSpawner",
    showInStartMenu: true,
    showOnDesktop: true,
    isSingleInstance: false,
  },
  spawnedWindow: {
    appId: "spawnedWindow",
    title: "Spawned Window", // 默认标题，会被动态覆盖
    icon: "/resources/desktop-icons/window-spawner.ico", // 默认图标，会被动态覆盖
    windowComponent: "SpawnedWindow",
    showInStartMenu: false,
    showOnDesktop: false,
    isSingleInstance: false,
  },
};
