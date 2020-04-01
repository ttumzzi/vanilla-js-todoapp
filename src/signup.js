const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const submit = document.getElementById("signup-btn");
const getLSkey = () => "tluid";

const validateEmail = mail => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) return true;
  return false;
};

const generateID = () => {
  const ALPHABET =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const ID_LENGTH = 8;
  let result = "";

  for (let i = 0; i < ID_LENGTH; i++)
    result += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));

  return result;
};

const saveToLocalstorage = username => {
  localStorage.setItem(getLSkey(), username);
};

submit.addEventListener("click", () => {
  if (
    !username.value ||
    !email.value ||
    !validateEmail(email.value) ||
    !password.value
  )
    return;

  const uid = generateID();
  fetch("http://localhost:3000/signup", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uid,
      username: username.value,
      email: email.value,
      password: password.value
    })
  })
    .then(response => response.json())
    .then(data => {
      // status code
      // 200(Ok) => success
      // 409(Conflict) => same email
      if (data.code === 200) {
        saveToLocalstorage(uid);
        window.location.href = "./index.html";
      }
      if (data.code === 409) {
        window.alert("Email address already exists");
        email.value = "";
      }
    })
    .catch(e => console.log(e));
});
