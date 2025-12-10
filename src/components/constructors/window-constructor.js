import { Rectangle } from "../../support/rectangle.js";
import { TemplateParser } from "../../support/templateParser.js";
import { Vector } from "../../support/vector.js";
import { FooterNavigation } from "./footer-navigation-constructor.js";

const WindowContainerDOM = document.getElementById("windows");

function getElementSize(element) {
  const ElementSizeData = element.getBoundingClientRect();
  const Height = ElementSizeData.height;
  const Width = ElementSizeData.width;
  const Top = ElementSizeData.top;
  const Left = ElementSizeData.left;

  return Rectangle.fromRange([Left, Left + Width], [Top, Top + Height]);
}

function removePX(str) {
  return Number(str.replace("px", ""));
}

let windowIndex = 0

export class Window {
  get template() {
    return `
      <div class="window" v-focus="focus" tabindex=0>
        <div class="window-warpper">
          <div class="window-header" v-mousedown="startDrag" g-mousemove="drag" g-mouseup="stopDrag" g-mouseleave="stopDrag">
            <div class="left">
              <span class="window-title" id="window-title"><img class="title-icon" src="${this.icon}" />${this.title}</span>
            </div>
            <div class="right">
              <div id="hide" v-click="hide">
                <img class="window-icon basic-button" src="./resources/window-icons/minimize.svg" draggable="false">
              </div>
              <div id="fullscreen" class="fullscreen-toggler" v-click="applyFullscreen">
                <img class="window-icon basic-button" src="./resources/window-icons/fullscreen.svg" draggable="false">
              </div>
              <div id="resumeFullscreen" class="fullscreen-toggler inactive" v-click="resumeFullscreen">
                <img class="window-icon basic-button" src="./resources/window-icons/fullscreen-resume.svg" draggable="false">
              </div>
              <div id="close" v-click="close">
                <img class="window-icon basic-button" src="./resources/window-icons/close.svg" draggable="false">
              </div>
            </div>
          </div>
          <window-content />
        </div>
      </div>
    `;
  }

  /**
   * @function Returns the template of the content element. Must be defined in sub-classes.
   */
  get contentElementTemplate() {
    console.error("contentElementTemplate is not defined!");
  }

  /**
   * @function Returns an object containing height, width (optional with top, left). End with px. Must be defined in sub-classes.
   */
  get style() {
    console.error("style is not defined!");
  }

  /**
   * @function Returns the title of the window. Must be defined in sub-classes.
   */
  get title() {
    console.error("title is not defined!");
  }

  /**
   * @function Returns the icon of the window. Must be defined in sub-classes.
   */
  get icon() {
    console.error("icon is not defined!");
  }

  /**
   * @function will be called on window resize. (Optional)
   * @param {Rectangle} preRect Previous window size rectangle. 
   * @param {Rectangle} newRect New window size rectangle. 
   */
  onResize(preRect, newRect){}

  /**
   * @function will be called on closing window. (Optional)
   */
  onClose(){}

  /**
   * @param {Object} configs A object of window configs. (Optional)
   * @param {Boolean} configs.noHide If true, the hide button will be removed. (Optional)
   * @param {Boolean} configs.noFullscreen If true, the fullscreen button will be removed. (Optional)
   * @param {Boolean} configs.noClose If true, the close button will be removed. (Optional)
   */
  constructor(configs = {}) {
    // Initialize
    this.containerElement = WindowContainerDOM; // change if required

    this.containerSizeRectangle = getElementSize(this.containerElement);

    this.dragging = false;
    this.recordedMousePosition = new Vector([0, 0]);

    this.fullscreen = false

    this.configs = configs
  }

  /**
   * @function This will create the element using TemplateParser & most varibles.
   * DO CONFIRM that you have already set most values already before calling this.
   */
  createElement(){
    // Element creation
    this.contentParser = new TemplateParser(
      this,
      this.contentElementTemplate
    )
    this.contentElement = this.contentParser.element;

    let style = this.style

    if(!style.top) style.top = `${windowIndex % 10 * 20 + 100 + (windowIndex - windowIndex % 10) * 2}px`
    if(!style.left) style.left = `${windowIndex % 10 * 20 + 100 + (windowIndex - windowIndex % 10) * 5}px`

    if(removePX(style.top) + removePX(style.height) > this.containerSizeRectangle.yRange[1]){
      style.top = `${windowIndex % 10 * 5 + 25 + (windowIndex - windowIndex % 10)}px`
    }

    this.sizeRectangle = Rectangle.fromRange(
      [removePX(style.left), removePX(style.left) + removePX(style.width)],
      [removePX(style.top), removePX(style.top) + removePX(style.height)]
    );

    this.baseSizeRectangle = Rectangle.copy(this.sizeRectangle)

    const ProcessedInnerElement = document.createElement("window-content");
    ProcessedInnerElement.append(this.contentElement);

    this.elementParser = new TemplateParser(this)
    this.element = this.elementParser.replace(
      ProcessedInnerElement
    ).element;
    this.element.style.zIndex = windowIndex ++

    style.transform = `translate(${style.left}, ${style.top})`
    style.left = ""
    style.top = ""
    Object.assign(this.element.style, style);

    this.fullscreenApply = this.element.querySelector("#fullscreen")
    this.fullscreenResume = this.element.querySelector("#resumeFullscreen")

    // Process configs
    if (this.configs.noHide) this.element.querySelector("#hide").remove();
    if (this.configs.noFullscreen){
      this.fullscreenApply.remove()
      this.fullscreenResume.remove()
    }
    if (this.configs.noClose) this.element.querySelector("#close").remove();

    window.addEventListener("resize", () => {
      this.updateContainerSize()
    })

    // Spawn footer navigation
    this.relatedFooterNavigation = new FooterNavigation(this)
  }

  get contentWidth(){
    return this.sizeRectangle.width - 20
  }

  get contentHeight(){
    return this.sizeRectangle.height - 40
  }

  /**
   * @function Push the element into the DOM.
   */
  show() {
    this.containerElement.append(this.element);
  }

  focus(){
    this.element.style.zIndex = windowIndex ++
  }

  updateContainerSize() {
    this.containerSizeRectangle = getElementSize(this.containerElement);
  }

  updateSelfSize(){
    this.sizeRectangle = getElementSize(this.element)
  }

  applyTransform(rect) {
    this.element.style.transform = `translate(${rect.xRange[0]}px, ${rect.yRange[0]}px)`
  }

  startDrag(event) {
    if(this.fullscreen) return
    this.dragging = true;
    this.recordedMousePosition = new Vector([event.clientX, event.clientY]);
  }

  drag(event) {
    if (!this.dragging || this.fullscreen) return;
    const NewMousePosition = new Vector([event.clientX, event.clientY]);
    const DeltaPosition = NewMousePosition.sub(this.recordedMousePosition);

    this.sizeRectangle = this.sizeRectangle.moveInContainer(
      DeltaPosition,
      this.containerSizeRectangle
    );

    this.recordedMousePosition = NewMousePosition
    this.applyTransform(this.sizeRectangle);
  }

  stopDrag() {
    this.dragging = false;
  }

  hide() {
    this.element.classList.add("inactive");
  }

  toggleHide(){
    this.element.classList.toggle("inactive");
    this.element.style.zIndex = windowIndex ++
  }

  applyFullscreen() {
    this.element.style.transform = ""
    this.element.style.width = ""
    this.element.style.height = ""
    this.element.classList.add("fullscreen");
    this.fullscreenApply.classList.add("inactive")
    this.fullscreenResume.classList.remove("inactive")
    this.fullscreen = true

    this.onResize(this.baseSizeRectangle, this.containerSizeRectangle)
  }

  resumeFullscreen() {
    this.element.style.width = `${this.sizeRectangle.xRange.linearLength}px`
    this.element.style.height = `${this.sizeRectangle.yRange.linearLength}px`
    this.element.style.transform = `translate(${this.sizeRectangle.xRange[0]}px, ${this.sizeRectangle.yRange[0]}px)`
    this.element.classList.remove("fullscreen");
    this.fullscreenApply.classList.remove("inactive")
    this.fullscreenResume.classList.add("inactive")
    this.fullscreen = false

    this.onResize(this.containerSizeRectangle, this.baseSizeRectangle)
  }

  /**
   * @function Close the window.
   */
  close() {
    this.contentParser.remove()
    this.elementParser.remove()
    this.relatedFooterNavigation.remove()
    this.element.remove();
    // need to be added later
  }
}
