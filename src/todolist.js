const todolist = document.querySelector("#todolist");
const pressEnter = 13;

function createDivElem(classList) {
  const newElem = document.createElement("div");
  if (classList.length !== 0) newElem.classList = classList;
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

function settingTodo(e) {}

function addTodo(e) {
  const input = document.querySelector(".add-todo");
  if (input.value.length === 0 || e.which !== pressEnter) return;
  const newElem = createDivElem(["todo-item"]);
  const check = createInputElem("checkbox");
  const todo = createDivElem(["todo"]);
  const setting = createDivElem(["setting", "menu"]);

  check.className = "check";
  check.type = "checkbox";
  check.addEventListener("click", checkTodo);
  todo.innerText = input.value;
  setting.classList = "fas fa-ellipsis-v";
  setting.addEventListener("click", settingTodo);

  newElem.appendChild(check);
  newElem.appendChild(todo);
  newElem.appendChild(setting);

  todolist.appendChild(newElem);
  input.value = "";
}

function addTodoInput() {
  const addButton = createInputElem("text");
  addButton.placeholder = "New Todo";
  addButton.className = "add-todo";
  todolist.appendChild(addButton);
  addButton.addEventListener("keypress", addTodo);
}

addTodoInput();
