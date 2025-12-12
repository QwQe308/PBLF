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
  // Alert Window
  alert: {
    appId: "alert",
    title: "ERROR",
    icon: "/resources/window-icons/error.ico",
    windowComponent: "AlertWindow",
    showInStartMenu: false,
    showOnDesktop: false,
    isSingleInstance: false,
  },

  // Welcome Window
  Welcome: {
    appId: "Welcome",
    title: "Welcome",
    icon: "/resources/window-icons/welcome.ico",
    windowComponent: "Welcome",
    showInStartMenu: true,
    showOnDesktop: false,
    isSingleInstance: false,
  },

  // Internet Explorer
  InternetExplorer: {
    appId: "InternetExplorer",
    title: "Internet Explorer",
    icon: "/resources/desktop-icons/internet-explorer.ico",
    windowComponent: "InternetExplorer", // Name of the component
    showInStartMenu: true,
    showOnDesktop: true,
    isSingleInstance: false,
  },

  // Window Spawner
  WindowSpawner: {
    appId: "WindowSpawner",
    title: "Window Spawner",
    icon: "/resources/desktop-icons/window-spawner.ico",
    windowComponent: "WindowSpawner",
    showInStartMenu: true,
    showOnDesktop: true,
    isSingleInstance: false,
  },
  SpawnedWindow: {
    appId: "SpawnedWindow",
    title: "Spawned Window",
    icon: "/resources/desktop-icons/window-spawner.ico",
    windowComponent: "SpawnedWindow",
    showInStartMenu: false,
    showOnDesktop: false,
    isSingleInstance: false,
  },

  FlappyBird: {
    appId: "FlappyBird",
    title: "Flappy Bird",
    icon: "/resources/apps/flappy-bird/0.png",
    windowComponent: "FlappyBirdWindow",
    showInStartMenu: true,
    showOnDesktop: true,
    isSingleInstance: false,
  },
};
