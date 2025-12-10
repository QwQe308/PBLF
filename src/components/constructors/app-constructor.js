import { DesktopIcon } from "./icon-constructor.js";
import { StartNavigation } from "./start-navigation-constructor.js";
import { Window } from "./window-constructor.js";

/**
 * @class Creates an app.
 */
export class App {
  /**
   * @param {Object} configs Some configs for the app.
   * @param {String} configs.title The title of the app.
   * @param {String} configs.icon The route of the icon.
   * @param {Window} configs.windowComponent The window will be shown if the app is running.
   * @param {Boolean} configs.startNavigation If true, it will create a navigation in start tab.
   * @param {Boolean} configs.desktopIcon If true, it will create a icon in the desktop.
   */
  constructor(configs) {
    this.configs = configs;

    if (this.configs.startNavigation)
      this.startNavigation = new StartNavigation(
        this.configs.icon,
        this.configs.title,
        this.configs.windowComponent
      );
    if (this.configs.desktopIcon)
      this.desktopIcon = new DesktopIcon(
        this.configs.icon,
        this.configs.title,
        this.configs.windowComponent
      );
  }

  openWindow() {
    new this.configs.windowComponent().show();
  }
}
