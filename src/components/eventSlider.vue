<template>
  <div class="container">
    <div class="header">
      <div class="logo">
        <img src="../assets/Logo.svg" alt="Logo">
      </div>
      <button class="create-event blue-button" @click="createEventClick()">Создать новое мероприятие</button>
      <button class="logout-button" @click="LogOut()">Выйти</button>
    </div>
    <div id="notification" class="notification">Ссылка скопирована в буфер обмена</div>
    <div class="content">
      <div class="title">Мои мероприятия</div>
      <div class="table-controls">
        <input type="checkbox" id="selectAll" @change="toggleSelectAll" />
        <label for="selectAll">Выбрать все</label>
      </div>
      <table class="events-table">
        <thead>
          <tr>
            <th>Выбрать</th>
            <th>Название</th>
            <th>Адрес</th>
            <th>Дата и время</th>
            <th>Состояние</th>
            <th>Начало регистрации</th>
            <th>Конец регистрации</th>
            <th>Описание</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event.id">
            <td>
              <input type="checkbox" :value="event.id" v-model="selectedEvents" @change="toggleSelectEvent(event.id)" />
            </td>
            <td>{{ event.name }}</td>
            <td>{{ event.address }}</td>
            <td>{{ formatDate(event.date) }}</td>
            <td>{{ getStatus(event.reg_open) }}</td>
            <td>{{ formatDate(event.startRegistrationDate) }}</td>
            <td>{{ formatDate(event.closeRegistrationDate) }}</td>
            <td>{{ event.summary }}</td>
            <td class="action-buttons">
              <div class="dropdown" @mouseenter="toggleDropdown(event.id)" @mouseleave="toggleDropdown(null)">
                <button class="event-button blue-button">Действия</button>
                <div v-if="isDropdownOpen === event.id" class="dropdown-menu">
                  <button class="dropdown-item" @click="goToEventMemebersPage(event.id)">Участники</button>
                  <button class="dropdown-item" @click="goToEditPage(event.id)">Изменить</button>
                  <button class="dropdown-item" @click="copyLinkToClipboard(event.id)">Скопировать приглашение</button>
                  <button class="dropdown-item" @click="goToEventPage(event.id)">Изменить шаблоны</button>
                  <button class="dropdown-item delete" @click="deleteSelected">Удалить</button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="actions">
        <button class="event-button blue-button" @click="deleteSelected">Удалить выбранные</button>
      </div>
      <div class="active-events">Активных мероприятий: {{ events.length }}</div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '../axios';

export default defineComponent({
  setup() {
    const route = useRoute();
    const events = ref([]);
    const orgId = route.params.orgid;
    const router = useRouter();
    const selectedEvents = ref([]);
    const isDropdownOpen = ref(null); // Track which dropdown is open

    onMounted(async () => {
      try {
        const params = {
          pageNumber: 0,
          pageSize: 8,
          orgId: orgId,
        };
        const response = await axios.get(`http://localhost:8080/api/v1/events`, { params });
        events.value = response.data.data || [];
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

    const goToEventPage = (eventId) => {
      router.push({ path: `/event/${eventId}` });
    };

    const goToEventMemebersPage = (eventId) => {
      router.push({path:`/event/${eventId}/members` });
    }

    const goToEditPage = (eventId, orgId) => {
      router.push({path:`/editEvent/${eventId}/${orgId}`})
    }

    const copyLinkToClipboard = async (eventId) => {
      const registrationLink = `${window.location.origin}/${eventId}/registration-form`;
      try {
        await navigator.clipboard.writeText(registrationLink);
        console.log('Ссылка скопирована в буфер обмена:', registrationLink);
        showNotification();
      } catch (error) {
        console.error('Не удалось скопировать ссылку:', error);
      }
    };

    const showNotification = () => {
      const notification = document.getElementById('notification');
      notification.classList.add('show');
      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    };

    const toggleDropdown = (eventId) => {
      isDropdownOpen.value = isDropdownOpen.value === eventId ? null : eventId;
    };

    const deleteSelected = () => {
      // Implement deletion logic here
      console.log('Deleting events with IDs:', selectedEvents.value);
      // Example:
      // axios.delete(`http://localhost:8080/api/v1/events`, { data: { ids: selectedEvents.value } })
      //   .then(response => {
      //     // Handle successful deletion
      //   })
      //   .catch(error => {
      //     console.error('Error deleting events:', error);
      //   });
    };

    const LogOut = () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      router.push({ path: `/login` });
    };

    const toggleSelectAll = () => {
      if (selectedEvents.value.length === events.value.length) {
        selectedEvents.value = [];
      } else {
        selectedEvents.value = events.value.map(event => event.id);
      }
    };

    const toggleSelectEvent = (eventId) => {
      if (selectedEvents.value.includes(eventId)) {
        selectedEvents.value = selectedEvents.value.filter(id => id !== eventId);
      } else {
        selectedEvents.value.push(eventId);
      }
    };

    return {
      events,
      formatDate,
      getStatus,
      goToEventPage,
      goToEventMemebersPage,
      selectedEvents,
      toggleSelectAll,
      toggleSelectEvent,
      deleteSelected,
      LogOut,
      copyLinkToClipboard,
      isDropdownOpen,
      toggleDropdown,
      goToEditPage,
    };
  },
});
</script>
<style scoped>
.notification {
  visibility: hidden;
  width: 300px;
  background-color: rgb(63, 85, 101);
  color: #fff;
  font-family: "Inter-light";
  font-size: 24px;
  font-weight: 400;
  text-align: center;
  border-radius: 8px;
  padding: 20px;
  position: fixed;
  z-index: 1000;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: visibility 0s, opacity 0.5s linear;
}

.notification.show {
  visibility: visible;
  opacity: 1;
}

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
  justify-content: space-between;
}

.logo img {

}

.create-event {
  padding: 15px 30px;
  border: none;
  border-radius: 5px;
  background-color: #0000ff;
  color: #fff;
  cursor: pointer;
  font-family: "Inter-Regular";
  font-size: 16px;
}

.logout-button {
  padding: 10px 25px;
  border: none;
  border-radius: 5px;
  background-color: #e63946;
  color: #fff;
  cursor: pointer;
  font-family: "Inter-Regular";
}

.title {
  font-family: "Inter-Regular";
  font-size: 2.5rem;
  font-weight: 400;
  color: #000000;
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

.table-controls {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.table-controls input[type="checkbox"] {
  margin-right: 10px;
}

.events-table {
  width: 80%;
  border-collapse: collapse;
  margin-bottom: 40px; /* Increased margin bottom */
}

.events-table th, .events-table td {
  border-bottom: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  font-family: "Inter-light";
}

.events-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.events-table td {
  font-size: 16px;
  word-wrap: break-word;
  max-width: 200px;
}

.events-table td.action-buttons {
  position: relative;
}

.event-button {
  padding: 10px 16px;
  border: none;
  border-radius: 5px;
  background-color: #0000ff; /* Same blue color as the create event button */
  color: #fff;
  cursor: pointer;
  font-family: "Inter-light";
  font-size: 16px;
  margin-bottom: 10px;
  white-space: nowrap; /* Ensure the text does not wrap */
}

.event-button:hover {
  background-color: #0000b3; /* Darker blue on hover */
}

.dropdown {
  position: relative;
}

.dropdown-menu {
  display: block;
  position: absolute;
  background-color: #fff;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  right: 0;
  border-radius: 5px;
  min-width: 160px;
}

.dropdown-item {
  padding: 10px 16px;
  border: none;
  border-radius: 5px;
  background-color: #0000ff; /* Same blue color */
  color: #fff;
  cursor: pointer;
  font-family: "Inter-light";
  font-size: 16px;
  width: 100%;
  white-space: nowrap;
}

.dropdown-item:hover {
  background-color: #0000b3; /* Darker blue on hover */
}

.dropdown-item.delete {
  background-color: #ff4d4d; /* Red color for delete button */
}

.dropdown-item.delete:hover {
  background-color: #cc0000; /* Darker red on hover */
}

.active-events {
  font-family: "Inter-Regular";
  font-size: 16px;
  margin-top: 20px;
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.actions .event-button {
  margin-left: 0;
}

input[type="checkbox"] {
  margin: 0;
}

</style>