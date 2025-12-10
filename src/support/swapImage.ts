import { Interval } from "./interval.ts";

type strings = [string, ...string[]]

export class SwapImage {
  elements: HTMLElement[] = [],
  shown = 0;
  imagesCount = 0;
  interval = undefined;
  intervalFunction = undefined;

  constructor(...images: strings) {
    let elements = images.map((image) => {
      let element = document.createElement("img");
      element.src = image;
      element.style.opacity = "0";
      element.style.transition = "none";
      element.draggable = false;
      return element;
    });

    elements[0].style.opacity = "0";
    this.elements = elements;
  }

  assignClass(...classes: string[]) {
    this.elements.forEach((x) => x.classList.add(...classes));
  }

  assignStyle(styles) {
    for (let i in styles) {
      this.elements.forEach((element) => (element.style[i] = styles[i]));
    }
  }

  /**
   * @function Sets swap interval.
   * @param {number} interval Swap interval in seconds.
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
