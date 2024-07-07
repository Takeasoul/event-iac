<script setup>
import galochkaImage from '@/assets/galochka.png';

</script>

<template>
  <div class="container">
    <h1>Данные успешно отправлены!</h1>
    <p>Скоро на указанную Вами почту будет отправлен QR-код, который вам нужно будет предъявить для верификации на мероприятии.</p>
    <img :src="galochkaImage" alt="Галочка">
    <h1>Ждем Вас на мероприятии!</h1>
  </div>
</template>

<style scoped>

</style>