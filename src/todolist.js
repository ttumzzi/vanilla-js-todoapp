const todolist = document.querySelector("#todolist");
const pressEnter = 13;

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

function checkTodo(e) {
  e.target.classList.toggle("done");
}

function handleEditTodo(id) {
  const prompt = window.prompt("What to change?");
  if (!prompt) return;

  const item = document.getElementById(id);
  item.querySelector(".todo").innerText = prompt;
}

function handleRemoveTodo(id) {
  const confirm = window.confirm("Are you sure you want to delete this todo?");
  if (!confirm) return;

  const todolist = document.getElementById("todolist");
  const item = document.getElementById(id);
  todolist.removeChild(item);
}

function createSettingDropdown(id) {
  const setting = createDivElem(["setting", "dropdown"]);
  const settingButton = createDivElem(["setting-btn", "fas", "fa-ellipsis-v"]);
  const dropdown = createDivElem(["dropdown-menu", "dropdown-menu-right"]);
  const edit = createDivElem(["dropdown-item"]);
  const remove = createDivElem(["dropdown-item"]);

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

function addTodo(e) {
  const input = document.querySelector(".add-todo");
  if (input.value.length === 0 || e.which !== pressEnter) return;
  const newElem = createDivElem(["todo-item"]);
  const id = generateID();
  newElem.setAttribute("id", id);
  todolist.appendChild(newElem);

  const check = createInputElem("checkbox");
  const todo = createDivElem(["todo"]);
  const setting = createSettingDropdown(id);

  check.className = "check";
  check.addEventListener("click", checkTodo);
  todo.innerText = input.value;

  newElem.appendChild(check);
  newElem.appendChild(todo);
  newElem.appendChild(setting);

  input.value = "";
}

function addTodoInput() {
  const addInput = createInputElem("text");
  addInput.placeholder = "New Todo";
  addInput.className = "add-todo";
  todolist.appendChild(addInput);
  addInput.addEventListener("keypress", addTodo);
}

addTodoInput();
