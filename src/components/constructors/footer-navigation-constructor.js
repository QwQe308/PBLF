import { TemplateParser } from "../../support/templateParser.js";

const FooterNavigationContainer = document.getElementById("footer-navigation");

/**
 * @class Creates a footer navigation. This will be automatically done by window creator.
 */
export class FooterNavigation {
  get template() {
    return `
    <button class="basic-button footer-navigation-block" v-click="toggleWindow">
      <img class="title-icon" src="${this.icon}" /><span>${this.title}</span>
    </button>
    `;
  }

  constructor(windowComponent) {
    this.title = windowComponent.title;
    this.icon = windowComponent.icon;
    this.windowComponent = windowComponent;

    this.element = new TemplateParser(this).element;
    FooterNavigationContainer.append(this.element);
  }

  toggleWindow() {
    this.windowComponent.toggleHide();
  }

  remove() {
    this.element.remove();
  }
}
