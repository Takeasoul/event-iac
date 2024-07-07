<script setup>

</script>

<template>
  <div class="container">
    <h1>Заполните данные</h1>
    <p>Проверьте корректность введённых данных, так как по ним будет проходить верификация на мероприятии.</p>
    <form id="registrationForm" method="POST" action="http://localhost:3000/your-server-endpoint">
      <label for="firstName">Имя</label>
      <input type="text" id="firstName" name="firstName" placeholder="Ваше полное имя" required>

      <label for="middleName">Отчество</label>
      <input type="text" id="middleName" name="middleName" placeholder="Ваше отчество (при наличии)">

      <label for="lastName">Фамилия</label>
      <input type="text" id="lastName" name="lastName" placeholder="Ваша фамилия" required>

      <label for="company">Компания</label>
      <input type="text" id="company" name="company" placeholder="Полное наименование компании" required>

      <label for="position">Должность</label>
      <input type="text" id="position" name="position" placeholder="Ваша должность" required>

      <label for="email">Email</label>
      <input type="email" id="email" name="email" placeholder="Корпоративный адрес" required>

      <label for="phone">Контактный телефон</label>
      <input type="tel" id="phone" name="phone" placeholder="Ваш номер телефона" required>

      <button type="submit">Отправить</button>
    </form>
    <p>Нажимая кнопку «Отправить», Вы соглашаетесь с Политикой конфиденциальности и условиями обслуживания.</p>
  </div>
</template>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
}

.logout {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
}

.status-filters {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}

.status-button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  background-color: #f0f0f0;
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