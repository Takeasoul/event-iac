<script>
import { defineComponent, ref, onMounted, markRaw } from 'vue';
import {useRoute, useRouter} from 'vue-router';
import { GSCarousel, GSLayoutNumeric as RawGSLayoutNumeric } from 'gitart-scroll-carousel/bundled';
import 'gitart-scroll-carousel/dist/index.css';
import 'gitart-scroll-carousel/dist/GSArrow.css';
import 'gitart-scroll-carousel/dist/GSLayoutNumeric.css';
import axios from '../axios';

export default defineComponent({
  components: {
    GSCarousel,
  },
  setup() {
    const route = useRoute();
    const events = ref([]);
    const orgId = route.params.orgid;
    const GSLayoutNumeric = ref(markRaw(RawGSLayoutNumeric));
    axios.defaults.baseURL = 'http://localhost:8080';
    const router = useRouter();  // Определяем router здесь

    onMounted(async () => {
      console.log('About to send fetch request...');
      try {
        const response = await axios.get('/api/event/eventsAllByOrgId', {
          params: {
            orgId: orgId// Передаем orgId как параметр запроса
          }
        });
        console.log('Received data:', response.data);
        events.value = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    });

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

    const getStatus = (status) => (status ? 'Открыта' : 'Закрыта');

    const goToMembers = (eventId) => {
      router.push({ path: `/event/${eventId}/members` });
    };

    const createLink = (eventId) => {
      const registrationLink = `${window.location.origin}/${eventId}/registration-form`;
      return registrationLink;
    };

    const copyLinkToClipboard = async (eventId) => {
      const registrationLink = createLink(eventId);
      try {
        await navigator.clipboard.writeText(registrationLink);
        console.log('Ссылка скопирована в буфер обмена:', registrationLink);
        // Здесь можно добавить уведомление пользователю об успешном копировании
      } catch (error) {
        console.error('Не удалось скопировать ссылку:', error);
        // Здесь можно добавить обработку ошибки, например, показ сообщения об ошибке
      }
    };

    const LogOut = () => {
      router.push({ path: `/login` });
    };

    return {
      events,
      GSLayoutNumeric,
      formatDate,
      getStatus,
      goToMembers, // убедитесь, что функция возвращается из setup
      LogOut,
      createLink,
      copyLinkToClipboard
    };
  },
});
</script>

<template>
  <div class="container">
    <div class="header">
      <div class="logo">
        <img src="../assets/Logo.svg" alt="Logo">
      </div>
        <button class="create-event blue-button" @click="createEvent()">Создать новое мероприятие</button>
        <button class="logout-button" @click="LogOut()">Выйти</button>
    </div>
    <div class="content">
      <div class="title">Мои мероприятия</div>
      <div class="carousel-wrapper">
        <GSCarousel
            :items="events"
            item-gap="14"
            :items-to-show="2"
            :layout="GSLayoutNumeric"
            :layout-props="{
            disableArrows: false,
            disableCounter: false,
            disableIndicator: true,
            disableSlide: true,
          }"
        >
          <template #item="{ data }">
            <div class="event-card">
              <div class="event-name">{{ data.event_name }}</div>
              <div class="event-details">
                <div class="event-detail">
                  <label>Адрес:</label>
                  <span>—</span>
                </div>
                <div class="event-detail">
                  <label>Дата и время:</label>
                  <span>{{ formatDate(data.event_date) }}</span>
                </div>
                <div class="event-detail">
                  <label>Состояние:</label>
                  <span>{{ getStatus(data.reg_open) }}</span>
                </div>
                <div class="event-description">
                  <label>Описание:</label>
                  <span>{{ data.event_summary }}</span>
                </div>
              </div>
              <div class="event-actions">
                <button class="event-button blue-button" @click="goToMembers(data.event_id)">Участники</button>
                <button class="event-button blue-button"@click="copyLinkToClipboard(data.event_id)">Создать приглашение</button>
                <button class="event-button blue-button">Изменить</button>
              </div>
            </div>
          </template>
        </GSCarousel>
      </div>
      <div class="active-events">Активных мероприятий: {{ events.length }}</div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: white;
}

.header {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  background-color: #fff;
}

.logo {
  margin-right: 20px;
  color: #000000;
}

.logo svg {
  fill: #000000; /* Set the fill color of the logo */
}

.title {
  font-family: "Inter-Regular";
  font-size: 2.5rem;
  font-weight: 400;
  color: #000000;
}

.logout-button {
  margin-left: auto;
  padding: 10px 25px;
  border: none;
  border-radius: 5px;
  background-color: #930404;
  color: #fff;
  cursor: pointer;
  font-family: "Inter-Regular";
  font-weight:400;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px; 
}

.carousel-wrapper {
  width: 100%;
  max-width: 1200px;
  margin-bottom: 20px;
}

.event-card {
  width: 400px; /* Increase the width */
  height: 500px; /* Increase the height */
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 
                0 6px 20px rgba(0, 0, 0, 0.1);
  padding-top: 30px;
  display: flex; /* Add this to make the card a flex container */
  flex-direction: column; /* Stack the elements vertically */
  font-family: "Inter-Regular";
  font-size:28px;
  font-weight: 400;
}

.event-name {
  font-family: "Inter-Regular";
  font-size: 1.5rem;
  font-weight: 400;
  color: #000000;
  margin-bottom: 15px;
  text-align: center;
}

.event-details {
  font-family: "Intrer-light";
  font-weight: 400;
  flex: 1; /* Take up the remaining space */
  text-align: left;
  padding-top: 20px;
  padding-left: 5px;
  padding-bottom: 10px;
  font-size: 20px;
}

.event-detail {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.event-detail label {
  font-weight: 400;
  margin-right: 20px;
  color: #000000;
}

.event-detail span {
  color: #000000;

}

.event-description label {
  font-weight: 400;
  margin-bottom: 5px;
  color: #000000;
  margin-right: 10px;
}

.event-description span {
  color: #000000;
}

.event-actions {
  display: grid; /* Make the actions a flex container */
  justify-content:center; /* Space the buttons evenly */
  margin-top: -20px; /* Move the buttons up to overlap with the description */
  padding-bottom: 20px; /* Add some padding to separate from the card bottom */
  padding-bottom: 1%;
}

.event-button {
  padding: 10px 16px;
  border: none;
  border-radius: 5px;
  background-color: rgb(63, 85, 101);
  color: #fff;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 10px;
  font-family: "Inter-light";
  font-size:18px;
  font-weight: 400;
}

.active-events {
  font-family: "Inter-light";
  font-size: 24px;
  font-weight: 400;
  color: rgb(63, 85, 101);;
}

.create-event{
  padding: 10px;
  font-family: "Inter-light";
  font-size: 16px;
  font-weight: 400;
  border:none;
  border-radius: 5px;
  color:white;
  background-color: rgb(63, 85, 101);;
}
.blue-button:hover{
  background-color:  rgb(134, 166, 189);
  transition: all 0.5s ease;
}
.logout-button:hover{
  background-color:  #ab4a4a;
  transition: all 0.5s ease;
}


@font-face {
  font-family: "Inter-regular";
  src: url(/src/fonts/Inter-Regular.ttf);
}
@font-face {
  font-family: "Inter-light";
  src: url(/src/fonts/Inter-Light.ttf);
}
@media screen and (max-width: 768px) {
  .carousel-wrapper {
    max-width: 100%;
  }

  .event-card {
    width: 100%;
  }
}
</style>