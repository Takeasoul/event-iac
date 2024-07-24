<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from "axios";
import { apiUrl } from '@/main.js';
// переменные для хранения данных
const memberData = ref({
  firstName: '',
  middleName: '',
  lastName: '',
  company: '',
  position: '',
  email: '',
  phone: '',
  approved: '',
  clumemeber: '',
  event: ''
});

// данные для получения мероприятия
const eventData = ref({
  name: '',
  date: ''
});

// id из маршрута
const route = useRoute();
const memberId = route.params.id;
console.log(memberId);

// получение данных с сервера
const fetchMemeberInfo = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/event/memberInfo/${memberId}`);
    if (response.status !== 200) {
      throw new Error('Network response was not ok');
    }
    const data = response.data;
    memberData.value = {
      firstName: data.firstname,
      middleName: data.middlename,
      lastName: data.lastname,
      company: data.company,
      position: data.position,
      email: data.email,
      phone: data.phone,
      approved: data.approved,
      event: data.eventId
    };
    fetchEventInfo(data.eventId);
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
};

const fetchEventInfo = async (eventId) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/v1/events/${eventId}`);
    if (response.status !== 200) {
      throw new Error('Network response was not ok');
    }
    const data = response.data;
    eventData.value = {
      name: data.event_name,
      date: data.event_date
    };
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
};

const formatDate = (datetime) => {
  const date = new Date(datetime);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

onMounted(() => {
  fetchMemeberInfo();
});
</script>

<template>
  <header>
    <img src="../assets/Logo.svg" alt="">
  </header>
  <div class = "container">
    <div class = "member-card">
        <h1>{{ eventData.name }}</h1>
        <h1>{{ formatDate(eventData.date) }}</h1>
        <h1>{{ memberData.lastName + " " + memberData.firstName + " " + memberData.lastName }}</h1>
        <h2>{{ memberData.company }}</h2>
        <h2>{{ memberData.position}}</h2>
        <h2>{{ memberData.email }}</h2>
        <h2>{{ memberData.phone }}</h2>
        <h2>
          <svg v-if="!memberData.approved" xmlns="http://www.w3.org/2000/svg" width="128" height="128" fill="red" class="bi bi-x-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
            </svg>

            <svg v-if="memberData.approved" xmlns="http://www.w3.org/2000/svg" width="128" height="128" fill="green" class="bi bi-check-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
            </svg>
        </h2>
    </div>
  </div>
</template>

<style scoped>
body {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%; /* Высота контейнера на 100% высоты экрана */
}

.member-card {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 
                0 6px 20px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 400px;
    width: 100%;
    margin-top: 10%; /* Отрицательный верхний отступ для смещения карточки */

    font-family: "Inter-light";
    color: rgb(63, 85, 101);
    font-weight: 400;
}

.member-card h1, .member-card h2 {
    margin: 10px 0;
}
h1{
  font-size: 24px;
}
h2{
  font-size: 20px;
}

header {
    position: absolute;
    top: 10px;
    left: 10px;
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