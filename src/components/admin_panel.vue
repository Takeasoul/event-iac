<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

// Массив пользователей и мероприятий
const users = ref([]);
const events = ref([]);
const roles = ref([]); // Для хранения списка ролей
const searchQuery = ref('');
const selectedUsers = ref([]);
const selectedEvents = ref([]);
const currentTable = ref('users'); // 'users' or 'events'
const isDropdownOpen = ref(null); // Track which dropdown is open

// Переменные для модального окна редактирования
const showEditModal = ref(false);
const editedUser = ref({ id: null, username: '', email: '', roles: [] });

// Фильтруем пользователей по поисковому запросу
const filteredUsers = computed(() => {
  return users.value.filter(user =>
      user.username.includes(searchQuery.value) || user.email.includes(searchQuery.value)
  );
});

// Фильтруем мероприятия по поисковому запросу
const filteredEvents = computed(() => {
  return events.value.filter(event =>
      event.name.includes(searchQuery.value) || event.summary.includes(searchQuery.value)
  );
});

// Функция для выбора всех пользователей
const selectAllUsers = (event) => {
  if (event.target.checked) {
    selectedUsers.value = filteredUsers.value.map(user => user.id);
  } else {
    selectedUsers.value = [];
  }
};

// Функция для выбора всех мероприятий
const selectAllEvents = (event) => {
  if (event.target.checked) {
    selectedEvents.value = filteredEvents.value.map(event => event.id);
  } else {
    selectedEvents.value = [];
  }
};

const editUser = (user) => {
  editedUser.value = { ...user }; // Клонируем данные пользователя
  showEditModal.value = true; // Показываем модальное окно
};

const closeEditModal = () => {
  showEditModal.value = false; // Скрываем модальное окно
};

const saveUserChanges = async () => {
  try {
    // Преобразуем roles в массив объектов
    const rolesToSend = editedUser.value.roles.map(roleId => {
      return roles.value.find(role => role.id === roleId);
    }).filter(role => role !== undefined);

    // Отправляем данные на сервер
    await axios.put(`http://localhost:8080/api/v1/users/admin?id=${editedUser.value.id}`, {
      ...editedUser.value,
      roles: rolesToSend
    });

    // Обновляем список пользователей
    const response = await axios.get('http://localhost:8080/api/v1/users');
    users.value = response.data || [];
    closeEditModal();
  } catch (error) {
    console.error('Ошибка при сохранении изменений:', error);
  }
};

const updateRoles = (event) => {
  const selectedRoleId = event.target.value;
  const selectedRole = roles.value.find(role => role.id === selectedRoleId);

  if (selectedRole) {
    // Если `editedUser.roles` это массив строк, преобразуем его в массив объектов
    editedUser.value.roles = [selectedRole];
  }
};

// Функция для удаления пользователя
const deleteUser = (userId) => {
  if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
    users.value = users.value.filter(user => user.id !== userId);
  }
};

// Функция для редактирования мероприятия
const editEvent = (eventId) => {
  const userId = localStorage.getItem('user_id');
  if (userId) {
    router.push({ path: `/editEvent/${eventId}/${userId}` });
  } else {
    alert('User ID not found in local storage.');
  }
};

// Функция для удаления мероприятия
const deleteEvent = (eventId) => {
  if (confirm('Вы уверены, что хотите удалить это мероприятие?')) {
    events.value = events.value.filter(event => event.id !== eventId);
  }
};

// Функция для отображения таблицы пользователей
const showUsersTable = () => {
  currentTable.value = 'users';
};

// Функция для отображения таблицы мероприятий
const showEventsTable = () => {
  currentTable.value = 'events';
};

// Получение списка ролей
const fetchRoles = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/v1/users/getRoles');
    roles.value = response.data || [];
  } catch (error) {
    console.error('Ошибка при получении ролей:', error);
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

const getStatus = (status) => (status ? 'Открыта' : 'Закрыта');

const handleMouseLeave = (eventId) => {
      // Поставьте таймаут для обработки покидания мыши с блока
      setTimeout(() => {
        if (!document.querySelector('.dropdown:hover')) {
          toggleDropdown(eventId, false);
        }
      }, 100); // Можно настроить задержку
    };

    const toggleDropdown = (eventId, isOpen) => {
      if (isOpen) {
        isDropdownOpen.value = eventId;
      } else {
        isDropdownOpen.value = null;
      }
    };

    const getStatusLabel = (status) => {
  switch (status) {
    case 'CONSIDERATION':
      return 'Рассмотрение';
    case 'APPROVED':
      return 'Одобрено';
    case 'NOT_APPROVED':
      return 'Отклонено';
    default:
      return 'Неизвестно';
  }
};

onMounted(async () => {
  console.log('About to send fetch request for events...');
  try {
    const params = {
      pageNumber: 0,
      pageSize: 8,
    };
    const response = await axios.get(`http://localhost:8080/api/v1/events`, { params });
    console.log('Received data:', response.data);

    // Обновляем events.value, извлекая массив из поля data
    events.value = response.data.data || [];
  } catch (error) {
    console.error('Error fetching data:', error);
  }



  console.log('About to send fetch request for users...');
  try {
    const params = {
      pageNumber: 0,
      pageSize: 8,
    };
    const response = await axios.get(`http://localhost:8080/api/v1/users`, { params });
    console.log('Received user data:', response.data);

    // Обновляем users.value, извлекая массив из поля data
    users.value = response.data || [];
  } catch (error) {
    console.error('Error fetching user data:', error);
  }


  // Получаем список ролей
  await fetchRoles();
});
</script>

<template>
  <header>
    <img src="../assets/Logo.svg" alt="">
  </header>
  <div class="search-and-switch">
    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="🔍 Поиск" />
    </div>
    <div class="switch-buttons">
      <button :class="{ active: currentTable === 'users' }" @click="showUsersTable">Пользователи</button>
      <button :class="{ active: currentTable === 'events' }" @click="showEventsTable">Мероприятия</button>
    </div>
  </div>

  <!-- Модальное окно редактирования пользователя -->
  <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
    <div class="modal-content" @click.stop>
      <h2>Редактировать пользователя</h2>
      <form @submit.prevent="saveUserChanges">
        <label for="username">Логин:</label>
        <input v-model="editedUser.username" id="username" type="text" required />

        <label for="roles">Роли:</label>
        <div class="custom-select">
          <select v-model="editedUser.roles" @change="updateRoles" id="roles" multiple>
            <option value="" disabled>Выберите роли...</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
          </select>
        </div>

        <button type="submit">Сохранить</button>
        <button type="button" @click="closeEditModal">Отмена</button>
      </form>
    </div>
  </div>

  <!-- Таблица пользователей -->
  <div class="user-table" v-if="currentTable === 'users'">
    <h2>Пользователи "PRODUCT NAME"</h2>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" @change="selectAll($event)" /></th>
            <th>№</th>
            <th>ID</th>
            <th>Логин</th>
            <th>Роль</th>
            <th>Редактировать</th>
            <th>Удалить</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in filteredUsers" :key="user.id">
            <td><input type="checkbox" v-model="selectedUsers" :value="user.id" /></td>
            <td>{{ index + 1 }}</td>
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.roles.map(role => role.name).join(', ')}}</td>
            <td><button @click="editUser(user)">✏️</button></td>
            <td><button  @click="deleteUser(user.id)">❌</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="footer">
      <p>Всего пользователей: {{ filteredUsers.length }}</p>
    </div>
  </div>

  <!-- Таблица мероприятий -->
  <div class="event-table" v-else-if="currentTable === 'events'">
    <h2>Мероприятия "PRODUCT NAME"</h2>
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
              <div
                  class="dropdown"
                  @mouseenter="toggleDropdown(event.id, true)"
                  @mouseleave="handleMouseLeave(event.id)">
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
      </div>
      <div class="active-events">Активных мероприятий: {{ events.length }}</div>
  </div>
</template>

<style scoped>
.user-table, .event-table {
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 5px;
  padding: 1rem;
}

.switch-buttons button {
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  background-color: #f0f0f0;
  font-family: "Inter-regular";
  font-size: 18px;
  font-weight: 400;
  margin: 0 10px;
}

.switch-buttons button.active {
  background-color: rgba(63, 85, 101, 1);
  color: white;
}

header {
  position: absolute;
  width: 291px;
  height: 100px;
  left: 42px;
  top: 10px;
}

h2 {
  text-align: left;
  width: 638.03px;
  height: 47px;
  position: absolute;
  top: 80px;
  left: 335px;
  color: rgba(63, 85, 101, 1);
  padding: 10px;
  box-sizing: border-box;
  font-family: "Inter-regular";
  font-size: 32px;
  font-weight: 700;
  line-height: 39px;
}

h2::after {
  content: "";
  display: block;
  width: 100%;
  height: 3px;
  background-color: black;
  position: absolute;
  bottom: -10px;
}

.switch-buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-left: auto;
  margin-bottom: 15px;
}

.search-bar {
  margin-top: 1px;
  margin-bottom: 1rem;
  width: 400px;
  height: 40px;
  display: flex;
  align-items: center;
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

.search-and-switch {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 229px;
  left: 375px;
  width: 700px;
}

.table-wrapper {
  margin-top: 130px;
  overflow-y: auto;
  max-height: 550px;
  width: 1900px;
  position: absolute;
  top: 180px;
  left: 349px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

td {
  padding: 1rem;
  text-align: center;
  background-color: #f0f0f0;
  font-family: "Inter-light";
  font-size: 20px;
  font-weight: 400;
  line-height: 26px;
}

th {
  padding: 0.75rem;
  text-align: center;
  background-color: #f0f0f0;
  font-family: "Inter-regular";
  font-size: 20px;
  font-weight: 400;
  line-height: 26px;
}

/* Новые стили для кнопок действия и их дочерних кнопок */
.action-button-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.action-button {
  position: relative;
}

.action-button .action-icons {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.action-button .action-icons button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  background-color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.action-button .action-icons button:hover {
  background-color: #f0f0f0;
}

.action-button:hover .action-icons {
  display: block;
}

.action-button {
  cursor: pointer;
}

.action-button:hover .action-icons button {
  display: block;
}

button:hover {
  color: red;
}

.footer {
  text-align: left;
  margin-top: 49rem;
  font-family: "Inter-regular";
  font-size: 20px;
  font-weight: 400;
  line-height: 26px;
  margin-left: 340px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-content h2 {
  margin-top: 0;
}

.modal-content form {
  display: flex;
  flex-direction: column;
}

.modal-content label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.modal-content input {
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-content button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.modal-content button[type="submit"] {
  background-color: #007bff;
  color: white;
}

.modal-content button[type="submit"]:hover {
  background-color: #0056b3;
}

.modal-content button[type="button"] {
  background-color: #6c757d;
  color: white;
  margin-left: 0.5rem;
}

.modal-content button[type="button"]:hover {
  background-color: #5a6268;
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
