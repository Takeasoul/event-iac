<script setup>

</script>

<template>
  <div class="container">
    <header>
      <h1>Админ-панель | Иван Иванов</h1>
      <a href="admin_sign_in.html" class="logout">Выход</a>
    </header>
    <div class="status-filters">
      <button class="status-button" onclick="showAll()">Весь список</button>
      <button class="status-button" onclick="filterStatus('Одобрено')">Одобрено</button>
      <button class="status-button" onclick="filterStatus('Не одобрено')">Не одобрено</button>
      <button class="status-button" onclick="filterStatus('На рассмотрении')">На рассмотрении</button>
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
      <!-- Пример строки данных -->
      <tr>
        <td class="status">На рассмотрении</td>
        <td>Иван</td>
        <td>Иванович</td>
        <td>Иванов</td>
        <td>Компания</td>
        <td>Должность</td>
        <td>example@example.com</td>
        <td>+79000000000</td>
        <td><button class="approve-button" onclick="changeStatus(this, 'Одобрено')">Одобрить</button></td>
        <td><button class="reject-button" onclick="changeStatus(this, 'Не одобрено')">Отклонить</button></td>
      </tr>
      <!-- Конец примера -->
      </tbody>
    </table>
  </div>
</template>

<style scoped>

</style>