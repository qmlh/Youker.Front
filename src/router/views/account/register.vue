<script>
import Layout from '@layouts/default'
import { authMethods } from '@state/helpers'
import appConfig from '@src/app.config'

/**
 * Register component
 */
export default {
  page: {
    title: 'Register',
    meta: [{ name: 'description', content: `Register to ${appConfig.title}` }],
  },
  components: { Layout },
  data() {
    return {
      customerList:[],
      coutryList:[],
      customerid: '',
      usercode: '',
      username: '',
      password: '',
      email: '',
      mobile: '',
      telephone: '',
      website: '',
      countryid: '',
      regError: null,
      tryingToRegister: false,
      isRegisterError: false,
    }
  },
  computed: {},
  created() {
    this.init()
  },
  methods: {
    ...authMethods,
    init(){
      this.customerList = []
      this.coutryList = []
      this.$http.get('/api/User/RegisterInit')
            .then((response) => {
              let cuslist = response.data.responseData.customerList
              let coulist = response.data.responseData.coutryList
            cuslist.forEach((item, index) => {
              let cusData = {};
              cusData.value = item.customer_id
              cusData.text = item.customer_name
              this.customerList.push(cusData)
            })
            coulist.forEach((item, index) => {
              let couData = {};
              couData.value = item.country_id
              couData.text = item.name
              this.coutryList.push(couData)
            })
            this.customerid = this.customerList[0].value
            this.countryid = this.coutryList[0].value

            }).catch((error) =>{
                console.log('error');
                console.log(error);
            })
    },
    // Try to register the user in with the email, fullname
    // and password they provided.
    tryToRegisterIn() {
      this.tryingToRegister = true
      // Reset the regError if it existed.
      this.regError = null
      return this.register({
        customerid: this.customerid,
        usercode: this.usercode,
        username: this.username,
        password: this.password,
        email: this.email,
        mobile: this.mobile,
        telephone: this.telephone,
        website: this.website,
        countryid: this.countryid
      })
        .then((token) => {
          this.tryingToRegister = false
          this.isRegisterError = false
          // Redirect to the originally requested page, or to the confirm-account page
          
          this.$router.push( { name: 'login' } )
        })
        .catch((error) => {
          this.tryingToRegister = false
          this.regError = error.response ? error.responseMessage : ''
          this.isRegisterError = true
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
          <!-- Logo-->
          <div class="card-header pt-4 pb-4 text-center bg-primary">
            <router-link to="/">
              <span>
                <img src="@assets/images/logo.png" alt height="18" />
              </span>
            </router-link>
          </div>
          <div class="card-body p-4">
            <div class="text-center w-75 m-auto">
              <h4 class="text-dark-50 text-center mt-0 font-weight-bold">Free Sign Up</h4>
              <p
                class="text-muted mb-4"
              >Don't have an account? Create your account, it takes less than a minute</p>
            </div>

            <b-alert v-model="isRegisterError" variant="danger" dismissible>{{regError}}</b-alert>

            <b-form @submit.prevent="tryToRegisterIn">

              <b-form-group id="customer-group" label="Customer" label-for="customer">
                <b-form-select
                  id="customer"
                  v-model="customerid"
                  :options="customerList"
                >
                </b-form-select>
              </b-form-group>

              <b-form-group id="usercode-group" label="User Code" label-for="usercode">
                <b-form-input
                  id="usercode"
                  v-model="usercode"
                  type="text"
                  required
                  placeholder="Enter your User Code"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="username-group" label="User Name" label-for="username">
                <b-form-input
                  id="username"
                  v-model="username"
                  type="text"
                  required
                  placeholder="Enter your User Name"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="password-group" label="Password" label-for="password">
                <b-form-input
                  id="password"
                  v-model="password"
                  type="password"
                  required
                  placeholder="Enter your Password"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="email-group" label="Email address" label-for="email">
                <b-form-input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                ></b-form-input>
              </b-form-group>
              
              <b-form-group id="mobile-group" label="Mobile" label-for="mobile">
                <b-form-input
                  id="mobile"
                  v-model="mobile"
                  type="text"
                  required
                  placeholder="Enter your Mobile"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="telephone-group" label="Telephone" label-for="telephone">
                <b-form-input
                  id="telephone"
                  v-model="telephone"
                  type="text"
                  required
                  placeholder="Enter your Telephone"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="website-group" label="Website" label-for="website">
                <b-form-input
                  id="website"
                  v-model="website"
                  type="text"
                  placeholder="Enter your Website"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="language-group" label="Language" label-for="language">
                <b-form-select
                  id="language"
                  v-model="countryid"
                  :options="coutryList"
                >
                </b-form-select>
              </b-form-group>

              <div class="form-group mb-0 text-center">
                <b-button type="submit" variant="primary">Sign Up</b-button>
              </div>
            </b-form>
          </div>
          <!-- end card-body -->
        </div>
        <!-- end card -->

        <div class="row mt-3">
          <div class="col-12 text-center">
            <p class="text-muted">
              Already have account?
              <router-link tag="a" to="/login" class="text-muted ml-1">
                <b>Log In</b>
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
