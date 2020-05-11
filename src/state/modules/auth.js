import axios from 'axios'

export const state = {
  currentUser: getSavedState('auth.currentUser'),
}

export const mutations = {
  SET_CURRENT_USER(state, newValue) {
    state.currentUser = newValue
    saveState('auth.currentUser', newValue)
    setDefaultAuthHeaders(state)
  },
}

export const getters = {
  // Whether the user is currently logged in.
  loggedIn(state) {
    return !!state.currentUser
  },
}

export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  init({ state, dispatch }) {
    setDefaultAuthHeaders(state)
    dispatch('validate')
  },

  // Logs in the current user.
  logIn({ commit, dispatch, getters }, { username, customercode, password } = {}) {
    // if (getters.loggedIn) return dispatch('validate')

    return axios
      .post('/api/user/login', { username, customercode, password })
      .then((response) => {
        const user = response.data
        commit('SET_CURRENT_USER', user)
        return user
      })
  },

  // Logs out the current user.
  logOut({ commit }) {
    localStorage.removeItem('Authorization');
    commit('SET_CURRENT_USER', null)
  },

  // register the user
  register({ commit, dispatch, getters }, { customerid, usercode, username, 
    password, email, mobile, telephone, website, countryid } = {}) {
    // if (getters.loggedIn) return dispatch('validate')
    console.log({ 
      customer_id : customerid,
      user_code : usercode,
      user_name : username,
      password, email, mobile, telephone, website,
      country_id : countryid
    })
    return axios
      .post('/api/user/register', { 
        customer_id : customerid,
        user_code : usercode,
        user_name : username,
        password, email, mobile, telephone, website,
        country_id : countryid
      })
      .then((response) => {
        const user = response.data
        return user
      })
  },

  // register the user
  sendEmailCode({ commit, dispatch, getters }, { email } = {}) {
    // if (getters.loggedIn) return dispatch('validate')
    console.log(email)
    return axios
      .post('/api/user/sendEmailCode?email=' + email)
      .then((response) => {
        const message = response.data
        return message
      })
      .catch((error) => {
        return error
      })
  },

   // register the user
   resetPassword({ commit, dispatch, getters }, { email, code, newPassword } = {}) {
    // if (getters.loggedIn) return dispatch('validate')
    return axios
      .post('/api/user/changePwd', { email, code, newPassword })
      .then((response) => {
        const message = response.data
        return message
      })
      .catch((error) => {
        return error
      })
  },

  // Validates the current user's token and refreshes it
  // with new data from the API.
  validate({ commit, state }) {
    // if (!state.currentUser) return Promise.resolve(null)

    // return axios
    //   .get('/api/user/session')
    //   .then((response) => {
    //     const user = response.data
    //     commit('SET_CURRENT_USER', user)
    //     return user
    //   })
    //   .catch((error) => {
    //     if (error.response && error.response.status === 401) {
    //       commit('SET_CURRENT_USER', null)
    //     }
    //     return null
    //   })
    if (!state.currentUser) return Promise.resolve(null)
    var user = {
      username: 'yangqun',
      customercode:'yq_customer'
    }
    commit('SET_CURRENT_USER', user)
    return user;
  },
}

// ===
// Private helpers
// ===

function getSavedState(key) {
  return JSON.parse(window.localStorage.getItem(key))
}

function saveState(key, state) {
  window.localStorage.setItem(key, JSON.stringify(state))
}

function setDefaultAuthHeaders(state) {
  axios.defaults.headers.common.Authorization = state.currentUser
    ? state.currentUser.token
    : ''
}
