<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

// Получаем ID события из роутера
const route = useRoute();
const eventId = route.params.id;
const router = useRouter();
const users = ref([]);

const filterState = ref('');
const searchQuery = ref('');
const selectedUsers = ref([]);
axios.defaults.baseURL = 'http://localhost:8080';
// Получаем данные участников события при монтировании компонента
const fetchMembers = async () => {
  try {
    const response = await axios.get(`/api/event/${eventId}/members`);
    users.value = response.data || [];  // Добавляем проверку на отсутствие данных
    console.log(users.value);  // Выводим данные в консоль для проверки
  } catch (error) {
    console.error('Ошибка при получении данных участников:', error);
  }
};

onMounted(fetchMembers);

// Фильтруем пользователей по поисковому запросу и состоянию
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch =
        (user.firstname && user.firstname.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
        (user.middlename && user.middlename.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
        (user.lastname && user.lastname.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchQuery.value.toLowerCase()));

    const matchesState = filterState.value
        ? (filterState.value === 'Рассмотрение' && user.approved === null) ||
        (filterState.value === 'Одобрено' && user.approved === true) ||
        (filterState.value === 'Отклонено' && user.approved === false)
        : true;

    return matchesSearch && matchesState;
  });
});

// Функция для фильтрации по состоянию
const filterByState = (state) => {
  filterState.value = filterState.value === state ? '' : state;
};

// Функция для выбора всех пользователей
const selectAll = (event) => {
  if (event.target.checked) {
    selectedUsers.value = filteredUsers.value.map(user => user.id);
  } else {
    selectedUsers.value = [];
  }
};

const approve = async (userId) => {
  const eventId = route.params.id;
  const user = users.value.find(user => user.id === userId);
  if (!user) {
    console.error('User not found');
    return;
  }

  try {
    // Одобрение участника
    const approveResponse = await axios.post(`/api/event/approve/${userId}`);
    console.log('Approval successful:', approveResponse.data);

    // Отправка email
    const emailResponse = await axios.get(`/api/email/${userId}`);
    console.log('Email sent:', emailResponse.data);

    // Обновление состояния пользователя в списке
    user.approved = true;
  } catch (error) {
    console.error('Error during form submission:', error);
  }
};

// Функция для удаления пользователя
const deleteUser = (userId) => {
  if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
    users.value = users.value.filter(user => user.id !== userId);
  }
};
const goBack = () => {
  router.back();
  console.log("SDASD")
}

</script>

<template>
  <header>
    <img src="../assets/Logo.svg" alt="">
  </header>
  <div class="user-table">
    <h2>Участники "EVENT NAME"</h2>
    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="🔍 Поиск" />
    </div>
    <div class="filter-buttons">
      <button
          :class="{ active: filterState === 'Рассмотрение' }"
          @click="filterByState('Рассмотрение')"
      >
        Рассмотрение
      </button>
      <button
          :class="{ active: filterState === 'Одобрено' }"
          @click="filterByState('Одобрено')"
      >
        Одобрено
      </button>
      <button
          :class="{ active: filterState === 'Отклонено' }"
          @click="filterByState('Отклонено')"
      >
        Отклонено
      </button>
    </div>
    <div class="table-wrapper">
      <table>
        <thead>
        <tr>
          <th><input type="checkbox" @change="selectAll($event)" /></th>
          <th>№</th>
          <th>Состояние</th>
          <th>Оргиназация</th>
          <th>Должность</th>
          <th>Email</th>
          <th>ФИО</th>
          <th>Телефон</th>
          <th>Одобрить</th>
          <th>Отклонить</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(user, index) in filteredUsers" :key="user.id">
          <td><input type="checkbox" v-model="selectedUsers" :value="user.id" /></td>
          <td>{{ index + 1 }}</td>
          <td>{{ user.approved === null ? 'Рассмотрение' : (user.approved ? 'Одобрено' : 'Отклонено') }}</td>
          <td>{{ user.company }}</td>
          <td>{{ user.position }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.firstname }} {{ user.middlename }} {{ user.lastname }}</td>
          <td>{{ user.phone }}</td>
          <td><button @click="approve(user.id)">✔️</button></td>
          <td><button @click="deleteUser(user.id)">❌</button></td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="footer">
      <p>Всего пользователей: {{ filteredUsers.length }}</p>
      <button @click="goBack">Назад</button>
    </div>
  </div>
</template>

<style scoped>
.user-table {
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
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

  position: relative; /* Важно для позиционирования псевдоэлемента */
}

h2::after {
  content: "";
  display: block;
  width: 70%; /* Установите нужную длину линии */
  height: 3px; /* Толщина линии */
  background-color: black; /* Цвет линии */
  position: absolute;
  bottom: -10px; /* Положение линии относительно h2 */
}

.search-bar {
  margin-top: 1px;
  margin-bottom: 1rem;
  width: 400px;
  height: 40px;
  position: absolute;
  top: 229px;
  left: 375px;

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

.filter-buttons {
  margin-top: 80px;
  margin-bottom: 1rem;
  width: 400px;
  height: 40px;
  position: absolute;
  top: 150px;
  left: 840px;
}

.filter-buttons button {
  margin-right: 10px;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #000000;
  border-radius: 5px;
  font-family: "Inter-regular";
  font-size: 16px;
  font-weight: 700;
  line-height: 30px;
  cursor: pointer;
}

.filter-buttons button:hover {
  background-color: #ddd;
}

.filter-buttons button.active {
  background-color: rgba(63, 85, 101, 1);
  color: white;
}


.table-wrapper {
  margin-top: 130px;
  overflow-y: auto;
  max-height: 550px; /* Adjust this value based on your needs */
  width: 1300px;
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
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
}

th {
  padding: 0.75rem;
  text-align: center;
  background-color: #f0f0f0;
  font-family: "Inter-regular";
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
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

.footer button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #000;
  border-radius: 5px;
  cursor: pointer;
}

.footer button:hover {
  background-color: #ddd;
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