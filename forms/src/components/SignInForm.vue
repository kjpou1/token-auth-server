<!-- eslint-disable max-len -->
<template>
    <section class="bg-white dark:bg-gray-900">
        <div class="px-2 flex flex-col items-center justify-center mt-8 sm:mt-0">
          <h2 class="text-4xl dark:text-gray-100 leading-tight pt-8">[[ Your Logo ]]</h2>
        </div>
        <div class="text-white text-center font-bold p-4 mb-4"
          v-if="signin_show_alert"
          :class="signin_alert_variant">
          {{ signin_alert_msg}}
        </div>

        <div class="mx-auto flex justify-center md:items-center relative md:h-full">
          <!-- SignIn Form -->
          <vee-form id="signin" :validation-schema="schema"
            @submit="signin"
            class="w-full sm:w-4/6 md:w-3/6 lg:w-4/12 xl:w-3/12 text-gray-800 mb-32 sm:mb-0 my-40 sm:my-12 px-2 sm:px-0">
            <div class="pt-0 px-2 flex flex-col items-center justify-center">
                <h3 class="text-2xl sm:text-3xl xl:text-2xl font-bold dark:text-gray-100 leading-tight">Login To Your Account</h3>
            </div>
            <div class="mt-12 w-full px-2 sm:px-6">
              <!-- Email -->
              <div class="flex flex-col mt-5">
                <label class="text-lg font-semibold dark:text-gray-100 leading-tight">Email</label>
                <vee-field type="email" name="email"
                  class="h-10 px-2 w-full rounded mt-2 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 dark:border-gray-700 dark:focus:border-indigo-600 focus:outline-none focus:border focus:border-indigo-700 border-gray-300 border shadow"
                  placeholder="Enter Email" />
                <ErrorMessage class="text-red-600" name="email"/>
              </div>
              <!-- Password -->
              <div class="flex flex-col mt-5">
                <label class="text-lg font-semibold dark:text-gray-100 leading-tight">Password</label>
                <vee-field type="password" name="password"
                  :bails="false"
                  v-slot="{ field, errors }">
                  <input class="h-10 px-2 w-full rounded mt-2 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 dark:border-gray-700 dark:focus:border-indigo-600 focus:outline-none focus:border focus:border-indigo-700 border-gray-300 border shadow"
                  type = "password"
                  placeholder="Password" v-bind="field"/>
                  <div class="text-red-600" v-for="error in errors" :key="error">
                    {{ error }}
                  </div>
                </vee-field>
              </div>
            </div>
            <div class="pt-6 w-full flex justify-between px-2 sm:px-6">
                <div class="flex items-center">
                    <input id="rememberme" name="rememberme" class="w-3 h-3 mr-2 bg-white dark:bg-gray-800" type="checkbox" />
                    <label for="rememberme" class="text-xs dark:text-gray-100">Remember Me</label>
                </div>
                <a class="text-xs text-indigo-600" href="javascript: void(0)">Forgot Password?</a>
            </div>
            <div class="px-2 mb-16 sm:mb-56 md:mb-16 sm:px-6">
                <button
                  class="focus:outline-none w-full bg-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-8 py-3 text-sm mt-6"
                  type = "submit"
                  :disabled="this.isSigningIn"
                >Sign In</button>
                <p class="mt-16 text-xs text-center dark:text-gray-100">Don’t Have An Account? <a class="underline text-indigo-600" href="/auth-forms/register">Sign Up</a></p>
            </div>
          </vee-form>
        </div>
    </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'SignInForm',
  data() {
    return {
      schema: {
        email: 'required|min:3|max:100|email',
        password: 'required|min:3|max:100',
      },
      signin_show_alert: false,
      signin_alert_variant: 'bg-blue-500',
      signin_alert_msg: 'Please wait! We are signing you in.',
    };
  },
  methods: {
    async signin(values) {
      try {
        await this.$store.dispatch('signIn', values);
      } catch (error) {
        this.reg_in_submission = false;
        this.reg_alert_variant = 'bg-red-500';
        this.reg_alert_msg = 'An unexpected error occured.  Please try again later.';
      }
    },
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'isSignInError',
      'isSigningIn',
      'isSignedIn',
      'getSignInErrorMessage',
      // ...
    ]),
  },
  watch: {
    isSigningIn() {
      // Show message
      if (this.isSigningIn) {
        this.signin_show_alert = true;
        this.signin_alert_msg = 'Please wait! We are signing you in.';
      }

      // set the colors
      if (this.isSignInError) {
        this.signin_alert_variant = 'bg-red-500';
      } else if (this.isSignedIn) { this.signin_alert_variant = 'bg-green-500'; } else { this.signin_alert_variant = 'bg-blue-500'; }
    },
    isSignedIn() {
      this.signin_alert_msg = 'Success! You are now signed in.';
      try {
        this.$store.dispatch('signInRedirect');
      } catch (error) {
        this.reg_alert_variant = 'bg-red-500';
        this.reg_alert_msg = 'An unexpected error occured while trying to redirect.  Please try again later.';
      }
    },
    isSignInError() {
      this.signin_alert_msg = this.getSignInErrorMessage;
    },
  },
};
</script>
