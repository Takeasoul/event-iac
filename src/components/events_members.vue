<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import config from "@/configApi.js";



// Получаем ID события из роутера
const route = useRoute();
const eventId = route.params.id;
const router = useRouter();
const users = ref([]);
const event = ref([])

const filterState = ref('');
const searchQuery = ref('');
const selectedUsers = ref([]);
//axios.defaults.baseURL = apiUrl;
// Получаем данные участников события при монтировании компонента
const fetchMembers = async () => {
  try {
    const params = {
      pageNumber: 0,
      pageSize: 8,
      eventId: eventId // Убедитесь, что eventId не null или undefined
    };

    const response = await axios.get(`${config.url}/api/v1/event-members`, { params });
    // Извлечение массива пользователей из объекта
    users.value = response.data.data || [];
    console.log(users.value);
  } catch (error) {
    console.error('Ошибка при получении данных участников:', error.response ? error.response.data : error.message);
  }
};

onMounted(fetchMembers);


const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch =
        (user.firstname && user.firstname.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
        (user.middlename && user.middlename.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
        (user.lastname && user.lastname.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchQuery.value.toLowerCase()));

    const matchesState = filterState.value
        ? (filterState.value === 'Рассмотрение' && user.approvement === 'CONSIDERATION') ||
        (filterState.value === 'Одобрено' && user.approvement === 'APPROVED') ||
        (filterState.value === 'Отклонено' && user.approvement === 'NOT_APPROVED')
        : true;

    return matchesSearch && matchesState;
  });
});

const fetchEvent = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/v1/events/${eventId}`);
    event.value = response.data || [];  // Добавляем проверку на отсутствие данных
    console.debug(event.value);
    console.log(event.value);  // Выводим данные в консоль для проверки
  } catch (error) {
    console.error('Ошибка при получении данных участников:', error);
  }
};
onMounted(fetchEvent);
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


function downloadBadges(){
  try {
    axios({
      url: `http://localhost/api/document/pdf/badges`,// Download File URL Goes Here
      method: 'GET',
      responseType: 'blob',
      params: {
        eventId: eventId,
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': ' GET, PUT, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
        'Access-Control-Allow-Credentials': 'false',
      },

    }).then((response) => {
      var fileURL = window.URL.createObjectURL(new Blob([response.data]));
      var fileLink = document.createElement('a');

      fileLink.href = fileURL;
      fileLink.setAttribute('download', 'badges.pdf');
      document.body.appendChild(fileLink);

      fileLink.click();
    });
    console.log('Loading successful');
  }catch (error) {
    console.error('Error during loading pdf:', error);
  }
}

const approve = async (userId) => {
  const eventId = route.params.id;
  const user = users.value.find(user => user.id === userId);
  if (!user) {
    console.error('User not found');
    return;
  }

  try {
    // Одобрение участника
    const approveResponse = await axios.put(`http://localhost:8080/api/v1/event-members/approvement/${userId}`, null, {
      params: {
        approvement: "APPROVED"
      }
    });
    console.log('Approval successful:', approveResponse.data);

    // Отправка email
    const emailResponse = await axios.get(`http://localhost:8080/api/email/${userId}`);
    console.log('Email sent:', emailResponse.data);

    // Обновление состояния пользователя в списке
    user.approved = true;
  } catch (error) {
    console.error('Error during form submission:', error);
  }
};

const unapprove = async (userId) => {
  const eventId = route.params.id;
  const user = users.value.find(user => user.id === userId);
  if (!user) {
    console.error('User not found');
    return;
  }

  try {
    const approveResponse = await axios.put(`http://localhost:8080/api/v1/event-members/approvement/${userId}`, null, {
      params: {
        approvement: "NOT_APPROVED"
      }
    });
    console.log('Approval successful:', approveResponse.data);

    // // Отправка email
    // const emailResponse = await axios.get(`/api/email/${userId}`);
    // console.log('Email sent:', emailResponse.data);

    // Обновление состояния пользователя в списке
    user.approved = false;
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


</script>

<template>
  <header>
    <img src="../assets/Logo.svg" alt="">
  </header>
  <div class="user-table">
    <h2>Участники "{{ event.name }}"</h2>
    <div class="search-filter-container">
      <div class="search-bar">
        <input type="text" v-model="searchQuery" placeholder=" Поиск" class="input-with-icon"/>
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
        <button @click="downloadBadges()" class="downloadButtons">
          Скачать бэйджи
          <font-awesome-icon :icon="faDownload" class="pdf-icon"/>
        </button>
      </div>
    </div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" @change="selectAll($event)" /></th>
            <th>№</th>
            <th>Статус участника</th>
            <th>Состояние</th>
            <th>Организация</th>
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
            <td>{{ user.statusName }}</td>
            <td>{{ getStatusLabel(user.approvement) }}</td>
            <td>{{ user.company }}</td>
            <td>{{ user.position }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.lastname }} {{ user.firstname }} {{ user.middlename }}</td>
            <td>{{ user.phone }}</td>
            <td><button @click="approve(user.id)">✅</button></td>
            <td><button @click="unapprove(user.id)">❌</button></td>
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
  width: 90%; /* Увеличьте ширину таблицы */
  max-width: 1700px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 5px;
  padding: 1rem;
  /* Убрали тень */
}

header {
  /* Logo */
  position: absolute;
  width: 291px;
  height: 100px;
  left: 20px;
  top: 20px;
}

h2 {
  text-align: left;
  color: rgba(63, 85, 101, 1);
  padding: 10px;
  box-sizing: border-box;
  font-family: "Inter-regular";
  font-size: 32px;
  font-weight: 700;
  line-height: 39px;
  position: relative;
  border-bottom: 3px solid black; /* Линия под заголовком */
}

.search-filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.search-bar {
  width: 30%; /* Уменьшите ширину поиска */
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
  display: flex;
  gap: 10px;
}

.filter-buttons button {
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

.download-button {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.download-button button {
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

.download-button button:hover {
  background-color: #ddd;
}

.table-wrapper {
  overflow-y: auto;
  max-height: 600px;
  margin-top: 1rem;
  width: 100%; /* Добавьте это для фикса ширины */
}

table {
  width: 100%; /* Добавьте это для фикса ширины */
  border-collapse: collapse; /* Убедитесь, что границы таблицы коллапсируют */
}



td, th {
  padding: 1rem;
  text-align: center;
  background-color: #f0f0f0;
}

th {
  background-color: #e0e0e0;
  font-family: "Inter-regular";
  font-size: 18px;
  font-weight: 400;
}

td {
  font-family: "Inter-light";
  font-size: 18px;
  font-weight: 400;
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
  text-align: center;
  margin-top: 1rem;
  font-family: "Inter-regular";
  font-size: 20px;
  font-weight: 400;
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