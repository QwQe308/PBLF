import { Interval } from "./interval.js";

export class SwapImage {
  constructor(...images) {
    let elements = images.map((image) => {
      let element = document.createElement("img");
      element.src = image;
      element.style.opacity = 0;
      element.style.transition = "none";
      element.draggable = false;
      return element;
    });

    elements[0].style.opacity = 1;
    this.elements = elements;

    this.shown = 0;
    this.imagesCount = images.length;

    this.interval = undefined;
    this.intervalFunction = undefined;
  }

  assignClass(...classes) {
    this.elements.forEach((x) => x.classList.add(...classes));
  }

  assignStyle(styles) {
    for (let i in styles) {
      this.elements.forEach((element) => (element.style[i] = styles[i]));
    }
  }

  /**
   * @function Sets swap interval.
   * @param {Number} interval Swap interval in seconds.
   */
  setSwapInterval(interval) {
    this.interval = interval;
    if (this.intervalFunction) {
      this.intervalFunction.remove();
      this.intervalFunction = undefined;
      this.start()
    }
  }

  /**
   * @function Starts the swap.
   */
  start() {
    if (!this.interval) console.error("No Interval defined in the SwapImage!");
    this.intervalFunction = new Interval(this.update.bind(this), this.interval);
    this.intervalFunction.set()
  }

  stop() {
    if(!this.intervalFunction) return
    this.intervalFunction.remove();
    this.intervalFunction = undefined;
  }

  update(diff) {
    let nextShown = (this.shown + 1) % this.imagesCount;
    this.elements[this.shown].style.opacity = 0;
    this.elements[nextShown].style.opacity = 1;

    this.shown = nextShown; // increments the shown id
    return Math.min(diff, 0.2);
  }
}
