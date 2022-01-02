<template>
  <div class="register">
    <app-register-form> </app-register-form>
  </div>
</template>

<script>
// @ is an alias to /src
import AppRegisterForm from '@/components/RegisterForm.vue';

export default {
  name: 'AuthRegister',
  components: {
    AppRegisterForm,
  },
};
</script>

<style>

</style>
