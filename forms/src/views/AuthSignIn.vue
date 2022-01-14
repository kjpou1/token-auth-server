<template>
  <div class="signin">
    <app-sign-in-form> </app-sign-in-form>
  </div>
</template>

<script>
// @ is an alias to /src
import AppSignInForm from '@/components/SignInForm.vue';

export default {
  name: 'AuthSignIn',
  components: {
    AppSignInForm,
  },
};
</script>

<style>

</style>
