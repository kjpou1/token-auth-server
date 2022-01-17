import { createStore } from 'vuex';
import { combineURLs } from '@/helpers';
import Configuration from '@/helpers/ConfigProvider';
import AuthService from '@/services/authService';

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
      const redirectTo = combineURLs(Configuration.value('signInRedirect'), `?requestId=${state.signInRequestId}`);
      window.location.href = redirectTo;
    },
    registerRedirect() {
      const redirectTo = Configuration.value('registerRedirect');
      window.location.href = redirectTo;
    },
    async register({ commit }, payload) {
      commit('setRegistrationError', null);
      commit('toggleRegistering');

      // Call service function to process register request
      const registerResponse = await AuthService.register(payload);

      if (registerResponse?.status === 200) {
        commit('toggleRegistration');
      } else {
        commit('setRegistrationError', registerResponse?.message ?? 'Unknown error.');
      }
      commit('toggleRegistering');
    },
    async signIn({ commit }, payload) {
      commit('setSignInError', null);
      commit('toggleSigningIn');

      // Call service function to process sign in request
      const signInResponse = await AuthService.signIn(payload);
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
