const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());

const DATA_FILE = path.join(__dirname, "tasks.json");


const readTasks = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};


const writeTasks = (tasks) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
};

app.get("/tasks", (req, res) => {
  const tasks = readTasks();
  res.json(tasks); 
});


app.post("/tasks", (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Title required" });

  const tasks = readTasks();
  const newTask = {
    id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
    title,
    completed: false,
  };

  tasks.push(newTask);
  writeTasks(tasks);

  res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body; 
  const tasks = readTasks();
  const task = tasks.find((t) => t.id === parseInt(id));

  if (!task) return res.status(404).json({ error: "Task not found" });


  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;

  writeTasks(tasks);
  res.json(task);
});


app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  let tasks = readTasks();
  const taskExists = tasks.some((t) => t.id === parseInt(id));

  if (!taskExists) return res.status(404).json({ error: "Task not found" });

  tasks = tasks.filter((t) => t.id !== parseInt(id));
  writeTasks(tasks);

  res.json({ success: true });
});


app.listen(3000);
