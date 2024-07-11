<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

//переменные для хранения данных
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

//данные для получения мероприятия
const eventData = ref({
  name: '',
  date: ''
});

//id из маршрута
const route = useRoute();
const memberId = route.params.id;
console.log(memberId);

//получение данных с сервера
const fetchMemeberInfo = async () => {
  try{
    const response = await fetch(`http://localhost:8080/api/event/memberInfo/${memberId}`)
    if(!response.ok){
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    memberData.value = {
      firstName: data.firstname,
      middleName: data.middlename,
      lastName: data.lastname,
      company: data.company,
      position: data.position,
      email: data.email,
      phone: data.phone,
      approved: data.approved,
      clumemeber: data.clumemeber,
      event: data.eventId
    };
    fetchEventInfo(data.eventId)
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error)
  }
};

const fetchEventInfo = async (eventId) => {
  try{
    const response = await fetch(`http://localhost:8080/api/event/${eventId}/info`)
    if(!response.ok){
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    eventData.value = {
      name: data.event_name,
      date: data.event_date
    };
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error)
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
        <h1>{{ eventData.name + " " + formatDate(eventData.date) }}</h1>
        <h1>{{ memberData.lastName + " " + memberData.firstName + " " + memberData.lastName }}</h1>
        <h2>{{ memberData.company }}</h2>
        <h2>{{ memberData.position}}</h2>
        <h2>{{ memberData.email }}</h2>
        <h2>{{ memberData.phone }}</h2>
        <h2>{{ memberData.approved ? 'Допущен' : 'Попущен' }}</h2>
    </div>
  </div>
</template>

<style scoped>

</style>