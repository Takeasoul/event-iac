<template>
  <div>
    <header>
      <img src="../assets/Logo.svg" alt="Logo">
    </header>
    <div class="container" v-if="isRegistrationOpen">
      <div class="form-background">
        <h1>Регистрация на {{ eventName }}</h1>

        <p class="bottom-text">Проверьте корректность введённых данных, так как по ним будет проходить верификация на мероприятии.</p>

        <form @submit.prevent="submitForm">
          <div class="form-group">
            <input v-model="formData.lastname" type="text" id="lastname" name="lastname" placeholder="Фамилия *" required>
          </div>
          <div class="form-group">
            <input v-model="formData.firstname" type="text" id="firstname" name="firstname" placeholder="Имя *" required>
          </div>
          <div class="form-group">
            <input v-model="formData.middlename" type="text" id="middleName" name="middleName" placeholder="Отчество (при наличии)">
          </div>
          <div class="form-group">
            <input v-model="formData.company" type="text" id="company" name="company" placeholder="Полное наименование компании *" required>
          </div>
          <div class="form-group">
            <input v-model="formData.position" type="text" id="position" name="position" placeholder="Должность *" required>
          </div>
          <div class="form-group">
            <input v-model="formData.email" type="email" id="email" name="email" placeholder="Корпоративный адрес *" required>
          </div>
          <div class="form-group">
            <input v-model="formData.phone" v-mask="'+7 (###) ###-##-##'" type="tel" id="phone" name="phone" placeholder="Номер телефона *" required>
          </div>
          <button type="submit">Отправить</button>
        </form>

        <p class="bottom-text">Нажимая кнопку «Отправить», Вы соглашаетесь с Политикой конфиденциальности и условиями обслуживания.</p>
      </div>
    </div>
    <div class="container" v-else>
      <div class="form-background">
        <div class="cancel">
          <h1>Регистрация на мероприятие приостановлена</h1>
          <p>К сожалению, регистрация на это мероприятие временно приостановлена. Пожалуйста, попробуйте позже.</p>
          <p>Дата начала регистрации на мероприятие:</p>
          <p>{{startRegistrationDate}}</p>
          <p>Дата конца регистрации на мероприятие:</p>
          <p>{{closeRegistrationDate}}</p>
          <p>Введите адрес электронной почты, для получения увдомелния о старте регистрации</p>
          <form  @submit.prevent="submitAllertForm">
            <div class="form-group">
              <input v-model="allertFormData.email" type="email" id="email" name="email" placeholder="Корпоративный адрес" required>
            </div>
            <button type="submit">Отправить</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import axios from 'axios';
import {useRouter, useRoute} from 'vue-router';

const route = useRoute();
const router = useRouter();

import config from "@/configApi.js";

const formData = ref({
  middlename: '',
  firstname: '',
  lastname: '',
  company: '',
  position: '',
  email: '',
  phone: '',
  statusId: '',
  eventId: route.params.id,
});

const allertFormData = ref({
  email: '',
  eventId: route.params.id
});

const eventName = ref('');

const startRegistrationDate = ref('');

const closeRegistrationDate = ref('');

const isRegistrationOpen = ref(true);

const getEventInfo = async (eventId) => {
  try {
    const response = await axios.get(`${config.url}/api/v1/events/${eventId}`);
    if (response.data && response.data.name
        && response.data.name.length > 0
        && response.data.startRegistrationDate.length > 0
        && response.data.closeRegistrationDate.length > 0) {
      eventName.value = response.data.name;
      startRegistrationDate.value = new Intl.DateTimeFormat('ru-RU', {
        dateStyle: 'long',
        timeStyle: 'short'
      }).format(new Date(response.data.startRegistrationDate));


      closeRegistrationDate.value = new Intl.DateTimeFormat('ru-RU', {
        dateStyle: 'long',
        timeStyle: 'short'
      }).format(new Date(response.data.closeRegistrationDate));
    } else {
      console.error('Failed to fetch event information.');
    }
  } catch (error) {
    console.error('Error fetching event information:', error);
  }
};

const checkRegistrationStatus = async (eventId) => {
  try {
    const response = await axios.get(`${config.url}/api/v1/events/${eventId}/check`);
    isRegistrationOpen.value = response.status === 200;
  } catch (error) {
    console.error('Error checking registration status:', error);
    isRegistrationOpen.value = false;
  }
};

const submitForm = async () => {
  const eventId = route.params.id;
  try {
    const response = await axios.post(`${config.url}/api/v1/event-members`, formData.value);
    console.log('Registration successful:', response.data);
    const userId = response.data.id; // Получаем ID созданного пользователя
    router.push('/approve');
    const emailResponse = await axios.get(`${config.url}/api/email/greetings/${userId}`);
    console.log('Email send successful:', emailResponse.data);
    // Можно добавить обработку успешной регистрации, например, переход на другую страницу
  } catch (error) {
    console.error('Error submitting registration form:', error);
    // Можно добавить обработку ошибки, например, показ сообщения об ошибке пользователю
  }
};

const submitAllertForm = async () => {
  const eventId = route.params.id;
  try{

    const response = await axios.post(`${config.url}/api/v1/waiters`, allertFormData.value);
    console.log('Отправилось на сервер: ', response.data);

  }catch (error) {
    console.error('Error submitting registration form:', error);
    // Можно добавить обработку ошибки, например, показ сообщения об ошибке пользователю
  }
}

// Загрузка информации о мероприятии при создании компонента
getEventInfo(route.params.id);
checkRegistrationStatus(route.params.id);

</script>

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
  width: 800px;
  padding: 30px;
  border-radius: 5px;
  background: rgb(255, 255, 255);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 6%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: rgb(63, 85, 101);
  font-family: "Inter-regular";
  font-size: 32px;
  font-weight: 400;
  line-height: 39px;
  letter-spacing: 0%;
  text-align: left;
  padding-bottom: 5px;
}

.bottom-text {
  display: flex;
  font-family: "Inter-regular";
  align-items: center;
  color: black;
  font-size: 18px;
  text-align: -webkit-center;
  margin: 0;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.form-group {
  position: relative;
  margin-bottom: 20px;
}

input {
  width: 380px;
  height: 35px;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid rgb(63, 85, 101);
  font-family: "Inter-regular";
  font-size: 20px;
  position: relative;
}

button {
  padding: 10px;
  margin: 10px 20px 10px 20px;
  width: 400px;
  background-color: rgb(63, 85, 101);
  text-decoration: none;
  border-radius: 5px;
  border: none;
  outline: none;
  color: white;
  font-family: "Inter-regular";
  font-size: 20px;
  font-weight: 100;
  line-height: 29px;
  letter-spacing: 0%;
  text-align: center;
}

button:focus {
  outline: none;
}

button:hover {
  background-color: rgb(134, 166, 189);
  transition: all 0.5s ease;
}

input:focus {
  outline: none;
}

::placeholder {
  font-family: "Inter-regular";
  font-size: 20px;
  color: rgb(63, 85, 101);
}

.bottom-text {
  display: flex;
  font-family: "Inter-regular";
  align-items: center;
  color: black;
  font-size: 18px;
  text-align: -webkit-center;
  margin: 10px;
}

.cancel {
  text-align: center; /* Центрирует содержимое внутри элемента .cancel */
  padding: 20px; /* Добавляет отступы вокруг содержимого */
}

.cancel h1 {
  font-size: 32px; /* Размер шрифта для заголовка h1 */
  color: rgb(63, 85, 101); /* Цвет шрифта для заголовка h1 */
  font-family: "Inter-regular"; /* Шрифт для заголовка h1 */
  margin-bottom: 20px; /* Отступ снизу от заголовка h1 */
}

.cancel p {
  font-size: 25px; /* Размер шрифта для параграфа p */
  color: rgb(0, 0, 0); /* Цвет шрифта для параграфа p */
  font-family: "Inter-regular"; /* Шрифт для параграфа p */
  margin: 0; /* Убирает отступы вокруг параграфа p */
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
