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
    const response = await axios.get(`http://localhost:8080/api/v1/users`);
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

        <label for="email">Email:</label>
        <input v-model="editedUser.email" id="email" type="email" required />

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
          <th><input type="checkbox" @change="selectAllUsers($event)" /></th>
          <th>№</th>
          <th>Логин</th>
          <th>Email</th>
          <th>Роли</th>
          <th>Редактировать</th>
          <th>Удалить</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(user, index) in filteredUsers" :key="user.id">
          <td><input type="checkbox" v-model="selectedUsers" :value="user.id" /></td>
          <td>{{ index + 1 }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td><span v-for="role in user.roles" :key="role.id">{{ role.name }}</span></td>
          <td><button @click="editUser(user)">✏️</button></td>
          <td><button @click="deleteUser(user.id)">❌</button></td>
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
      <table>
        <thead>
        <tr>
          <th><input type="checkbox" @change="selectAllEvents($event)" /></th>
          <th>№</th>
          <th>Название</th>
          <th>Описание</th>
          <th>Дата</th>
          <th>Редактировать</th>
          <th>Удалить</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(event, index) in filteredEvents" :key="event.id">
          <td><input type="checkbox" v-model="selectedEvents" :value="event.id" /></td>
          <td>{{ index + 1 }}</td>
          <td>{{ event.name }}</td>
          <td>{{ event.summary }}</td>
          <td>{{ new Date(event.date).toLocaleDateString() }}</td>
          <td><button @click="editEvent(event.id)">✏️</button></td>
          <td><button @click="deleteEvent(event.id)">❌</button></td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="footer">
      <p>Всего мероприятий: {{ filteredEvents.length }}</p>
    </div>
  </div>
</template>

<style scoped>
.user-table, .event-table {
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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
  /* Logo */
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
  width: 100%; /* Установите нужную длину линии */
  height: 3px; /* Толщина линии */
  background-color: black;
  position: absolute;
  bottom: -10px; /* Положение линии относительно h2 */
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
  width: 700px /* Adjust this value if needed */
}

.table-wrapper {
  margin-top: 130px;
  overflow-y: auto;
  max-height: 550px; /* Adjust this value based on your needs */
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

button {

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
