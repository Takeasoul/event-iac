<template>
  <header>
    <img src="../assets/Logo.svg" alt="">
  </header>
  <div class="event-form">
    <h2>Редактировать мероприятие</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label for="event_name">Название события:</label>
        <input type="text" v-model="form.name" required placeholder=""/>
      </div>
      <div>
        <label for="event_summary">Краткое описание:</label>
        <textarea v-model="form.summary" required></textarea>
      </div>
      <div>
        <label for="event_date">Дата события:</label>
        <input type="datetime-local" v-model="form.date" required />
      </div>
      <div>
        <label for="address">Адрес:</label>
        <input type="text" v-model="form.address" required />
      </div>
      <div>
        <label for="start_registration_date">Начало регистрации:</label>
        <input type="datetime-local" v-model="form.startRegistrationDate" />
      </div>
      <div>
        <label for="close_registration_date">Конец регистрации:</label>
        <input type="datetime-local" v-model="form.closeRegistrationDate" />
      </div>
      <div>
        <label for="reg_open">Открыть регистрацию:</label>
        <input type="checkbox" v-model="form.regOpen" />
      </div>
      <div class="button-container">
        <button type="submit">Сохранить изменения</button>
      </div>
    </form>
    <div v-if="notification" class="notification">
      {{ notification }}
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import axios from "axios";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const eventId = route.params.evId; // Получаем event_id из маршрута
    const orgId = route.params.orgId;
    const notification = ref('');
    const form = ref({
      name: '',
      summary: '',
      date: '',
      startRegistrationDate: '',
      closeRegistrationDate: '',
      regOpen: false,
      address: '',
      organizerId: '',
    });

    // Преобразование даты в формат datetime-local
    const formatToDateTimeLocal = (isoDate) => {
      if (!isoDate) return '';
      const date = new Date(isoDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Преобразование даты из формата datetime-local в формат ISO
    const formatToISO = (dateTimeLocal) => {
      if (!dateTimeLocal) return '';
      return new Date(dateTimeLocal).toISOString();
    };

    // Вспомогательные вычисляемые свойства для преобразования даты
    const formattedDate = computed({
      get() {
        return {
          date: formatToDateTimeLocal(form.value.date),
          startRegistrationDate: formatToDateTimeLocal(form.value.startRegistrationDate),
          closeRegistrationDate: formatToDateTimeLocal(form.value.closeRegistrationDate)
        };
      },
      set(newValue) {
        form.value.date = newValue.date ? formatToISO(newValue.date) : '';
        form.value.startRegistrationDate = newValue.startRegistrationDate ? formatToISO(newValue.startRegistrationDate) : '';
        form.value.closeRegistrationDate = newValue.closeRegistrationDate ? formatToISO(newValue.closeRegistrationDate) : '';
      }
    });

    // Получаем данные события при загрузке компонента
    onMounted(async () => {
      try {
        console.log(`Fetching event data for id: ${eventId}`);
        const response = await axios.get(`http://localhost:8080/api/v1/events/${eventId}`);
        if (response.status === 200) {
          const data = response.data;
          console.log('Fetched event data:', data);
          form.value = {
            name: data.name,
            summary: data.summary,
            date: formatToDateTimeLocal(data.date),
            startRegistrationDate: formatToDateTimeLocal(data.startRegistrationDate),
            closeRegistrationDate: formatToDateTimeLocal(data.closeRegistrationDate),
            regOpen: data.regOpen,
            address: data.address,
            organizerId: orgId,
          };
        } else {
          console.error('Error fetching event data:', response.status);
          notification.value = 'Ошибка при загрузке данных события.';
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
        notification.value = 'Ошибка при загрузке данных события.';
      }
    });

    const submitForm = async () => {
      try {
        const date = new Date(form.value.date);
      form.value.date = date.toISOString();

      const Startdate = new Date(form.value.startRegistrationDate);
      form.value.startRegistrationDate = Startdate.toISOString();

      const Enddate = new Date(form.value.closeRegistrationDate);
      form.value.closeRegistrationDate = Enddate.toISOString();
        console.log('ОТПРАВЛЯЮ', form.value)
        const response = await axios.put(`http://localhost:8080/api/v1/events/${eventId}`, form.value, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200) {
          notification.value = 'Событие успешно обновлено!';
          setTimeout(() => {
            notification.value = '';
            router.back(orgId) // Перенаправление пользователя
          }, 3000); // 3 секунды задержки перед перенаправлением
        } else {
          console.error('Error updating event:', response.status);
          notification.value = 'Ошибка при обновлении события.';
        }
      } catch (error) {
        console.error('Error updating event:', error);
        notification.value = 'Ошибка при обновлении события.';
      }
    };

    return {
      form,
      notification,
      submitForm,
      formattedDate
    };
  }
};
</script>
  
  <style scoped>
  .event-form {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 
                0 6px 20px rgba(0, 0, 0, 0.1);
    background: rgb(255, 255, 255);
  }
  
  .event-form div {
    margin-bottom: 15px;
  }
  
  .event-form label {
    display: block;
    margin-bottom: 5px;
  }
  
  .event-form input,
  .event-form textarea {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
  
  .button-container {
    text-align: center;
  }
  
  .event-form button {
    padding: 10px 20px;
    background-color: rgb(63, 85, 101);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-family: "Inter-Regular";
    font-size: 20px;
    font-weight: 400;
  }
  
  .event-form button:hover {
    background-color: rgb(134, 166, 189);
  }
  
  .notification {
    margin-top: 20px;
    padding: 10px;
    background-color: #067d0a;
    color: white;
    border-radius: 5px;
    text-align: center;
  }
  
  h2 {
    font-family: "Inter-regular";
    font-size: 24px;
    font-weight: 400;
    text-align: center;
  }
  
  label {
    font-family: "Inter-light";
    font-size: 20px;
    font-weight: 400;
  }
  
  input[type="checkbox"] {
    height: 25px;
  }
  textarea{
    resize: none;
    height: 150px;
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
  