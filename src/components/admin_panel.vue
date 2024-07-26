<script setup>
import {ref, computed, onMounted} from 'vue';
import axios from 'axios';
import {useRouter} from 'vue-router';
import config from "@/configApi.js";

const router = useRouter();

const users = ref([]);
const events = ref([]);
const roles = ref([]); // Для хранения списка ролей
const searchQuery = ref('');
const selectedUsers = ref([]);
const selectedEvents = ref([]);
const currentTable = ref('users'); // 'users' or 'events'
const isDropdownOpen = ref(null); // Track which dropdown is open
const editingUser = ref(null);
const showEditModal = ref(false);

const filteredUsers = computed(() => {
  if (!Array.isArray(users.value)) {
    console.error('users.value is not an array:', users.value);
    return [];
  }
  return users.value.filter(user =>
      user.username.includes(searchQuery.value) || user.email.includes(searchQuery.value)
  );
});

const filteredEvents = computed(() => {
  return events.value.filter(event =>
      event.name.includes(searchQuery.value) || event.summary.includes(searchQuery.value)
  );
});

const selectAllUsers = (event) => {
  if (event.target.checked) {
    selectedUsers.value = filteredUsers.value.map(user => user.id);
  } else {
    selectedUsers.value = [];
  }
};

const selectAllEvents = (event) => {
  if (event.target.checked) {
    selectedEvents.value = filteredEvents.value.map(event => event.id);
  } else {
    selectedEvents.value = [];
  }
};

const openEditModal = (user) => {
  editingUser.value = {...user};
  showEditModal.value = true;

  const userRole = roles.value.find(role => role.id === user.roles[0].id);
  if (userRole) {
    editingUser.value.roles = [userRole.name]; // Присвоить имя роли
  } else {
    editingUser.value.roles = [];
  }
};

const closeModal = () => {
  showEditModal.value = false;
  editingUser.value = null;
};

const saveUser = () => {
  const role = roles.value.find(r => r.name === editingUser.value.roles[0]);
  if (role) {
    editingUser.value.roles = [role.id]; // Присвоить ID роли перед сохранением
  }

  // Здесь код для сохранения пользователя на сервере

  console.log('Сохранение пользователя:', editingUser.value);
  closeModal();
};

const deleteUser = (userId) => {
  if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
    users.value = users.value.filter(user => user.id !== userId);
  }
};

const deleteEvent = (eventId) => {
  if (confirm('Вы уверены, что хотите удалить это мероприятие?')) {
    events.value = events.value.filter(event => event.id !== eventId);
  }
};

const showUsersTable = () => {
  currentTable.value = 'users';
};

const showEventsTable = () => {
  currentTable.value = 'events';
};

const fetchRoles = async () => {
  try {
    const response = await axios.get(`${config.url}/api/v1/users/getRoles`);
    console.log(response.data);
    roles.value = response.data || [];
    console.log(roles.value);
  } catch (error) {
    console.error('Ошибка при получении ролей:', error);
  }
};

const LogOut = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user_id')
  router.push({path: `/login`});
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
  setTimeout(() => {
    if (!document.querySelector('.dropdown:hover')) {
      toggleDropdown(eventId, false);
    }
  }, 100);
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

const goToTemplateEditPage = (eventId) => {
  router.push({path: `/templates/${eventId}`});
};

const goToEventMemebersPage = (eventId) => {
  router.push({path: `/event/${eventId}/members`});
};

const goToEditPage = (eventId) => {
  router.push({path: `/editEvent/${eventId}/${localStorage.getItem("user_id")}`});
};

const goToCreatePage = (eventId, orgId) => {
  router.push({path: `/createEvent/${route.params.orgid}/`});
};

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

onMounted(async () => {
  console.log('About to send fetch request for events...');
  try {
    const params = {
      pageNumber: 0,
      pageSize: 8,
    };
    const response = await axios.get(`${config.url}/api/v1/events`, {params});
    console.log('Received data:', response.data);

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
    const response = await axios.get(`${config.url}/api/v1/users`, {params});
    console.log('Received user data:', response.data);

    users.value = response.data.data || [];
  } catch (error) {
    console.error('Error fetching user data:', error);
  }

  await fetchRoles();
});
</script>


<template>
  <header>
    <img src="../assets/Logo.svg" alt="Logo">
    <div class="header-buttons">
      <button class="logout-button" @click="LogOut()">Выйти</button>
    </div>
  </header>
  <div id="notification" class="notification">Ссылка скопирована в буфер обмена</div>
  <div class="search-and-switch">
    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="🔍 Поиск"/>
    </div>
    <div class="switch-buttons">
      <button :class="{ active: currentTable === 'users' }" @click="showUsersTable">Пользователи</button>
      <button :class="{ active: currentTable === 'events' }" @click="showEventsTable">Мероприятия</button>
    </div>
  </div>

  <!-- Модальное окно редактирования пользователя -->
  <div v-if="showEditModal" class="modal-overlay">
    <div class="modal-content">
      <h3>Редактировать участника</h3>
      <label>ФИО:</label>
      <input type="text" v-model="editingUser.username" placeholder="Логин"/>
      <div v-if="editingUser">
        <label for="role">Роль:</label>
        <select id="role" v-model="editingUser.roles[0]">
          <option v-for="role in roles" :key="role.id" :value="role.name">{{ role.name }}</option>
        </select>
      </div>
      <div class="modal-actions">
        <button @click="saveUser">Сохранить</button>
        <button @click="closeModal">Отмена</button>
      </div>
    </div>
  </div>

  <!-- Таблица пользователей -->
  <div class="user-table" v-if="currentTable === 'users'">
    <h2>Пользователи "PRODUCT NAME"</h2>
    <div class="table-wrapper">
      <table class="users-table">
        <thead>
        <tr>
          <th><input type="checkbox" @change="selectAllUsers($event)"/></th>
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
          <td><input type="checkbox" v-model="selectedUsers" :value="user.id"/></td>
          <td>{{ index + 1 }}</td>
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.roles.map(role => role.name).join(', ') }}</td>
          <td>
            <button @click="openEditModal(user)">✏️</button>
          </td>
          <td>
            <button @click="deleteUser(user.id)">❌</button>
          </td>
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
          <th><input type="checkbox" @change="selectAllEvents($event)"/></th>
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
          <td><input type="checkbox" :value="event.id" v-model="selectedEvents"/></td>
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
                <button class="dropdown-item delete" @click="deleteEvent(event.id)">Удалить</button>
              </div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="active-events">Активных мероприятий: {{ filteredEvents.length }}</div>
  </div>
</template>

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

.user-table,
.event-table {
  width: 100%;
  max-width: 1800px;
  margin: 2rem auto; /* Добавляем отступ сверху и снизу */
  background-color: #fff;
  border-radius: 5px;
  padding: 1rem;
  z-index: 2;
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

.header-buttons {
  display: flex;
  align-items: center;
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

.header-buttons input {
  margin-right: 10px;
  padding: 10px;
  font-size: 16px;
}

h2 {
  text-align: left;
  width: 100%; /* Изменяем ширину на 100% */
  height: 47px;
  color: rgba(63, 85, 101, 1);
  padding: 10px;
  box-sizing: border-box;
  font-family: "Inter-regular";
  font-size: 32px;
  font-weight: 700;
  line-height: 39px;
  margin-top: 0; /* Убираем внешний отступ сверху */
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
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin-bottom: 1rem; /* Отступ снизу */
}

.search-bar {
  margin-top: 1rem;
  width: 100%;
  max-width: 400px;
  display: flex;
  align-items: center;
  margin-bottom: 1rem; /* Отступ снизу */
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
  flex-direction: column; /* Изменяем направление на колонку */
  align-items: flex-start; /* Выравнивание по левому краю */
  width: 100%;
  max-width: 1200px;
  margin: 0 auto; /* Центрирование блока */
  margin-bottom: 1rem; /* Отступ снизу */
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

.action-button:hover .action-icons button {
  display: block;
}

button:hover {
  color: red;
}

.footer {
  text-align: center; /* Центрирование текста */
  margin-top: 2rem; /* Отступ сверху */
  font-family: "Inter-regular";
  font-size: 22px; /* Увеличение шрифта */
  font-weight: 400;
  line-height: 26px;
}

.footer,
.active-events {
  text-align: center; /* Центрирование текста */
  font-size: 22px; /* Увеличение шрифта */
}

.active-events {
  text-align: center; /* Центрирование текста */
  font-size: 22px; /* Увеличение шрифта */
  font-family: "Inter-regular";
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
  border-radius: 5px;
  width: 50%;
}

.modal-content input, .modal-content select {
  display: block;
  margin: 0.5rem 0;
  padding: 0.5rem;
  width: 100%;
}

.modal-content button {
  margin: 0.5rem 0;
  padding: 0.5rem;
  cursor: pointer;
}

.table-wrapper {
  overflow: visible;
  max-height: 600px;
  width: 100%;
  position: relative; /* Чтобы выпадающее меню было внутри этого блока */
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 40px;
}

.users-table th,
.users-table td {
  border-bottom: 1px solid #ddd;
  padding: 1rem;
  text-align: center;
  font-family: "Inter-light";
}

.user-table th {
  background-color: #e0e0e0;
}

/* Стили для таблицы мероприятий */
.events-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 40px;
}

.events-table th,
.events-table td {
  border-bottom: 1px solid #ddd;
  padding: 1rem;
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
  background-color: rgba(0, 0, 255, 0.1); /* Лёгкий синий фон при наведении */
}

.dropdown-item.delete {
  border-color: rgba(255, 0, 0, 1); /* Красный бордер для удаления */
  color: rgba(255, 0, 0, 1); /* Красный текст для удаления */
}
</style>
