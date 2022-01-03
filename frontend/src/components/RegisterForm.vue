<!-- eslint-disable max-len -->
<template>
    <section class="bg-white dark:bg-gray-900">
        <div class="px-2 flex flex-col items-center justify-center mt-8 sm:mt-0">
            <h2 class="text-4xl dark:text-gray-100 leading-tight pt-8">[[ Your Logo ]]</h2>
        </div>
          <div class="text-white text-center font-bold p-4 mb-4"
            v-if="reg_show_alert" :class="reg_alert_variant">
            {{ reg_alert_msg }}
          </div>

        <div class="mx-auto flex justify-center md:items-center relative md:h-full">
          <!-- Registration Form -->
          <vee-form id="register" :validation-schema="schema"
            @submit="register"
            class="w-full sm:w-4/6 md:w-3/6 lg:w-4/12 xl:w-3/12 text-gray-800 mb-32 sm:mb-0 my-40 sm:my-12 px-2 sm:px-0">
            <div class="pt-0 px-2 flex flex-col items-center justify-center">
                <h3 class="text-2xl sm:text-3xl xl:text-2xl font-bold dark:text-gray-100 leading-tight">Register</h3>
            </div>

            <div class="mt-12 w-full px-2 sm:px-6">
              <!-- Name -->
              <div class="flex flex-col mt-5">
                <label class="text-lg font-semibold dark:text-gray-100 leading-tight">Name</label>
                <vee-field type="text" name="name"
                  class="h-10 px-2 w-full rounded mt-2 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 dark:border-gray-700 dark:focus:border-indigo-600 focus:outline-none focus:border focus:border-indigo-700 border-gray-300 border shadow"
                  placeholder="Enter Name" />
                <ErrorMessage class="text-red-600" name="name"/>
              </div>
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
              <!-- Confirm Password -->
              <div class="flex flex-col mt-5">
                <label class="text-lg font-semibold dark:text-gray-100 leading-tight">Confirm Password</label>
                <vee-field type="password" name="confirm_password"
                  class="h-10 px-2 w-full rounded mt-2 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 dark:border-gray-700 dark:focus:border-indigo-600 focus:outline-none focus:border focus:border-indigo-700 border-gray-300 border shadow"
                  placeholder="Confirm Password" />
                <ErrorMessage class="text-red-600" name="confirm_password"/>
              </div>

            </div>
            <!-- TOS -->
            <div class="pt-6 w-full flex justify-between px-2 sm:px-6">
                <div id="tos" class="flex items-center">
                    <vee-field type="checkbox"  name="tos" value="1"
                      class="w-3 h-3 mr-2 bg-white dark:bg-gray-800" />
                    <label for="tos" class="text-xs dark:text-gray-100">Accept terms of service</label>
                </div>
                <p>
                <ErrorMessage class="text-red-600" name="tos"/>
                </p>
            </div>
            <div class="px-2 mb-16 sm:mb-56 md:mb-16 sm:px-6">
                <button
                  class="focus:outline-none w-full bg-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-8 py-3 text-sm mt-6"
                  type="submit" :disabled="reg_in_submission"
                >Register</button>
            </div>
          </vee-form>
        </div>
    </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'RegisterForm',
  data() {
    return {
      schema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|min:3|max:100|email',
        password: 'required|min:3|max:100',
        confirm_password: 'passwords_mismatch:@password',
        tos: 'tos',
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: 'bg-blue-500',
      reg_alert_msg: 'Please wait!  Your account is being created.',
    };
  },
  mounted() {
    // this.submit();
  },
  methods: {
    async register(values) {
      this.reg_show_alert = true;
      this.reg_in_submission = true;
      this.reg_alert_variant = 'bg-blue-500';
      this.reg_alert_msg = 'Please wait!  Your account is being created.';

      try {
        await this.$store.dispatch('register', values);
      } catch (error) {
        this.reg_in_submission = false;
        this.reg_alert_variant = 'bg-red-500';
        this.reg_alert_msg = 'An unexpected error occured.  Please try again later.';
      }
    },
    submit() {
      const form = document.getElementById('register');
      form.addEventListener(
        'submit',
        (event) => {
          event.preventDefault();
          const { elements } = form;
          const payload = {};
          for (let i = 0; i < elements.length; i += 1) {
            const item = elements.item(i);
            switch (item.type) {
              case 'checkbox':
                payload[item.name] = item.checked;
                break;
              case 'submit':
                break;
              default:
                payload[item.name] = item.value;
                break;
            }
          }
          // Place your API call here to submit your payload.
          console.log('payload', payload);
        },
        true,
      );
    },
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'isRegistrationError',
      'isRegistered',
      'getRegistrationErrorMessage',
      // ...
    ]),
  },
  watch: {
    isRegistered() {
      this.reg_in_submission = false;
      this.reg_alert_variant = 'bg-green-500';
      this.reg_alert_msg = 'Success! Your account has been created';
    },
    isRegistrationError() {
      this.reg_in_submission = false;
      this.reg_alert_variant = this.getRegistrationErrorMessage !== null ? 'bg-red-500' : '';
      this.reg_alert_msg = this.getRegistrationErrorMessage;
    },
  },
};
</script>

<style>

</style>
