import { Interval } from "../support/interval.js";

// APPs
import { Welcome } from "./apps/welcome/welcome.js";
import { InternetExplorer } from "./apps/internetExplorer/internetExplorer.js";
import { WindowSpawner } from "./apps/windowSpawner/windowSpawner.js";
import { FlappyBird } from "./apps/flappyBird/flappyBirdWindow.js";

// Handle Start button click
const StartNavigationContainer = document.getElementById("start-navigation")
const StartButton = document.getElementById("start-button")

StartButton.addEventListener("click",() => {
  StartNavigationContainer.classList.toggle("inactive")
})

StartButton.addEventListener("blur", () => {
  StartNavigationContainer.classList.add("inactive")
})

// Process bottom-right system timer
const TimeDOM = document.getElementById("time")
let currentTime = ``

function processTime(time){
  const Hours = time.getHours()
  const Minutes = time.getMinutes()

  let displayedMinutes = Minutes < 10 ? `0${Minutes}` : Minutes

  if(Hours === 0){
    return `${Hours + 12}: ${displayedMinutes} AM`
  }else if(Hours < 12){
    return `${Hours}: ${displayedMinutes} AM`
  }else if(Hours === 12){
    return `${Hours}: ${displayedMinutes} PM`
  }else{
    return `${Hours - 12}: ${displayedMinutes} PM`
  }
}

function TimeUpdaterFunction() {
  const Time = new Date()
  const TimeString = processTime(Time)

  if(currentTime === TimeString) return

  TimeDOM.innerText = TimeString
  currentTime = TimeString
}

TimeUpdaterFunction()

const TimeUpdater = new Interval(TimeUpdaterFunction, 1);

TimeUpdater.set()
Interval.startMainInterval(60)

Welcome.openWindow()