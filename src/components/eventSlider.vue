<template>
  <div class="container">
    <header>
      <img src="../assets/Logo.svg" alt="Logo">
      <div class="header-buttons">
        <button class="logout-button" @click="LogOut()">Выйти</button>
      </div>
    </header>
    <div id="notification" class="notification">Ссылка скопирована в буфер обмена</div>
    <div class="content">
      <h2>Мои мероприятия</h2>
      <div class="table-controls">
        <div class="left-controls">
          <div class="search-bar">
            <input type="text" v-model="searchQuery" placeholder="Поиск..." />
          </div>
          <input type="checkbox" id="selectAll" @change="toggleSelectAll" />
          <label for="selectAll">Выбрать все</label>
        </div>
        <div class="right-controls">
          <button class="create-event blue-button" @click="goToCreatePage">Создать новое мероприятие</button>
<!--          <button class="delete-event blue-button" @click="deleteSelected">Удалить выбранные</button>-->
        </div>
      </div>
      <div class="table-wrapper">
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
          <tr v-for="event in filteredEvents" :key="event.id">
            <td>
              <input type="checkbox" :value="event.id" v-model="selectedEvents[event.id]" @change="toggleSelectEvent(event.id)" />
            </td>
            <td>{{ event.name }}</td>
            <td>{{ event.address }}</td>
            <td>{{ formatDate(event.date) }}</td>
            <td>{{ getStatus(event.regOpen) }}</td>
            <td>{{ formatDate(event.startRegistrationDate) }}</td>
            <td>{{ formatDate(event.closeRegistrationDate) }}</td>
            <td>{{ event.summary }}</td>
            <td class="action-buttons">
              <div
                  class="dropdown"
                  @mouseenter="toggleDropdown(event.id, true)"
                  @mouseleave="handleMouseLeave(event.id)">
                <button class="event-button blue-button">Действия</button>
                <div v-if="isDropdownOpen === event.id" class="dropdown-menu">
                  <button class="dropdown-item" @click="goToEventMemebersPage(event.id)">Участники</button>
                  <button class="dropdown-item" @click="goToEditPage(event.id)">Изменить</button>
                  <button class="dropdown-item" @click="copyLinkToClipboard(event.id)">Скопировать приглашение</button>
                  <button class="dropdown-item" @click="goToTemplateEditPage(event.id)">Изменить шаблоны</button>
                  <button class="dropdown-item" @click="goToMediaPage(event.id)">СМИ</button>
                  <button class="dropdown-item delete" @click="deleteSelected(event.id)">Удалить</button>
                </div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="active-events">Активных мероприятий: {{ events.length }}</div>
    </div>
  </div>
</template>

<script>
import {defineComponent, ref, onMounted, computed} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import axios from '../axios';
import config from "@/configApi.js";

export default defineComponent({
  setup() {
    const route = useRoute();
    const events = ref([]);
    const searchQuery = ref('');

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
        const response = await axios.get(`${config.url}/api/v1/events`, {params});
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

    const goToTemplateEditPage = (eventId) => {
      router.push({path: `/templates/${eventId}`});
    };

    const goToEventMemebersPage = (eventId) => {
      router.push({path: `/event/${eventId}/members`});
    };

    const goToEditPage = (eventId, orgId) => {
      router.push({path: `/editEvent/${eventId}/${route.params.orgid}`});
    };

    const goToCreatePage = (eventId, orgId) => {
      router.push({path: `/createEvent/${route.params.orgid}/`});
    };
    
    const goToMediaPage = (eventId) => {
      router.push({path: `/media/${eventId}`});
    };
    
    const copyLinkToClipboard = async (eventId) => {
      const registrationLink = `${window.location.origin}/${eventId}/registration-form`;

      // Проверка поддержки Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(registrationLink);
          console.log('Ссылка скопирована в буфер обмена:', registrationLink);
          showNotification();
        } catch (error) {
          console.error('Не удалось скопировать ссылку:', error);
        }
      } else {
        // Фолбек для старых браузеров или если нет HTTPS
        const textArea = document.createElement("textarea");
        textArea.value = registrationLink;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          console.log('Ссылка скопирована в буфер обмена:', registrationLink);
          showNotification();
        } catch (error) {
          console.error('Не удалось скопировать ссылку:', error);
        }
        document.body.removeChild(textArea);
      }
    };

    const showNotification = () => {
      const notification = document.getElementById('notification');
      notification.classList.add('show');
      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    };

    const toggleDropdown = (eventId, isOpen) => {
      if (isOpen) {
        isDropdownOpen.value = eventId;
      } else {
        isDropdownOpen.value = null;
      }
    };

    const handleMouseLeave = (eventId) => {
      // Поставьте таймаут для обработки покидания мыши с блока
      setTimeout(() => {
        if (!document.querySelector('.dropdown:hover')) {
          toggleDropdown(eventId, false);
        }
      }, 100); // Можно настроить задержку
    };

    const deleteSelected = (eventId) => {
      // Implement deletion logic here
      console.log('Deleting events with IDs:', eventId);
      axios.delete(`${config.url}/api/v1/events/${eventId}`)
        .then(response => {
          // Handle successful deletion
        })
        .catch(error => {
          console.error('Error deleting events:', error);
        });
    };

    const LogOut = () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user_id')
      router.push({path: `/login`});
    };

    const toggleSelectAll = () => {
      if (selectedEvents.value.length === events.value.length) {
        selectedEvents.value = [];
      } else {
        selectedEvents.value = events.value.map((event) => event.id);
      }
    };

    const toggleSelectEvent = (eventId) => {
      if (selectedEvents.value.includes(eventId)) {
        selectedEvents.value = selectedEvents.value.filter((id) => id !== eventId);
      } else {
        selectedEvents.value.push(eventId);
      }
    };

    const filteredEvents = computed(() => {
      return events.value.filter((event) => {
        return event.name.toLowerCase().includes(searchQuery.value.toLowerCase());
      });
    });


    return {
      events,
      formatDate,
      getStatus,
      goToTemplateEditPage,
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
      searchQuery,
      handleMouseLeave,
      goToCreatePage,
      filteredEvents,
      goToMediaPage,
    };
  },
});
</script>

<style scoped>
.notification {
  visibility: hidden;
  width: 300px;
  background-color: rgba(63, 85, 101, 1);
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
  background-color: #fff;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

header img {
  height: 60px;
}

.header-buttons {
  display: flex;
  align-items: center;
}

.header-buttons input {
  margin-right: 10px;
  padding: 10px;
  font-size: 16px;
}

.create-event,
.delete-event {
  padding: 15px 30px;
  border: none;
  border-radius: 5px;
  background-color: rgba(0, 0, 255, 1);
  color: #fff;
  cursor: pointer;
  font-family: "Inter-regular";
  font-size: 16px;
}

.logout-button {
  padding: 10px 25px;
  border: none;
  border-radius: 5px;
  background-color: rgba(230, 57, 70, 1);
  color: #fff;
  cursor: pointer;
  font-family: "Inter-regular";
}

h2 {
  font-family: "Inter-regular";
  font-size: 2.5rem;
  font-weight: 400;
  color: rgba(63, 85, 101, 1);
  margin-bottom: 20px;
  border-bottom: 3px solid black;
}

.table-controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  width: 100%;
}

.left-controls {
  display: flex;
  align-items: center;

}

.left-controls input[type="checkbox"] {
  margin-right: 10px;
  transform: scale(1.5); /* Увеличиваем размер чекбокса */
}

.search-bar {
  margin-left: 10px;
  flex: 1; /* Позволяет полю поиска занять доступное пространство */
  padding-right: 40px;
}

.search-bar input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #000000;
  border-radius: 5px;
  font-family: "Inter-regular";
  font-size: 20px;
  font-weight: 700;
  line-height: 30px;
}

.right-controls {
  display: flex;
  align-items: center;
}

.right-controls .create-event,
.right-controls .delete-event {
  margin-left: 10px;
}

.table-wrapper {
  max-width: 80vw;
  overflow: visible;
  max-height: 60vh;
  width: 100%;
  position: relative; /* Чтобы выпадающее меню было внутри этого блока */
}

.events-table {
  max-width: 80vw;
  max-height: 60vh;
  border-collapse: collapse;
  margin-bottom: 40px;
  position: relative; /* Чтобы дочерние элементы, например, dropdown-menu, не перекрывали её */
}

.events-table th,
.events-table td {
  border-bottom: 1px solid #ddd;
  padding: 0.5rem;
  text-align: center;
  font-family: "Inter-light";
}

.events-table th {
  background-color: #e0e0e0;
  font-size: 18px;
  font-weight: 400;
}

.events-table td {
  font-size: 16px;
  word-wrap: break-word;
}

.events-table td.action-buttons {
  position: relative;
}

.event-button {
  padding: 10px 16px;
  border: none;
  border-radius: 5px;
  background-color: rgba(0, 0, 255, 1);
  color: #fff;
  cursor: pointer;
  font-family: "Inter-light";
  font-size: 16px;
}

.dropdown {
  position: relative;
}
.dropdown-menu {
  position: absolute;
  top: 0;
  left: 100%; /* Позиция меню может потребовать корректировки */
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  transform: translateX(10px); /* Можно настроить, чтобы меню не скрывалось */
}

.dropdown-item {
  padding: 10px 16px;
  border: 2px solid rgba(0, 0, 255, 1); /* Синий бордер */
  border-radius: 5px;
  background-color: #fff; /* Белый фон */
  color: rgba(0, 0, 0, 1); /* Черный текст */
  cursor: pointer;
  font-family: "Inter-light";
  font-size: 16px;
  text-align: left; /* Выравнивание текста по левому краю */
  display: block; /* Чтобы кнопки занимали всю ширину меню */
  width: 100%; /* Чтобы кнопки занимали всю ширину меню */
  box-sizing: border-box; /* Чтобы padding учитывался в общей ширине */
}

.dropdown-item:hover {
  background-color: rgba(0, 0, 255, 0.1); /* Легкий синий фон при наведении */
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.active-events {
  margin-top: 20px;
  font-family: "Inter-regular";
  font-size: 20px;
  font-weight: 400;
  text-align: center;
}
</style>
