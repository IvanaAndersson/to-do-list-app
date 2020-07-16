//saving a reference to the HTML objects
const inputElement = document.getElementById("item") as HTMLInputElement;
const buttonAdd = document.getElementById("addItem") as HTMLButtonElement;
const completedList = document.getElementById("completed") as HTMLButtonElement;
const todoList = document.getElementById("todo") as HTMLUListElement;

const todoListLocalStored = localStorage.getItem("todoList");
const defaultData = {
  todo: [],
  completed: [],
};

const data =
  todoListLocalStored !== null ? JSON.parse(todoListLocalStored) : defaultData;

function dataObjectUpdated() {
  localStorage.setItem("todoList", JSON.stringify(data));
}

const createElement = (
  type: string,
  content: (string | HTMLElement)[] | string,
  attributes?: object
) => {
  //make a function which creates an element of a given type
  const element = document.createElement(type);

  if (attributes !== undefined) {
    Object.assign(element, attributes);
  }

  if (Array.isArray(content)) {
    content.forEach(append);
  } else {
    append(content);
  }

  function append(node: any) {
    if (typeof node === "string") {
      node = document.createTextNode(node);
    }

    element.appendChild(node);
  }

  return element;
};

function removeItem(this: any) {
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

function completeItem(this: any) {
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
  target?.insertBefore(item, target.childNodes[0]);
}

const addItemTodo = (taskText: string, completed?: boolean) => {
  const list = completed ? completedList : todoList;
  //creating the additional elements
  const removeButton = createElement("button", "", { classList: "remove" });
  const completeButton = createElement("button", "", { classList: "complete" });
  const buttons = createElement("div", [removeButton, completeButton], {
    classList: "buttons",
  });
  const item = createElement("li", [taskText, buttons]);
  // add click even for removing an item
  removeButton.addEventListener("click", removeItem);
  //add click event to completing an item
  completeButton.addEventListener("click", completeItem);

  list.insertBefore(item, list.childNodes[0]);
};

const renderTodoList = () => {
  if (!data.todo.length && !data.completed.length) return;

  data.todo.forEach((el: string) => addItemTodo(el));

  data.completed.forEach((el: string) => addItemTodo(el, true));
};

buttonAdd.addEventListener("click", () => {
  const taskText = inputElement.value;

  if (taskText) {
    addItemTodo(taskText);
    inputElement.value = "";

    data.todo.push(taskText);
    dataObjectUpdated();
  }
});

inputElement.addEventListener("keydown", (event) => {
  const taskText = inputElement.value;

  if (event.code === "Enter" || event.code === "NumpadEnter") {
    event.preventDefault();

    addItemTodo(taskText);
    inputElement.value = "";

    data.todo.push(taskText);
    dataObjectUpdated();
  }
});

renderTodoList();
