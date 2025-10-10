import express from "express";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";

const app = express();
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "tasks.json");

const readTasks = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const saveTasks = (tasks) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
};


app.get("/tasks", (req, res) => {
  const { status = "all", search = "", page = 1, limit = 5 } = req.query;
  let tasks = readTasks();


  if (status !== "all") {
    tasks = tasks.filter((t) =>
      status === "completed" ? t.completed : !t.completed
    );
  }


  if (search.trim()) {
    tasks = tasks.filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  const total = tasks.length;
  const start = (page - 1) * limit;
  const paginated = tasks.slice(start, start + Number(limit));

  res.json({ total, page: Number(page), tasks: paginated });
});


app.post("/tasks", (req, res) => {
  const tasks = readTasks();
  const newTask = {
    id: Date.now(),
    title: req.body.title,
    completed: false,
  };
  tasks.unshift(newTask);
  saveTasks(tasks);
  res.json(newTask);
});


app.put("/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const updated = tasks.map((t) =>
    t.id === Number(req.params.id) ? { ...t, ...req.body } : t
  );
  saveTasks(updated);
  res.json({ message: "Task updated successfully" });
});


app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const tasks = readTasks().filter((t) => t.id !== id);
  saveTasks(tasks);
  res.json({ message: "Task deleted successfully" });
});

app.listen(3000);
