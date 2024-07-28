<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import config from "@/configApi.js";

const route = useRoute();
const eventId = route.params.evId;
const router = useRouter();

const users = ref([]);
const event = ref([]);
const statuses = ref([]);
const selectedUsers = ref([]);
const filterState = ref('');
const searchQuery = ref('');
const showModal = ref(false);
const editingUser = ref(null);

// Fetching event members
const fetchMembers = async () => {
  try {
    const params = {
      pageNumber: 0,
      pageSize: 1000,
      eventId: eventId
    };
    const response = await axios.get(`${config.url}/api/v1/media`, { params });
    users.value = response.data.data || [];
    console.log()
  } catch (error) {
    console.error('Ошибка при получении данных участников:', error.response ? error.response.data : error.message);
  }
};

// Fetching event details
const fetchEvent = async () => {
  try {
    const response = await axios.get(`${config.url}/api/v1/events/${eventId}`);
    event.value = response.data || [];
  } catch (error) {
    console.error('Ошибка при получении данных мероприятия:', error);
  }
};

const fetchStatuses = async () => {
  try {
    console.log('Запрос к серверу');
    const response = await axios.get(`${config.url}/api/v1/status/getAll`);
    console.debug("Статусы от сервера", response.data); // Проверьте, что данные есть
    statuses.value = response.data || [];
    console.log('Статусы обновлены', statuses.value);
  } catch (error) {
    console.error('Ошибка при получении статусов:', error.response ? error.response.data : error.message);
  }
};
// Open modal for editing
const openEditModal = (user) => {
  editingUser.value = { ...user };
  showModal.value = true;

  // Найти соответствующий статус в списке и установить его в editingUser.status
  const userStatus = statuses.value.find(status => status.status === user.statusName);
  if (userStatus) {
    editingUser.value.status = userStatus.id; // Присвоить ID статуса
  } else {
    editingUser.value.status = null; // Если статус не найден
  }

  console.log('Редактирование пользователя:', editingUser.value);
};

const downloadCSV = async () => {
  try {
    const response = await axios({
      url: `${config.url}/api/document/csv/media/${eventId}`,
      method: 'GET',
      responseType: 'blob',
    });

    // Извлекаем имя файла из заголовка
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].split(';')[0].replace(/"/g, '')
        : 'default.csv'; // Имя файла по умолчанию

    // Создаем объект URL и ссылку для загрузки
    const fileURL = window.URL.createObjectURL(new Blob([response.data]));
    const fileLink = document.createElement('a');
    fileLink.href = fileURL;
    fileLink.setAttribute('download', filename);
    document.body.appendChild(fileLink);
    fileLink.click();

    // Удаляем ссылку из DOM
    document.body.removeChild(fileLink);
  } catch (error) {
    console.error('Ошибка при загрузке CSV:', error);
    if (error.response) {
      console.error('Response error status:', error.response.status);
      console.error('Response error data:', error.response.data);
    } else {
      console.error('Error message:', error.message);
    }
  }
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  editingUser.value = null;
};

// Save changes
const saveChanges = async () => {
  try {
    console.log('Редактируемый пользователь перед сохранением:', editingUser.value);
    console.log("status.id", editingUser.value.status)
    await axios.put(`${config.url}/api/v1/media/${editingUser.value.id}`, {
      ...editingUser.value,
      statusId: editingUser.value.status  // Передать status.id
    });
    console.log('Изменения сохранены');
    closeModal();
    fetchMembers();
  } catch (error) {
    console.error('Ошибка при сохранении изменений:', error);
  }
};

// Fetch data on mount
onMounted(() => {
  fetchMembers();
  fetchEvent();
  fetchStatuses();
});

// Filtering function
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = (user.firstname && user.firstname.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
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

const filterByState = (state) => {
  filterState.value = filterState.value === state ? '' : state;
};

const selectAll = (event) => {
  if (event.target.checked) {
    selectedUsers.value = filteredUsers.value.map(user => user.id);
  } else {
    selectedUsers.value = [];
  }
};



const approve = async (userId) => {
  try {
    alert("Участник подтвержден!");
    await axios.put(`${config.url}/api/v1/meida/approvement/${userId}`, null, { params: { approvement: "APPROVED" } });
    await axios.get(`${config.url}/api/email/${userId}`);
    users.value.find(user => user.id === userId).approved = true;
  } catch (error) {
    console.error('Ошибка при одобрении:', error);
  }
};

const unapprove = async (userId) => {
  try {
    alert("Участник отклонён!");
    await axios.put(`${config.url}/api/v1/media/approvement/${userId}`, null, { params: { approvement: "NOT_APPROVED" } });
    users.value.find(user => user.id === userId).approved = false;
  } catch (error) {
    console.error('Ошибка при отклонении:', error);
  }
};

const deleteUser = (userId) => {
  if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
    users.value = users.value.filter(user => user.id !== userId);
  }
};

const goBack = () => {
  router.back();
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


</script>


<template>

  <div class="user-table">
    <img src="../assets/Logo.svg" alt="">
    <h2>Участники "{{ event.name }}"</h2>
    <div class="search-filter-container">
      <div class="search-bar">
        <input type="text" v-model="searchQuery" placeholder=" Поиск" class="input-with-icon"/>
      </div>
      <div class="filter-buttons">
        <button :class="{ active: filterState === 'Рассмотрение' }" @click="filterByState('Рассмотрение')">Рассмотрение</button>
        <button :class="{ active: filterState === 'Одобрено' }" @click="filterByState('Одобрено')">Одобрено</button>
        <button :class="{ active: filterState === 'Отклонено' }" @click="filterByState('Отклонено')">Отклонено</button>
        <button @click="downloadCSV()" class="downloadButtons">
          Скачать выгрузку
          <font-awesome-icon :icon="faDownload" class="csv-icon"/>
        </button>
      </div>
    </div>
    <div class="table-wrapper">
      <table>
        <thead>
        <tr>
          <th><input type="checkbox" @change="selectAll($event)" /></th>
          <th>№</th>
          <th>Состояние</th>
          <th>Организация</th>
          <th>Должность</th>
          <th>Email</th>
          <th>ФИО</th>
          <th>Серия номер паспорта</th>
          <th>Оборудование</th>
          <th>Одобрить</th>
          <th>Отклонить</th>
          <th>Редактировать</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(user, index) in filteredUsers" :key="user.id">
          <td><input type="checkbox" v-model="selectedUsers" :value="user.id" /></td>
          <td>{{ index + 1 }}</td>
          <td>{{ getStatusLabel(user.approvement) }}</td>
          <td>{{ user.company }}</td>
          <td>{{ user.position }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.lastname }} {{ user.firstname }} {{ user.middlename }}</td>
          <td>{{ user.passportSeries + " " + user.passportNumber }}</td>
          <td>{{ user.equipment }}</td>
          <td><button @click="approve(user.id)">✅</button></td>
          <td><button @click="unapprove(user.id)">❌</button></td>
          <td><button @click="openEditModal(user)">✏️</button></td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="footer">
      <p>Всего пользователей: {{ filteredUsers.length }}</p>
      <button @click="goBack">Назад</button>
    </div>
  </div>

  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <h3>Редактировать участника</h3>
      <label>ФИО:</label>
      <input type="text" v-model="editingUser.lastname" placeholder="Фамилия" />
      <input type="text" v-model="editingUser.firstname" placeholder="Имя" />
      <input type="text" v-model="editingUser.middlename" placeholder="Отчество" />
      <label>Email:</label>
      <input type="email" v-model="editingUser.email" />
      <label>Организация:</label>
      <input type="text" v-model="editingUser.company" />
      <label>Должность:</label>
      <input type="text" v-model="editingUser.position" />
      <div v-if="editingUser">
      </div>
      <button @click="saveChanges">Сохранить</button>
      <button @click="closeModal">Отмена</button>
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
  padding: 0.5rem;
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

@font-face {
  font-family: "Inter-regular";
  src: url(/src/fonts/Inter-Regular.ttf);
}

@font-face {
  font-family: "Inter-light";
  src: url(/src/fonts/Inter-Light.ttf);
}

</style>