const todolist = document.querySelector("#todolist");
const pressEnter = 13;

// managing local storage
function getLSTodo() {
  const list = localStorage.getItem(getLSkey().lsTodo);
  if (!list) {
    saveLocalStorage([]);
    return [];
  }
  return JSON.parse(list);
}

function saveLocalStorage(newData) {
  localStorage.setItem(getLSkey().lsTodo, JSON.stringify(newData));
}

function sendPostRequest(item) {
  if (!getLSkey().lsTodo) return;
  const { method, target, obj } = item;
  const url = `https://rhubarb-cupcake-67582.herokuapp.com/${target}`;
  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.code !== 200) console.log(data);
    });
}

// making element templates
function createElem({ tag, classList, type }) {
  const newElem = document.createElement(tag);
  if (classList && classList.length) newElem.classList.add(...classList);
  if (type) newElem.type = type;
  return newElem;
}

// handling functions
function checkTodo(e) {
  e.target.classList.toggle("done");
  const id = this.parentNode.id;
  const check = e.target.classList.contains("done");

  const curLSData = getLSTodo();
  const newLSData = curLSData.map((item) => {
    if (item.id === id) return { ...item, check: !item.check };
    return item;
  });
  saveLocalStorage(newLSData);
  sendPostRequest({ method: "put", target: "checktodo", obj: { id, check } });
}

function handleEditTodo(id) {
  const prompt = window.prompt("What to change?");
  if (!prompt) return;

  const changedTodo = document.getElementById(id);
  changedTodo.querySelector(".todo").innerText = prompt;

  const curLSData = getLSTodo();
  const newLSData = curLSData.map((item) => {
    if (item.id === id) return { ...item, todo: prompt };
    return item;
  });
  saveLocalStorage(newLSData);
  sendPostRequest({
    method: "put",
    target: "edittodo",
    obj: { id, todo: prompt },
  });
}

function handleRemoveTodo(id) {
  const todolist = document.getElementById("todolist");
  const removingTodo = document.getElementById(id);
  todolist.removeChild(removingTodo);
  const curLSData = getLSTodo();
  const newLSData = curLSData.filter((item) => {
    if (item.id === id) return false;
    return true;
  });
  saveLocalStorage(newLSData);
  sendPostRequest({ method: "delete", target: "removetodo", obj: { id } });
}

function createSettingDropdown(id) {
  const setting = createElem({
    tag: "div",
    classList: ["setting", "dropdown"],
  });
  const settingButton = createElem({
    tag: "button",
    classList: ["setting-btn"],
  });
  const settingBtnImage = createElem({ tag: "img" });
  const dropdown = createElem({
    tag: "div",
    classList: ["dropdown-menu", "dropdown-menu-right"],
  });
  const edit = createElem({ tag: "div", classList: ["dropdown-item"] });
  const remove = createElem({ tag: "div", classList: ["dropdown-item"] });

  settingBtnImage.setAttribute("src", "../src/ic_menu.png");
  settingButton.appendChild(settingBtnImage);
  settingButton.setAttribute("data-toggle", "dropdown");
  settingButton.setAttribute("aria-haspopup", "true");
  settingButton.setAttribute("aria-expanded", "false");

  dropdown.setAttribute("aria-labelledby", "dropdownMenuButton");
  edit.innerText = "edit";
  edit.addEventListener("click", () => handleEditTodo(id));
  remove.innerText = "remove";
  remove.addEventListener("click", () => handleRemoveTodo(id));
  dropdown.appendChild(edit);
  dropdown.appendChild(remove);

  setting.appendChild(settingButton);
  setting.appendChild(dropdown);

  return setting;
}

function generateID() {
  const ALPHABET =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const ID_LENGTH = 8;
  let result = "";

  for (let i = 0; i < ID_LENGTH; i++)
    result += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));

  return result;
}

// make elements
function addTodo(item) {
  const { id, todo, check } = item;
  const newElem = createElem({ tag: "div", classList: ["todo-item"] });
  newElem.setAttribute("id", id);
  todolist.appendChild(newElem);

  const checkElem = createElem({
    tag: "input",
    type: "checkbox",
    classList: check ? ["check", "done"] : ["check"],
  });
  const todoElem = createElem({ tag: "div", classList: ["todo"] });
  const settingElem = createSettingDropdown(id);

  checkElem.checked = check;
  checkElem.addEventListener("click", checkTodo);
  todoElem.innerText = todo;

  newElem.appendChild(checkElem);
  newElem.appendChild(todoElem);
  newElem.appendChild(settingElem);
}

function addTodoInput() {
  const addInput = createElem({
    tag: "input",
    type: "text",
    classList: ["add-todo"],
  });
  addInput.placeholder = "New Todo";
  todolist.appendChild(addInput);
  addInput.addEventListener("keypress", (e) => {
    if (addInput.value.length === 0 || e.which !== pressEnter) return;

    const uid = localStorage.getItem(getLSkey().lsID);
    const id = generateID();
    const todo = addInput.value;
    const check = false;
    addTodo({ id, todo, check });

    // save to local storage
    const curLSData = getLSTodo();
    const newTodo = { id, todo: todo, check: false };
    const newLSData = [...curLSData, newTodo];
    saveLocalStorage(newLSData);

    // send to server
    sendPostRequest({
      method: "post",
      target: "addtodo",
      obj: { uid, id, todo, check },
    });

    addInput.value = "";
  });
}

function loadLocalStorage() {
  const curLSData = getLSTodo();
  curLSData.map((item) => {
    addTodo(item);
  });
}

addTodoInput();
loadLocalStorage();
