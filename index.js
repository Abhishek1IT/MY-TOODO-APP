import express from "express";
import mongoose from "mongoose";
import { v4 as uuid } from "uuid";
import users from "./user.js"; 
const app = express();
const PORT = 3000;

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/todo-App", {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

const todoSchema = new mongoose.Schema({
  id: String,
  name: String,
  completed: Boolean,
});
const Todo = mongoose.model("Todo", todoSchema);

app.get("/Api/user", (req, res) => {
  res.send(users);
});

app.get("/", (req, res) => {
  res.json({ msg: "Todo List" });
});

app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.get("/todos/:id", async (req, res) => {
  const todo = await Todo.findOne({ id: req.params.id });
  if (todo) {
    res.json({ msg: "1 Todo", data: todo });
  } else {
    res.status(404).json({ msg: "Todo not found" });
  }
});

app.post("/todos", async (req, res) => {
  const newTodo = new Todo({ id: uuid(), ...req.body });
  await newTodo.save();
  res.json({ msg: "Added a Todo", data: newTodo });
});

app.put("/todos/:id", async (req, res) => {
  const updatedTodo = await Todo.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { new: true }
  );
  if (updatedTodo) {
    res.json({ msg: "Edited Todo", data: updatedTodo });
  } else {
    res.status(404).json({ msg: "Todo not found" });
  }
});

app.delete("/todos/:id", async (req, res) => {
  const deletedTodo = await Todo.findOneAndDelete({ id: req.params.id });
  if (deletedTodo) {
    res.json({ msg: "Deleted a Todo", data: deletedTodo });
  } else {
    res.status(404).json({ msg: "Todo not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
