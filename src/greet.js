const greet = document.querySelector("#greet");
const greetMssage = document.querySelector("#greetMssage");
const username = document.querySelector("#username");
const lsID = "tlusername";

function getGreetingWord() {
  const time = new Date();
  const curTime = time.getHours();
  if (curTime >= 5 && curTime <= 10) return "Good morning, ";
  if (curTime > 10 && curTime <= 4) return "Good afternoon, ";
  if (curTime > 6 && curTime <= 8) return "Good evening, ";
  return "Hello, ";
}

function getUsername() {
  const username = localStorage.getItem(lsID);
  if (!username) return "there";
  return username;
}

function setUsername() {
  var prompt = window.prompt("What is your name?");
  if (!prompt) return;
  username.innerText = prompt;
  localStorage.setItem(lsID, prompt);
}

greetMssage.innerText = getGreetingWord();
username.innerText = getUsername();
username.addEventListener("click", setUsername);
