<template>
    <header>
        <img src="../assets/Logo.svg" alt="">
    </header>
    <div class="event-form">
      <h2>Создать новое мероприятие</h2>
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
          <label for="event_date">Начало регистрации:</label>
          <input type="datetime-local" v-model="form.startRegistrationDate" required />
        </div>
        <div>
          <label for="event_date">Конец регистрации:</label>
          <input type="datetime-local" v-model="form.closeRegistrationDate" required />
        </div>
        <div>
          <label for="address">Адрес:</label>
          <input type="text" v-model="form.address" required />
        </div>
        <div>
          <label for="reg_open">Открыть регистрацию:</label>
          <input type="checkbox" v-model="form.regOpen" />
        </div>
        <div class="button-container">
          <button type="submit">Создать мероприятие</button>
        </div>
      </form>
      <div v-if="notification" class="notification">
        {{ notification }}
      </div>
    </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import axios from "axios";
import { apiUrl } from '@/main.js';
import config from "@/configApi.js";
export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const orgId = route.params.orgid; // Получаем org_id из маршрута

    return {
      orgId,
      router
    };
  },
  data() {
    return {
      form: {
        organizerId: '',
        name: '',
        summary: '',
        date: '',
        startRegistrationDate: '',
        closeRegistrationDate: '',
        regOpen: false,
        address: '',
      },
      notification: ''
    };
  },
  methods: {
    async submitForm() {
      // Добавляем org_id в данные формы
      this.form.organizerId = this.orgId;
      console.log(this.form);

      const date = new Date(this.form.date);
      this.form.date = date.toISOString();

      const Startdate = new Date(this.form.startRegistrationDate);
      this.form.startRegistrationDate = Startdate.toISOString();

      const Enddate = new Date(this.form.closeRegistrationDate);
      this.form.closeRegistrationDate = Enddate.toISOString();

      try {
        const response = await axios.post(`${config.url}/api/v1/events`, this.form, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.status === 201) {
          this.notification = 'Событие успешно создано!';
          setTimeout(() => {
            this.notification = '';
            this.router.push({ path: `/${this.orgId}/events` }); // Перенаправление пользователя
          }, 3000); // 3 секунды задержки перед перенаправлением
        } else {
          this.notification = 'Ошибка при создании события.';
        }
      } catch (error) {
        this.notification = 'Ошибка при создании события.';
      }
    }
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
@font-face {
  font-family: "Inter-regular";
  src: url(/src/fonts/Inter-Regular.ttf);
}

@font-face {
  font-family: "Inter-light";
  src: url(/src/fonts/Inter-Light.ttf);
}
</style>
