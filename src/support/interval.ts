/**
 * @class This adds an interval to the game. Unlike the normal setInterval,
 * it mounts on the main gameLoop,
 * sharing a common update interval to improve performance.
 */
export class Interval {
  /**
   * @param {Function} func The function will be processed every interval.
   * If it returns any value, it will be used as the "Remained Diff", subtracts the interval to next occur.
   * @param {number} intervalTime Interval for the function. in seconds. Set to 0 to update every tick.
   */
  constructor(public func: Function, public intervalTime: number = 0) {}
  time = 0;

  update(diff: number) {
    this.time += diff;
    if (this.time > this.intervalTime) {
      if (this.func) this.time = this.func(this.time) ?? 0;
      else this.time = 0;
      return true;
    }
    return false;
  }

  set() {
    this.time = 0
    intervals.add(this);
  }

  remove() {
    intervals.delete(this);
  }

  static updateAll(diff:number) {
    for (let i of intervals) i.update(diff);
  }

  /**
   * @param {number} fps FPS for the updates.
   */
  static startMainInterval(fps: number) {
    let lastTime = new Date().getTime();
    setInterval(() => {
      let currentTime = new Date().getTime();
      let diff = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      Interval.updateAll(diff);
    }, 1000 / fps);
  }
}

let intervals: Set<Interval> = new Set();
