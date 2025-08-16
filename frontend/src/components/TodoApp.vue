<template>
  <div class="todo-app">
    <form @submit.prevent="addTodo">
      <input type="text" v-model="newTodo" placeholder="Add todo..." />
      <button type="submit" :disabled="!newTodo.trim()">Add</button>
    </form>

    <ul>
      <li v-for="todo in todos" :key="todo._id">
        <span>{{ todo.text }}</span>
         <input class="chack"
          type="checkbox"
          :checked="todo.completed"
          @change="toggleTodo(todo)"
        />
        <span :class="{ done: todo.completed }">{{ todo.title }}</span>
        <button @click="updateTodo(todo)" v-if="!todo.completed">
            Edit
        </button>

        <button @click="deleteTodo(todo._id)" v-if="!todo.completed">
            Delete
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      todos: [],
      newTodo: ""
    };
  },
  methods: {
    async fetchTodos() {
      const res = await axios.get("http://localhost:3000/todos");
      this.todos = res.data;
    },
  async addTodo() {
  const trimmedTitle = this.newTodo.trim();
  if (!trimmedTitle) return;

  await axios.post("http://localhost:3000/todos", {
    title: trimmedTitle,
    completed: false
  });

  this.newTodo = "";       
  this.fetchTodos();        
},
async toggleTodo(todo) {
      try {
        const updated = { completed: !todo.completed };
        await axios.put(`http://localhost:3000/todos/${todo._id}`, updated);
        todo.completed = !todo.completed;
      } catch (err) {
        console.error('toggleTodo error', err);
        await this.fetchTodos();
      }
    },

    async updateTodo(todo) {
    const newTitle = prompt("Enter new title", todo.title);
    if (!newTitle || !newTitle.trim()) return;

    const updatedTodo = { ...todo, title: newTitle.trim() };
    await axios.put(`http://localhost:3000/todos/${todo._id}`, updatedTodo);
    this.fetchTodos();
  },
    async deleteTodo(id) {
      await axios.delete(`http://localhost:3000/todos/${id}`);
      this.fetchTodos();
    }
  },
  mounted() {
    this.fetchTodos();
  }
};
</script>

<style>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: linear-gradient(135deg, #f9f947ff, #abef35ff);
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #333333ff;
}

.todo-app {
  background: linear-gradient(135deg, #ff9a9e, #fad0c4);
  padding: 20px;
  max-width: 500px;
  margin: auto;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;
}

.todo-app:hover {
  transform: scale(1.01);
}

.todo-app h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #2e4741;
  font-size: 1.6rem;
  letter-spacing: 1px;
}

form {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

input[type="text"] {
  border: 1px solid #d6d6d6;
  border-radius: 6px;
  padding: 10px;
  width: 70%;
  font-size: 14px;
  transition: border 0.3s ease, box-shadow 0.3s ease;
}

input[type="text"]:focus {
  border: 1px solid #5c9ead;
  box-shadow: 0 0 6px rgba(92, 158, 173, 0.4);
  outline: none;
}

button {
  padding: 10px 16px;
  background-color: #5c9ead;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #4a8793;
  transform: scale(1.05);
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 10px 14px;
  border: 1px solid #ececec;
  border-radius: 8px;
  background: #fdfdfd;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.3s ease, transform 0.2s ease;
}

li:hover {
  background: #f7f7f7;
  transform: translateX(4px);
}

.done {
  text-decoration: line-through;
  color: #888;
}

</style> 
