<script>
import Layout from '@layouts/default'
import { authMethods } from '@state/helpers'
import appConfig from '@src/app.config'
import { mapMutations } from 'vuex'
/**
 * Login component
 */
export default {
  page: {
    title: 'Log in',
    meta: [{ name: 'description', content: `Log in to ${appConfig.title}` }],
  },
  components: { Layout },
  data() {
    return {
      username: 'yangqun',
      password: '123',
      customercode:'yq_customer',
      authError: null,
      tryingToLogIn: false,
      isAuthError: false,
    }
  },
  computed: {
    placeholders() {
      return process.env.NODE_ENV === 'production'
        ? {}
        : {
            username: 'Use "admin" to log in with the mock API',
            password: 'Use "password" to log in with the mock API',
          }
    },
  },
  methods: {
    ...mapMutations(['changeLogin']),
    ...authMethods,
    // Try to log the user in with the username
    // and password they provided.
    tryToLogIn() {
      this.tryingToLogIn = true
      // Reset the authError if it existed.
      this.authError = null
      return this.logIn({
        username: this.username,
        customercode: this.customercode,
        password: this.password
      })
        .then((token) => {
          this.userToken  = 'Bearer ' + token.responseData.token;
          this.changeLogin({ Authorization: this.userToken });
          this.tryingToLogIn = false
          this.isAuthError = false
          // Redirect to the originally requested page, or to the home page
          this.$router.push(this.$route.query.redirectFrom || { name: 'Devices' })
        })
        .catch((error) => {          
          this.tryingToLogIn = false
          this.authError = error ? error.responseMessage : ''
          this.isAuthError = true
        })
    },
  },
}
</script>

<template>
  <Layout>
    <div class="row justify-content-center">
      <div class="col-lg-5">
        <div class="card">
          <!-- Logo -->
          <div class="card-header pt-4 pb-4 text-center bg-primary">
            <router-link to="/">
              <span>
                <img src="@assets/images/logo.png" alt height="18" />
              </span>
            </router-link>
          </div>
          <div class="card-body p-4">
            <div class="text-center w-75 m-auto">
              <h4 class="text-dark-50 text-center mt-0 font-weight-bold">Sign In</h4>
              <p
                class="text-muted mb-4"
              >Enter your email address and password to access admin panel.</p>
            </div>

            <b-alert v-model="isAuthError" variant="danger" dismissible>{{authError}}</b-alert>

            <b-form @submit.prevent="tryToLogIn">
              <b-form-group id="input-group-1" label="Username" label-for="input-1">
                <b-form-input
                  id="input-1"
                  v-model="username"
                  type="text"
                  required
                  placeholder="Enter username"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-3">
                <label>Customer_Code</label>
                <b-form-input
                  id="input-2"
                  v-model="customercode"
                  type="text"
                  required
                  placeholder="Enter customer_code"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-2">
                <router-link to="/forget-password" class="text-muted float-right">
                  <small>Forgot your password?</small>
                </router-link>
                <label>Password</label>
                <b-form-input
                  id="input-2"
                  v-model="password"
                  type="password"
                  required
                  placeholder="Enter password"
                ></b-form-input>
              </b-form-group>

              <div class="form-group mb-0 text-center">
                <b-button type="submit" variant="primary">Log In</b-button>
              </div>
            </b-form>
          </div>
          <!-- end card-body -->
        </div>
        <!-- end card -->

        <div class="row mt-3">
          <div class="col-12 text-center">
            <p>
              <router-link
                tag="a"
                to="/forget-password"
                class="text-muted ml-1"
              >Don't have an account?</router-link>
              <router-link tag="a" to="/register" class="text-muted ml-2">
                <b>Sign Up</b>
              </router-link>
            </p>
          </div>
          <!-- end col -->
        </div>
        <!-- end row -->
      </div>
      <!-- end col -->
    </div>
    <!-- end row -->
  </Layout>
</template>

<style lang="scss" module></style>
