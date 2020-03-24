const todolist = document.querySelector("#todolist");

function createDivElem(classList) {
  const newElem = document.createElement("div");
  if (classList.length !== 0) newElem.classList = classList;
  return newElem;
}

function addTodoButton() {
  const addButton = createDivElem([]);
  addButton.innerText = "New Todo";
  todolist.appendChild(addButton);
}

function addTodo() {
  const check = createDivElem(["check"]);
  const todo = createDivElem(["todo"]);
  const remove = createDivElem(["remove"]);
}

addTodoButton();
