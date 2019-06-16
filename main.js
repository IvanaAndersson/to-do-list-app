// @ts-check
const inputElement = document.getElementById("item");
if(!(inputElement instanceof HTMLInputElement)) {
    throw new Error('Input element is not an input!');
}

const data = localStorage.getItem("todoList")
  ? JSON.parse(localStorage.getItem("todoList"))
  : {
      todo: [],
      completed: []
    };

document.getElementById("addItem").addEventListener("click", function() {
  const taskText = inputElement.value;

  if (taskText) {
    addItemTodo(taskText);
    inputElement.value = "";

    data.todo.push(taskText);
    dataObjectUpdated();
  }
});

inputElement.addEventListener("keydown", function(event) {
  const taskText = inputElement.value;

  if (event.code === "Enter" || event.code === "NumpadEnter") {
    event.preventDefault();

    addItemTodo(taskText);
    inputElement.value = "";

    data.todo.push(taskText);
    dataObjectUpdated();
  }
});

const renderTodoList = () => {
  if (!data.todo.length && !data.completed.length) return;

  for (let i = 0; i < data.todo.length; i++) {
    const value = data.todo[i];
    addItemTodo(value);
  }

  for (let j = 0; j < data.completed.length; j++) {
    const value = data.completed[j];
    addItemTodo(value, true);
  }
}

function dataObjectUpdated() {
  localStorage.setItem("todoList", JSON.stringify(data));
}

function removeItem() {
  const button = this;
  const div = button.parentNode;
  const item = div.parentNode;
  const parent = item.parentNode;
  const id = parent.id;
  const value = item.innerText;

  if (id === "todo") {
    data.todo.splice(data.todo.indexOf(value), 1);
  } else {
    data.completed.splice(data.completed.indexOf(value), 1);
  }
  dataObjectUpdated();

  parent.removeChild(item);
}

function completeItem() {
  const item = this.parentNode.parentNode;
  const parent = item.parentNode;
  const id = parent.id;
  const value = item.innerText;

  if (id === "todo") {
    data.todo.splice(data.todo.indexOf(value), 1);
    data.completed.push(value);
  } else {
    data.completed.splice(data.completed.indexOf(value), 1);
    data.todo.push(value);
  }
  dataObjectUpdated();

  //check if the item should be added to the completed list or re-added to the to-do list
  const target =
    id === "todo"
      ? document.getElementById("completed")
      : document.getElementById("todo");
  parent.removeChild(item);
  target.insertBefore(item, target.childNodes[0]);
}

function addItemTodo(taskText, completed) {
  const list = completed ? document.getElementById("completed") : document.getElementById("todo");

  const item = document.createElement("li");
  item.innerText = taskText;

  const buttons = document.createElement("div");
  buttons.classList.add("buttons");

  const removeButton = document.createElement("button");
  removeButton.classList.add("remove");
  // add click even for removing an item
  removeButton.addEventListener("click", removeItem);

  const completeButton = document.createElement("button");
  completeButton.classList.add("complete");
  //add click event to completing an item
  completeButton.addEventListener("click", completeItem);

  buttons.appendChild(removeButton);
  buttons.appendChild(completeButton);
  item.appendChild(buttons);
  list.insertBefore(item, list.childNodes[0]);
}

renderTodoList();