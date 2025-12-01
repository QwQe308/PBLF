// 由于工作量问题被废止了...如果要让这个更加有用, 必须添加类似于vue的侦测变量变化. 但是那样子就不是一点代码能解决的了.

// 第二版的v-for版本废弃了, 因为工程量太大 + 可能对性能影响大, 改成每次调用时手动添加component
// v-for现在只会添加空的相同组件(v-for="3"这种类似的方法)
// 好怀念vue

// 考虑到侦测对象变化的工作量, v-for现在被弃用. 如果需要添加元素, 请在外部检索容器并直接添加.

// Events to be processed
const GlobalEvents = ["g-mousemove", "g-mouseup", "g-mouseleave"];
const ScopedEvents = [
  "v-click",
  "v-mousedown",
  "v-mousemove",
  "v-mouseup",
  "v-mouseleave",
  "v-focus",
  "v-blur",
  "v-keydown",
  "v-change",
];

/**
 * @class Parses string-based html codes like what vue done.
 * Currently can automatically attach events & manually replace components.
 */
export class TemplateParser {
  /**
   * @param {Object} scope The scope of the parser. Will be used when calling this functions / varibles.
   * @param {String} [template = scope.template] Input this if you want to attach multiple templates to one scope.
   */
  constructor(scope, template = scope.template) {
    this.tempElement = document.createElement("div");
    this.tempElement.innerHTML = template;
    this.element = this.tempElement.firstElementChild;
    this.scope = scope;

    /* 
    // Process v-for
    const ElementsToProcess_For = this.element.querySelectorAll(`[v-for]`);
    ElementsToProcess_For.forEach((x) => {
      let toReplace = document.createDocumentFragment();
      let forValues = x.getAttribute("v-for")
      for(let i = 1; i <= scope[forValues]; i++){
        toReplace.append(ElementsToProcess_For.cloneNode(false));
      }
    });
    */

    if (!this.scope) return;

    // Event binding

    this.globalFunctionsBinded = {};

    for (let globalEvent of GlobalEvents) {
      this.globalFunctionsBinded[globalEvent] = new Set();
    }

    const Events = [...ScopedEvents, ...GlobalEvents];
    const ElementsToProcess_BindEvents = Events.map((x) =>
      this.tempElement.querySelectorAll(`[${x}]`)
    ).map((x) => x ?? []);
    for (let i = 0; i < Events.length; i++) {
      ElementsToProcess_BindEvents[i].forEach((element) => {
        if (Events[i][0] === "v") {
          element.addEventListener(
            Events[i].substring(2, Events[i].length),
            this.scope[element.getAttribute(Events[i])].bind(scope) ??
              console.error(
                `No function found while binding ${Events[i]} event`
              )
          );
        } else if (Events[i][0] === "g") {
          globalEventsPool[Events[i]].add(
            this.scope[element.getAttribute(Events[i])].bind(scope) ??
              console.error(
                `No function found while binding ${Events[i]} event`
              )
          );
          this.globalFunctionsBinded[Events[i]].add(
            this.scope[element.getAttribute(Events[i])].bind(scope) ??
              console.error(
                `No function found while binding ${Events[i]} event`
              )
          );
        } else {
          console.error(`Unidentified Event type: ${Events[i]}`);
        }
      });
    }
  }

  /**
   * @function Parses from text. This do not require any relavent scope,
   * which also means v- & g- events are not processed.
   * Use it only if you want a simple component without many events.
   * @param {String} template Text to be parsed.
   * @returns {TemplateParser} Itself.
   */
  static fromText(template) {
    return new TemplateParser(undefined, template);
  }

  /**
   * @function This replaces the custom components in the template.
   * However, it will only replace the first one for each element you inputed. And they are not cloned.
   * @param  {...Element} elements These is the elements to replace into the template.
   * @returns {TemplateParser} Itself.
   */
  replace(...elements) {
    const toReplace = elements.map((x) =>
      this.tempElement.querySelector(x.tagName)
    );
    if (toReplace.filter((x) => x === null).length)
      console.error(
        `No component found when replacing node: ${
          elements[toReplace.indexOf(null)].tagName
        }`
      );
    for (let i = 0; i < elements.length; i++) {
      //if (!toReplace[i].getAttribute("v-for"))
      toReplace[i].replaceWith(elements[i].firstElementChild);
    }
    return this;
  }

  /**
   * @function Removes the events in the cache, useful if you're removing components with g- events.
   */
  remove() {
    for(let i in this.globalFunctionsBinded){
      this.globalFunctionsBinded[i].forEach(
        x => globalEventsPool[i].delete(x)
      )
    }
  }
}

// Combine these all global events to one, in order to optimize performance
let globalEventsPool = {};

for (let globalEvent of GlobalEvents) {
  globalEventsPool[globalEvent] = new Set();
  document.addEventListener(
    globalEvent.substring(2, globalEvent.length),
    (event) => globalEventsPool[globalEvent].forEach((x) => x(event))
  );
}
