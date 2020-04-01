const email = document.getElementById("email");
const password = document.getElementById("password");
const submit = document.getElementById("signup-btn");
const getLSkey = () => {
  return {
    lsID: "tluid",
    lsTodo: "tltodos"
  };
};

const validateEmail = mail => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) return true;
  return false;
};

const saveToLocalstorage = data => {
  const { uid, todos } = data;
  console.log(uid, todos);
  if (todos.length > 0)
    localStorage.setItem(getLSkey().lsTodo, JSON.stringify(todos));
  localStorage.setItem(getLSkey().lsID, uid);
};

submit.addEventListener("click", () => {
  if (!email.value || !validateEmail(email.value) || !password.value) return;
  fetch("http://localhost:3000/signin", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  })
    .then(res => res.json())
    .then(data => {
      // status code
      // 200(Ok) => success
      // 403(Forbidden) => fail(check email address or passwd)
      if (data.code === 200) {
        saveToLocalstorage(data);
        window.location.href = "./index.html";
      }
      if (data.code === 403) {
        window.alert("Uncorrect. Check your email adress or password please.");
      }
    });
});
