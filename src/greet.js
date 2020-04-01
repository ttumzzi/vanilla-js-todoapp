const greet = document.querySelector("#greet");
const greetMssage = document.querySelector("#greetMssage");
const usernameElem = document.querySelector("#username");
const getLSkey = () => {
  return {
    lsID: "tluid",
    lsTodo: "tltodos"
  };
};

async function getUsernameFromtLS() {
  const uid = localStorage.getItem(getLSkey().lsID);
  if (!uid) {
    document.location.href = "./signin.html";
    return;
  }
  let username = "";
  await fetch(`https://rhubarb-cupcake-67582.herokuapp.com/greet?uid=${uid}`)
    .then(res => res.json())
    .then(data => {
      username = data;
    })
    .catch(() => {
      username = "there";
      console.log("Cannot connect a network");
    });
  return username;
}

function getGreetingWord() {
  const time = new Date();
  const curTime = time.getHours();
  if (curTime >= 5 && curTime <= 10) return "Good morning, ";
  if (curTime > 10 && curTime <= 18) return "Good afternoon, ";
  if (curTime > 18 && curTime <= 20) return "Good evening, ";
  return "Hello,";
}

async function getUsername() {
  const username = await getUsernameFromtLS();
  usernameElem.innerText = username ? username : "there";
}

function setUsername() {
  const username = getUsernameFromtLS();
  const confirmMessage = username
    ? "Do you want to change yout account?😊"
    : "Do you want to join us?😊";
  const confirm = window.confirm(confirmMessage);
  if (!confirm) return;
  localStorage.removeItem(getLSkey().lsTodo);
  localStorage.removeItem(getLSkey().lsID);
  document.location.href = "./signin.html";
}

getUsername();
greetMssage.innerText = getGreetingWord();
usernameElem.addEventListener("click", setUsername);
