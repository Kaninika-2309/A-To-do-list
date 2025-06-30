document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
});

let currentFilter = "all";

function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const due = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;

  if (text === "") return;

  const task = {
    id: Date.now(),
    text,
    due,
    priority,
    completed: false
  };

  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);

  document.getElementById("taskInput").value = "";
  document.getElementById("dueDate").value = "";
  renderTasks();
}

function toggleComplete(id) {
  let tasks = getTasks();
  tasks = tasks.map(t => {
    if (t.id === id) t.completed = !t.completed;
    return t;
  });
  saveTasks(tasks);
  renderTasks();
}

function deleteTask(id) {
  let tasks = getTasks();
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(tasks);
  renderTasks();
}

function editTask(id, newText) {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === id);
  if (task) task.text = newText;
  saveTasks(tasks);
  renderTasks();
}

function clearAllTasks() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    localStorage.removeItem("tasks");
    renderTasks();
  }
}

function setFilter(filter) {
  currentFilter = filter;
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let tasks = getTasks();

  if (currentFilter === "active") tasks = tasks.filter(t => !t.completed);
  if (currentFilter === "completed") tasks = tasks.filter(t => t.completed);

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    const textSpan = document.createElement("span");
    textSpan.textContent = task.text;
    textSpan.className = "task-text";
    textSpan.contentEditable = true;
    textSpan.addEventListener("blur", () => editTask(task.id, textSpan.textContent));

    const dueSpan = document.createElement("span");
    dueSpan.className = "due-date " + getDueClass(task.due);
    dueSpan.textContent = `(Due: ${task.due || "N/A"})`;

    const prioritySpan = document.createElement("span");
    prioritySpan.className = `priority-${task.priority}`;
    prioritySpan.textContent = `• ${task.priority}`;

    const main = document.createElement("div");
    main.onclick = () => toggleComplete(task.id);
    main.appendChild(textSpan);
    main.appendChild(document.createElement("br"));
    main.appendChild(dueSpan);
    main.appendChild(document.createTextNode(" "));
    main.appendChild(prioritySpan);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteTask(task.id);

    li.appendChild(main);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

function getDueClass(due) {
  if (!due) return "safe";
  const today = new Date();
  const dueDate = new Date(due);
  const diff = (dueDate - today) / (1000 * 60 * 60 * 24);
  if (diff < 0) return "overdue";
  if (diff <= 3) return "soon";
  return "safe";
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
