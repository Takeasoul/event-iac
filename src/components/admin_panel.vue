<script setup>

</script>

<script setup>
// Включите Vue функционал для фильтрации и изменения статуса
</script>

<template>
  <div class="container">
    <header>
      <h1>Админ-панель | Иван Иванов</h1>
      <a href="admin_sign_in.html" class="logout">Выход</a>
    </header>
    <div class="status-filters">
      <button class="status-button" @click="showAll">Весь список</button>
      <button class="status-button" @click="filterStatus('Одобрено')">Одобрено</button>
      <button class="status-button" @click="filterStatus('Не одобрено')">Не одобрено</button>
      <button class="status-button" @click="filterStatus('На рассмотрении')">На рассмотрении</button>
    </div>
    <table id="data-table">
      <thead>
      <tr>
        <th>Статус</th>
        <th>Имя</th>
        <th>Отчество</th>
        <th>Фамилия</th>
        <th>Компания</th>
        <th>Должность</th>
        <th>Email</th>
        <th>Телефон</th>
        <th>Одобрить</th>
        <th>Отклонить</th>
      </tr>
      </thead>
      <tbody>

      </tbody>
    </table>
  </div>
</template>

<style scoped>





.logout {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
}

.status-filters {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
  color: #007bff;
}



table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.5rem;
  text-align: center;
  border: 1px solid #ccc;
}

.approve-button, .reject-button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.approve-button {
  background-color: #28a745;
  color: #fff;
}

.reject-button {
  background-color: #dc3545;
  color: #fff;
}
</style>