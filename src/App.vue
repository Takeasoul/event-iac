
<script setup>
import admin_sign_in from "./components/admin_sign_in.vue";
import admin_sign_up from "./components/admin_sign_up.vue";
import admin_panel from "./components/admin_panel.vue";
import registration_form from "./components/registration_form.vue";
import approve from "./components/approve.vue";
import createEvent from "./components/createEvent.vue";
</script>

<template>
  <div id="app">

    <router-view />
  </div>
</template>

<style scoped>
nav {
  display: flex;
  gap: 10px;
}
</style>
