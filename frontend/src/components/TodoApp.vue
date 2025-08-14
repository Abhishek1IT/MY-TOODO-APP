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
  background-color: #41625dff;
  padding: 20px;
}

.todo-app {
  padding: 10px;
  max-width: 500px;
  margin: auto;
  font-family: Arial;
}

form {
  margin-bottom: 20px;
}

input[type="text"] {
  border: 1px solid #f7a5a5ff;
  border-radius: 4px;
  padding: 8px;
  width: 70%;
}

button {
  padding: 8px 12px;
  margin-left: 10px;
  background-color: #b1d6718d;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #96ccf3ff;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 6px 10px;
  border: 1px solid #e6ccccff;
  border-radius: 4px;
  background: white;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

li:hover {
  background: #f7f7f7;
}

.done {
  text-decoration: line-through;
  color: gray;
}
</style> 