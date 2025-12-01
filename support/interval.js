/**
 * @class This adds an interval to the game. Unlike the normal setInterval,
 * it mounts on the main gameLoop,
 * sharing a common update interval to improve performance.
 */
export class Interval {
  /**
   * @param {Function} func The function will be processed every interval.
   * If it returns any value, it will be used as the "Remained Diff", subtracts the interval to next occur.
   * @param {Number} intervalTime Interval for the function. in seconds. Set to 0 to update every tick.
   */
  constructor(func, intervalTime = 0) {
    this.intervalTime = intervalTime;
    this.function = func;
    this.time = 0;
  }

  update(diff) {
    this.time += diff;
    if (this.time > this.intervalTime) {
      if (this.function) this.time = this.function(this.time) ?? 0;
      else this.time = 0;
      return true;
    }
    return false;
  }

  set() {
    intervals.add(this);
  }

  remove() {
    intervals.delete(this);
  }

  static updateAll(diff) {
    for (let i of intervals) i.update(diff);
  }

  /**
   * @param {Number} fps FPS for the updates.
   */
  static startMainInterval(fps) {
    let lastTime = new Date().getTime();
    setInterval(() => {
      let currentTime = new Date().getTime();
      let diff = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      Interval.updateAll(diff);
    }, 1000 / fps);
  }
}

let intervals = new Set();
