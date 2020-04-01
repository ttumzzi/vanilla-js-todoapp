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

function getLSUid() {
  return localStorage.getItem(getLSkey().lsID);
}

function saveLocalStorage(newData) {
  localStorage.setItem(getLSkey().lsTodo, JSON.stringify(newData));
}

function sendPostRequest(item) {
  if (!getLSkey().lsTodo) return;
  const { method, target, obj } = item;
  const url = `http://localhost:3000/${target}`;
  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj)
  })
    .then(res => res.json())
    .then(data => {
      if (data.code !== 200) console.log(data);
    });
}

// making element templates
function createDivElem(classList) {
  const newElem = document.createElement("div");
  if (classList.length !== 0) newElem.classList.add(...classList);
  return newElem;
}

function createInputElem(type) {
  const newElem = document.createElement("input");
  if (type.length !== 0) newElem.type = type;
  return newElem;
}

// handling functions
function checkTodo(e) {
  e.target.classList.toggle("done");
  const id = this.parentNode.id;
  const check = e.target.classList.contains("done");

  const curLSData = getLSTodo();
  const newLSData = curLSData.map(item => {
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
  const newLSData = curLSData.map(item => {
    if (item.id === id) return { ...item, todo: prompt };
    return item;
  });
  saveLocalStorage(newLSData);
  sendPostRequest({
    method: "put",
    target: "edittodo",
    obj: { id, todo: prompt }
  });
}

function handleRemoveTodo(id) {
  const todolist = document.getElementById("todolist");
  const removingTodo = document.getElementById(id);
  todolist.removeChild(removingTodo);
  const curLSData = getLSTodo();
  const newLSData = curLSData.filter(item => {
    if (item.id === id) return false;
    return true;
  });
  saveLocalStorage(newLSData);
  sendPostRequest({ method: "delete", target: "removetodo", obj: { id } });
}

function createSettingDropdown(id) {
  const setting = createDivElem(["setting", "dropdown"]);
  const settingButton = document.createElement("button");
  const dropdown = createDivElem(["dropdown-menu", "dropdown-menu-right"]);
  const edit = createDivElem(["dropdown-item"]);
  const remove = createDivElem(["dropdown-item"]);

  settingButton.classList.add(...["setting-btn", "fas", "fa-ellipsis-v"]);
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
  const newElem = createDivElem(["todo-item"]);
  newElem.setAttribute("id", id);
  todolist.appendChild(newElem);

  const checkElem = createInputElem("checkbox");
  const todoElem = createDivElem(["todo"]);
  const settingElem = createSettingDropdown(id);

  checkElem.className = check ? "check done" : "check";
  checkElem.checked = check;
  checkElem.addEventListener("click", checkTodo);
  todoElem.innerText = todo;

  newElem.appendChild(checkElem);
  newElem.appendChild(todoElem);
  newElem.appendChild(settingElem);
}

function addTodoInput() {
  const addInput = createInputElem("text");
  addInput.placeholder = "New Todo";
  addInput.className = "add-todo";
  todolist.appendChild(addInput);
  addInput.addEventListener("keypress", e => {
    if (addInput.value.length === 0 || e.which !== pressEnter) return;

    const uid = getLSUid();
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
      obj: { uid, id, todo, check }
    });

    addInput.value = "";
  });
}

function loadLocalStorage() {
  const curLSData = getLSTodo();
  curLSData.map(item => {
    addTodo(item);
  });
}

addTodoInput();
loadLocalStorage();
