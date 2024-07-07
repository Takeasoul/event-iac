
<script setup>
import admin_sign_in from "./components/admin_sign_in.vue";
import admin_sign_up from "./components/admin_sign_up.vue";
import admin_panel from "./components/admin_panel.vue";
import registration_form from "./components/registration_form.vue";
</script>

<template>
  <div id="app">
    <nav>
      <RouterLink to="/login">Login</RouterLink>
      <RouterLink to="/sign-up">Sign Up</RouterLink>
      <RouterLink to="/admin-panel">Admin Panel</RouterLink>
      <RouterLink to="/registration-form">Registration Form</RouterLink>
    </nav>
    <router-view />
  </div>
</template>

<style scoped>
nav {
  display: flex;
  gap: 10px;
}
</style>
