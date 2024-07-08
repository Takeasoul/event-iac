<script setup>

</script>

<template>
  <header>
    <img src="../assets/Logo.svg" alt="">
  </header>
  <div class="container">
    <div class = form-background >
      <h1>Регистрация на: </h1>

      <form id="registrationForm" method="POST" action="http://localhost:3000/your-server-endpoint">
        <input type="text" id="middleName" name="middleName" placeholder="Фамилия" required>

        <input type="text" id="firstName" name="firstName" placeholder="Имя" required>

        <input type="text" id="lastName" name="lastName" placeholder="Отчество (при наличии)">

        <input type="text" id="company" name="company" placeholder="Полное наименование компании" required>

        <input type="text" id="position" name="position" placeholder="Должность" required>

        <input type="email" id="email" name="email" placeholder="Корпоративный адрес" required>

        <input type="tel" id="phone" name="phone" placeholder="Номер телефона" required>

        <button type="submit">Отправить</button>
      </form>
      <p class = "bottom-text" >Проверьте корректность введённых данных, так как по ним будет проходить верификация на мероприятии.</p>
      <p class = "bottom-text">Нажимая кнопку «Отправить», Вы соглашаетесь с Политикой конфиденциальности и условиями обслуживания.</p>
    </div>
  </div>
</template>

<style scoped>
body {
  background-color: rgb(255, 255, 255);
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

header {
  /* Logo */
  position: absolute;
  width: 291px;
  height: 100px;
  left: 42px;
  top: 10px;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.form-background {
  width: 800px;
  height: 800px;
  padding: 30px;
  border-radius: 5px;
  background: rgb(255, 255, 255);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3%; 
}
h1{
  color: rgb(63, 85, 101);
  font-family:"Inter-regular";
  font-size: 32px;
  font-weight: 400;
  line-height: 39px;
  letter-spacing: 0%;
  text-align: left;
  padding-bottom: 5px;
}
form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

input {
  width: 380px;
  height: 25px;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid rgb(63, 85, 101);

  font-family: "Inter-regular";
  font-size:20px;
}

button {
  padding: 10px;
  margin: 10px 20px 10px 20px;
  width: 400px;
  background-color:  rgb(63, 85, 101);
  text-decoration: none;
  border-radius: 5px;
  border:none;
  outline: none;

  color:white;
  font-family: "Inter-regular";
  font-size: 20px;
  font-weight: 100;
  line-height: 29px;
  letter-spacing: 0%;
  text-align: center;
}
button:focus{
  outline: none;
}
button:hover{
  background-color:  rgb(134, 166, 189);
  transition: all 0.5s ease;
}
input:focus{
  outline: none;
}
::placeholder{
  font-family: "Inter-regular";
  font-size: 20px;
  color: rgb(63, 85, 101);
}
.authorize{
  padding-top: 20px;
  font-family: "Inter-light";
  font-size: 20px;
  font-weight: 400px;
  color: rgb(63, 85, 101);;
}
.bottom-text{
  display: flex;
  font-family: "Inter-regular";
  align-items: center;
  color: black;
  font-size: 18px;
  text-align: center;
  margin: 0;
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