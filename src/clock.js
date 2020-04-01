const time = document.querySelector("#time");

function getRevisedTime(time) {
  const result = time < 10 ? `0${time}` : `${time}`;
  return result;
}

function setTime() {
  const curTime = new Date();
  const hour24 = curTime.getHours();
  const hour = hour24 > 12 ? hour24 - 12 : hour24;
  const minute = curTime.getMinutes();
  time.innerText = `${getRevisedTime(hour)}:${getRevisedTime(minute)}`;
}

function displayClock() {
  setTime();
  setInterval(() => {
    setTime();
  }, 6000);
}

displayClock();
