import { createApp } from "vue";
import "./style.css";
import App from "./components/App.vue";

const app = createApp(App);

/* interface scopeWithUpdate {
  update: (diff: number) => void;
}

const updaterPool = new Set<scopeWithUpdate>();

export function mountUpdater(scope: scopeWithUpdate) {
  updaterPool.add(scope);
}

export function unmountUpdater(scope: scopeWithUpdate) {
  updaterPool.delete(scope);
}

let lastTime = new Date().getTime();

function update(){
  let currentTime = new Date().getTime();
  let diff = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  for (let scope of updaterPool) {
    scope.update(diff);
  }
} */

app.mount("#app");

/* 
setInterval(update, 1000 / 60); // 60 FPS 
*/
