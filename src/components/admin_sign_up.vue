<script setup>
import { ref } from 'vue';
import {useRouter} from "vue-router";
import { apiUrl } from '@/main.js';
import axios from "axios";
const formData = ref({
  username: '',
  password: ''
});
const router = useRouter();
const submitForm = async () => {
  try {
    const response = await axios.post(`http://localhost:8080/api/v1/users`, formData.value, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 201) {
      // Handle success, e.g., redirect to another page or show a success message
      router.push('/approve-registration');
      console.log('User registered successfully');
    } else {
      // Handle errors, e.g., show an error message
      console.error('Failed to register user');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

const navigateToSignIn = async() => {
    router.push('/login');
};
</script>

<template>
  <header>
    <img src="../assets/Logo.svg" alt="">
  </header>
  <div class="container">
    <div class = "form-background">
      <h1>Добро пожаловать!</h1>
      <form id="registrationform" @submit.prevent="submitForm">
        <input type="text" id="login" name="login" v-model="formData.username" required placeholder="Логин">

        <input type="email" id="email" name="email" required placeholder="Эл. почта">

        <input type="password" id="password" name="password" v-model="formData.password" required placeholder="Пароль">

        <button type="submit">Зарегистрироваться</button>
      </form>
      <p class="authorize">Уже зарегистрированы? <a href="#" @click.prevent="navigateToSignIn()">Войти</a></p>
    </div>
  </div>
</template>

<style scoped>
body {
  background-color: rgb(255, 255, 255);
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

header {
  /* Logo */
  position: absolute;
  width: 291px;
  height: 100px;
  left: 42px;
  top: 10px;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.form-background {
  width: 450px;
  height: 450px;
  padding: 30px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 
                0 6px 20px rgba(0, 0, 0, 0.1);
  background: rgb(255, 255, 255);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10%; 
}
h1{
  color: rgb(63, 85, 101);
  font-family:"Inter-regular";
  font-size: 32px;
  font-weight: 400;
  line-height: 39px;
  letter-spacing: 0%;
  text-align: left;
  padding-bottom: 20px;
}
form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

input {
  width: 380px;
  height: 25px;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid rgb(63, 85, 101);

  font-family: "Inter-regular";
  font-size:20px;
}

button {
  padding: 10px;
  margin: 40px 20px 10px 20px;
  width: 400px;
  background-color:  rgb(63, 85, 101);
  text-decoration: none;
  border-radius: 5px;
  border:none;
  outline: none;

  color:white;
  font-family: "Inter-regular";
  font-size: 20px;
  font-weight: 100;
  line-height: 29px;
  letter-spacing: 0%;
  text-align: center;
}
button:focus{
  outline: none;
}
button:hover{
  background-color:  rgb(134, 166, 189);
  transition: all 0.5s ease;
}
input:focus{
  outline: none;
}
::placeholder{
  font-family: "Inter-regular";
  font-size: 20px;
  color: rgb(63, 85, 101);
}
.authorize{
  padding-top: 20px;
  font-family: "Inter-light";
  font-size: 20px;
  font-weight: 400px;
  color: rgb(63, 85, 101);
}
@font-face {
  font-family: "Inter-regular";
  src: url(/src/fonts/Inter-Regular.ttf);
}
@font-face {
  font-family: "Inter-light";
  src: url(/src/fonts/Inter-Light.ttf);
}
</style>