<script setup>
import { ref } from 'vue';
import {useRouter} from "vue-router";

const formData = ref({
  login: '',
  password: ''
});
const router = useRouter();
const submitForm = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/adduser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData.value)
    });

    if (response.ok) {
      // Handle success, e.g., redirect to another page or show a success message
      router.push('/approve');
      console.log('User register successfully');
    } else {
      // Handle errors, e.g., show an error message
      console.error('Failed to register user');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
</script>

<template>
  <div class="container">
    <h1>Регистрация администратора</h1>
    <form id="registrationform" @submit.prevent="submitForm">
      <label for="login">Логин</label>
      <input type="text" id="login" name="login" v-model="formData.login" required>

      <label for="email">Почта</label>
      <input type="email" id="email" name="email" required>

      <label for="password">Пароль</label>
      <input type="password" id="password" name="password" v-model="formData.password" required>

      <button type="submit">Зарегистрироваться</button>
    </form>
    <p>Уже зарегистрированы? <a href="admin_sign_in.vue">Войти</a></p>
  </div>
</template>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
}

.logout {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
}

.status-filters {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}

.status-button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  background-color: #f0f0f0;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.5rem;
  text-align: center;
  border: 1px solid #ccc;
}

.approve-button, .reject-button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.approve-button {
  background-color: #28a745;
  color: #fff;
}

.reject-button {
  background-color: #dc3545;
  color: #fff;
}

</style>