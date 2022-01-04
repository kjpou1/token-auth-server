import { createStore } from 'vuex';
import { combineURLs } from '@/helpers';

export default createStore({
  state: {
    authModalShow: false,
    userSignedIn: false,
    signingIn: false,
    signInError: false,
    signInErrorMessage: null,
    userRegisterd: false,
    registering: false,
    registrationError: false,
    registrationErrorMessage: null,
    signInRequestId: null,
  },

  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth(state) {
      state.userSignedIn = !state.userSignedIn;
    },
    toggleSigningIn(state) {
      state.signingIn = !state.signingIn;
    },
    setSignInError: (state, payload) => {
      state.signInErrorMessage = payload;
      state.signInError = payload !== null;
    },
    setSignInRequestId: (state, payload) => {
      state.signInRequestId = payload;
    },
    toggleRegistration(state) {
      state.userRegistered = !state.userRegistered;
    },
    toggleRegistering(state) {
      state.registering = !state.registering;
    },
    setRegistrationError: (state, payload) => {
      state.registrationErrorMessage = payload;
      state.registrationError = payload !== null;
    },

  },
  getters: {
    // authModalShow: (state) => state.authModalShow,
    isSignedIn: (state) => state.userSignedIn,
    isSignInError: (state) => state.signInError,
    isSigningIn: (state) => state.signingIn,
    getSignInErrorMessage: (state) => state.signInErrorMessage,

    isRegistrationError: (state) => state.registrationError,
    isRegistered: (state) => state.userRegistered,
    isRegistering: (state) => state.registering,
    getRegistrationErrorMessage: (state) => state.registrationErrorMessage,
  },
  actions: {
    signInRedirect({ state }) {
      const redirectTo = combineURLs(process.env.VUE_APP_SIGNIN_REDIRECT, state.signInRequestId);
      window.location.href = redirectTo;
    },
    registerRedirect() {
      const redirectTo = process.env.VUE_APP_REGISTER_REDIRECT;
      window.location.href = redirectTo;
    },
    async register({ commit }, payload) {
      console.log(payload);
      commit('setRegistrationError', null);
      commit('toggleRegistering');
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
      commit('toggleRegistering');
    },
    async signIn({ commit }, payload) {
      console.log(payload);
      commit('setSignInError', null);
      commit('toggleSigningIn');
      const response = await fetch('http://localhost:3001/api/v1/login', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
        }),
        headers: {
          'content-type': 'application/json',
        },
      });
      const signInResponse = await response.json();
      console.log(signInResponse);
      if (signInResponse?.status === 200) {
        commit('setSignInRequestId', signInResponse.details?.jti);
        commit('toggleAuth');
      } else {
        commit('setSignInError', signInResponse?.message ?? 'Unknown error.');
      }
      commit('toggleSigningIn');
    },
  },
  modules: {
  },
});
