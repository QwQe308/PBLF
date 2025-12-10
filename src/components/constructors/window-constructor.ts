import { Vector } from "../../support/vector.ts";
import { FooterNavigation } from "./footer-navigation-constructor.js";
export class Window {
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

  position: new Vector(0, 0);
  dragging: false;
  recordedMousePosition: new Vector(0, 0)
  fullscreen: false

  /**
   * @param {Object} configs A object of window configs. (Optional)
   * @param {Boolean} configs.noHide If true, the hide button will be removed. (Optional)
   * @param {Boolean} configs.noFullscreen If true, the fullscreen button will be removed. (Optional)
   * @param {Boolean} configs.noClose If true, the close button will be removed. (Optional)
   */
  constructor(public configs = {}) {
    // Initialize
    this.dragging = false;

    this.fullscreen = false

    this.configs = configs
  }

  /**
   * @function This will create the element using TemplateParser & most varibles.
   * DO CONFIRM that you have already set most values already before calling this.
   */
  createElement(){
    // Element creation
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

  /**
   * @function Push the element into the DOM.
   */
  show() {
    this.containerElement.append(this.element);
  }

  focus(){
    this.element.style.zIndex = windowIndex ++
  }

  applyTransform(rect) {
    this.element.style.transform = `translate(${rect.xRange[0]}px, ${rect.yRange[0]}px)`
  }

  startDrag(event) {
    if(this.fullscreen) return
    this.dragging = true;
    this.recordedMousePosition = new Vector(event.clientX, event.clientY);
  }

  drag(event) {
    if (!this.dragging || this.fullscreen) return;
    const NewMousePosition = new Vector(event.clientX, event.clientY);
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
