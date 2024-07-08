<script setup>
import galochkaImage from '@/assets/galochka.png';

</script>

<template>
  <header>
    <img src="../assets/Logo.svg" alt="" class = "logo">
  </header>
  <div class="container">
    <h1>Данные успешно отправлены!</h1>
    <p>Скоро на указанную Вами почту будет отправлен QR-код, который вам нужно будет предъявить для верификации на мероприятии.</p>
    <img src="../assets/check-circle.svg" alt="" class = "cirlce">
    <h1>Ждем Вас на мероприятии!</h1>
  </div>
</template>

<style scoped>
.container{
  display:-moz-groupbox;
  align-items: center;
  justify-content: center;
}
.cirlce{
  width: 300px;
  height: 300px;
}
</style>