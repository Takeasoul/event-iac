<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const formData = ref({
  name: '',
  password: ''
});
const router = useRouter();
const submitForm = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData.value)
    });
    if (response.ok) {
      const data = await response.json();
      console.log('Response:', data);
      // Перенаправляем на страницу администратора после успешного входа
      router.push('/admin-panel'); // Путь к странице администратора
    } else {
      console.error('Login failed:', response.statusText);
      // Обработка ошибки входа
    }
  } catch (error) {
    console.error('Error:', error);
    // Обработка ошибки, например, показать сообщение об ошибке
  }
};
</script>

<template>
  <div class="container">
    <h1>Вход администратора</h1>
    <form id="loginForm" @submit.prevent="submitForm">
      <label for="name">ФИО</label>
      <input type="text" id="login" name="login" v-model="formData.login" required>

      <label for="password">Пароль</label>
      <input type="password" id="password" name="password" v-model="formData.password" required>

      <button type="submit">Войти</button>
    </form>
    <p>Еще не зарегистрированы? <a href="admin_sign_up.vue">Регистрация</a></p>
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