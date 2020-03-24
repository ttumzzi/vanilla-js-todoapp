const time = document.querySelector("#time");

function setTime() {
  const curTime = new Date();
  const hour = curTime.getHours();
  const minute = curTime.getMinutes();
  time.innerText = `${hour > 12 ? hour - 12 : hour}:${minute}`;
}

function displayClock() {
  setTime();
  setInterval(() => {
    setTime();
  }, 6000);
}

displayClock();
