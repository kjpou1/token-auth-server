import { createStore } from 'vuex';

export default createStore({
  state: {
    authModalShow: false,
    userSignedIn: false,
    userRegisterd: false,
    registrationError: false,
    registrationErrorMessage: null,
  },

  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth(state) {
      state.userSignedIn = !state.userSignedIn;
    },
    toggleRegistration(state) {
      state.userRegistered = !state.userRegistered;
    },
    setRegistrationError: (state, payload) => {
      state.registrationErrorMessage = payload;
      state.registrationError = payload !== null;
    },
  },
  getters: {
    // authModalShow: (state) => state.authModalShow,
    isSignedIn: (state) => state.userSignedIn,
    isRegistrationError: (state) => state.registrationError,
    isRegistered: (state) => state.userRegistered,
    getRegistrationErrorMessage: (state) => state.registrationErrorMessage,
  },
  actions: {
    async register({ commit }, payload) {
      console.log(payload);
      commit('setRegistrationError', null);
      const response = await fetch('http://localhost:3001/api/v1/register', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          password: payload.password,
          roles: ['User', 'Admin'],
        }),
        headers: {
          'content-type': 'application/json',
        },
      });
      const registerResponse = await response.json();
      console.log(registerResponse);
      if (registerResponse?.status === 200) {
        commit('toggleRegistration');
      } else {
        commit('setRegistrationError', registerResponse?.message ?? 'Unknown error.');
      }
    },
  },
  modules: {
  },
});
