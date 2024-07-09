<script setup>

</script>

<template>
  <header>
    <img src="../assets/Logo.svg" alt="">
  </header>
  <div class="user-table">
    <h2>Пользователи "PRODUCT NAME"</h2>
    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="🔍 Поиск" />
    </div>
    <div class="table-wrapper">
      <table>
        <thead>
        <tr>
          <th><input type="checkbox" @change="selectAll($event)" /></th>
          <th>№</th>
          <th>Логин</th>
          <th>Email</th>
          <th>Роль</th>
          <th>Редактировать</th>
          <th>Удалить</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(user, index) in filteredUsers" :key="user.id">
          <td><input type="checkbox" v-model="selectedUsers" :value="user.id" /></td>
          <td>{{ index + 1 }}</td>
          <td>{{ user.login }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td><button @click="editUser(user.id)">✏️</button></td>
          <td><button @click="deleteUser(user.id)">❌</button></td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="footer">
      <p>Всего пользователей: {{ filteredUsers.length }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Массив пользователей для примера
const users = ref([
  { id: 1, login: 'akizar', email: 'odenter2003@gmail.com', role: 'ROLE_USER' },
  { id: 1, login: 'akizar', email: 'odenter2003@gmail.com', role: 'ROLE_USER' },
  { id: 1, login: 'akizar', email: 'odenter2003@gmail.com', role: 'ROLE_USER' },
  { id: 1, login: 'akizar', email: 'odenter2003@gmail.com', role: 'ROLE_USER' },
  { id: 1, login: 'akizar', email: 'odenter2003@gmail.com', role: 'ROLE_USER' },
  { id: 1, login: 'akizar', email: 'odenter2003@gmail.com', role: 'ROLE_USER' },
  { id: 1, login: 'akizar', email: 'odenter2003@gmail.com', role: 'ROLE_USER' },
  { id: 1, login: 'akizar', email: 'odenter2003@gmail.com', role: 'ROLE_USER' },
  { id: 1, login: 'akizar', email: 'odenter2003@gmail.com', role: 'ROLE_USER' },
  { id: 1, login: 'akizar', email: 'odenter2003@gmail.com', role: 'ROLE_USER' },

  // Добавьте больше пользователей по необходимости
]);

const searchQuery = ref('');
const selectedUsers = ref([]);

// Фильтруем пользователей по поисковому запросу
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    return user.login.includes(searchQuery.value) || user.email.includes(searchQuery.value);
  });
});

// Функция для выбора всех пользователей
const selectAll = (event) => {
  if (event.target.checked) {
    selectedUsers.value = filteredUsers.value.map(user => user.id);
  } else {
    selectedUsers.value = [];
  }
};

// Функция для редактирования пользователя
const editUser = (userId) => {
  alert(`Редактирование пользователя с ID: ${userId}`);
};

// Функция для удаления пользователя
const deleteUser = (userId) => {
  if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
    users.value = users.value.filter(user => user.id !== userId);
  }
};
</script>

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
  width: 100%; /* Установите нужную длину линии */
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

.table-wrapper {
  margin-top: 130px;
  overflow-y: auto;
  max-height: 550px; /* Adjust this value based on your needs */
  width: 1133px;
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

@font-face {
  font-family: "Inter-regular";
  src: url(/src/fonts/Inter-Regular.ttf);
}
@font-face {
  font-family: "Inter-light";
  src: url(/src/fonts/Inter-Light.ttf);
}
</style>