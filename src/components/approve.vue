<script setup>
import galochkaImage from '@/assets/galochka.png';
</script>

<template>
  <header>
    <img src="@/assets/Logo.svg" alt="Logo" class="logo">

  </header>
  <div class="container">
    <h1>Данные успешно отправлены!</h1>
    <p>Скоро на указанную Вами почту будет отправлен QR-код, который вам нужно будет предъявить для верификации на мероприятии.</p>
    <img src="@/assets/galochka.png" alt="Галочка" class="circle">
    <h1>Ждем Вас на мероприятии!</h1>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 50px;
}

.logo {
  width: 200px;
  height: 80px;
  margin-bottom: 20px;
}

.circle {
  width: 300px;
  height: 300px;
  margin-top: 20px;
}

h1 {
  color: rgb(63, 85, 101);
  font-family: "Inter-regular";
  font-size: 28px;
  font-weight: 400;
  line-height: 34px;
  margin-bottom: 10px;
}

p {
  color: #666;
  font-family: "Inter-regular";
  font-size: 20px;
  line-height: 26px;
  margin-bottom: 15px;
}
</style>
