<script>

import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePagination from 'vuetable-2/src/components/VuetablePagination'
import VuetablePaginationInfo from 'vuetable-2/src/components/VuetablePaginationInfo'
import _ from 'lodash'

import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'

/**
 * Orders component
 */
export default {
  page: {
    title: '我的设备',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PageHeader,
    Vuetable,
    VuetablePagination,
    VuetablePaginationInfo, },
  data() {
    return {
      devicesList: [],
      device:{},
      licensesList:[],
      deviceId: null, 
      licenseId: null,
      isEdit:false,
      isAlter:false,
      isError:false,
      isAssignAlter:false,
      isHasLicense:true,
      message:'',
      error:'',
      title: '我的设备',
      items: [
        {
          text: '首页',
          href: '/',
        },
        {
          text: '我的设备',
          active: true,
        },
      ],
      data: [],
      perPage: 10,
      fields: [
        { name: 'index', title: '序号', sortField: 'index' },
        { name: 'device_mac', title: 'Mac地址', sortField: 'device_mac' },
        { name: 'device_model_no', title: '型号', sortField: 'device_model_no' },
        { name: 'device_key', title: 'Default Key', sortField: 'device_key' },
        { name: 'device_user_password', title: 'Password', sortField: 'device_user_password' },
        { name: 'device_subdomain', title: '域名前缀（subdomain）', sortField: 'device_subdomain' },
        { name: 'device_license_key', title: '设备license', sortField: 'device_license_key' },
        { name: '__slot:device_license_is_active', title: '是否激活', sortField: 'device_license_is_active' },
        { name: 'create_time', title: '激活时间', sortField: 'create_time' },
        { name: 'update_time', title: '授权结束时间', sortField: 'update_time' },
        { name: '__slot:actions', title: '操作' },
      ],
      css: {
        pagination: {
          activeClass: 'btn-primary text-white',
          pageClass: 'btn btn-rounded',
          linkClass: 'btn',
          icons: {
            prev: '',
            next: '',
          },
        },
      },
    }
  },
  watch: {
    data(newVal, oldVal) {
      this.$refs.vuetable.refresh()
    },
    isAlter(){
      setTimeout(()=> { this.isAlter = false } , 2000)
    },
    isAssignAlter(){
      setTimeout(()=> { this.isAssignAlter = false } , 2000)
    },
    isError(){
      setTimeout(()=> { this.isError = false } , 2000)
    }
    
  },
  created(){
      this.init()
  },
  mounted() {
    this.data = this.devicesList
  },
  methods:{
      init(){
        this.devicesList = []
        this.$http.get('/api/Devices/List')
            .then((response) => {
              let list = response.data.responseData.list
              list.forEach((item, index) => {
              let devicesData = {};
              devicesData.index = ++index
              devicesData.device_id = item.device_id
              devicesData.device_mac = item.device_mac
              devicesData.device_model_no = item.device_model_no
              devicesData.device_key = item.device_key
              devicesData.device_license_is_active = item.device_license_is_active
              devicesData.device_user_password = item.device_user_password
              devicesData.device_subdomain = item.device_subdomain
              devicesData.device_license_key = item.device_license_key
              devicesData.create_time = item.create_time
              devicesData.update_time = item.update_time
              this.devicesList.push(devicesData)
            })
            this.data = this.devicesList
            console.log(this.devicesList)
            }).catch((error) =>{
                console.log('error');
                console.log(error);
            })
      },
      edit(id){
        this.deviceId = id
        this.$http
        .get('/api/Devices/Info?device_id=' + id)
        .then(response => {
            this.device = response.data.responseData;
            this.isEdit = true
        })
        .catch(error => {
            console.log(error)
            this.isEdit = false
        })
      },
      deleteDevice(id){
        this.$http
        .delete('/api/Devices/Delete?device_id=' + id)
        .then(response => {
            if(id === this.device.device_id)
            {
              this.isEdit = false
              // this.device = null
            }
            this.isAlter = true
            this.message = '删除成功'
            this.init()
        })
        .catch(error => {
            console.log(error)
            this.isEdit = false
        })
      },
      getLicenses(){
        this.licensesList = []
        this.$http.get('/api/Licenses/List')
            .then((response) => {
              let list = response.data.responseData
              list.forEach((item, index) => {
              let licensesData = {};
              licensesData.index = ++index
              licensesData.license_id = item.license_id
              licensesData.license_key = item.license_key
              licensesData.quantity = item.quantity - item.quantity_used
              this.licensesList.push(licensesData)
            })
              if(list.length > 0){
                this.isHasLicense = true
              }
              else{
                this.isHasLicense = false
              }
            }).catch((error) =>{
                console.log('error');
                console.log(error);
            })
      },
      assign(){
        let curdeviceId = this.deviceId
        if(this.deviceId === null || this.licenseId === null){
          this.isAssignAlter = true
          this.message = '请选择授权码'
          return false
        }
        this.$http.put('/api/Licenses/Assign',{ device_id : this.deviceId, license_id : this.licenseId})
            .then((response) => {
              this.$refs.modalAssign.hide()
              this.isAlter = true
              this.message = '分配成功'
              this.edit(curdeviceId)
            }).catch((error) =>{
                console.log('error');
                console.log(error);
            })
      },
      changePwd(){
        let curdeviceId = this.deviceId
        if(this.device.device_user_password === null || this.device.device_user_password.length === 0){
          this.isError = true
          this.error = '请输入密码'
          return false
        }
        this.$http.put('/api/Devices/EditPwd',{ device_id : this.deviceId, device_user_password : this.device.device_user_password})
            .then((response) => {
              this.isAlter = true
              this.message = '密码修改成功'
              this.edit(curdeviceId)
            }).catch((error) =>{
                console.log('error');
                console.log(error);
            })
      },
      activate(){
        let curdeviceId = this.deviceId
        let deviceLicenseId = this.device.device_license_id
        this.$http.put('/api/Devices/ActivateDevLic?device_license_id=' + deviceLicenseId)
            .then((response) => {
              this.isAlter = true
              this.message = '激活成功'
              this.edit(curdeviceId)
            }).catch((error) =>{
                console.log('error');
                console.log(error);
            })
      },
      /**
     * Pagination page change
     */
    onChangePage(page) {
      this.$refs.vuetable.changePage(page)
    },
    /**
     * Pagination info and pagination show
     */
    onPaginationData(devicesList) {
      this.$refs.pagination.setPaginationData(devicesList)
      this.$refs.paginationInfo.setPaginationData(devicesList)
    },

    /**
     * Manage data sorting and show pagination
     */
    dataManager(sortOrder, pagination) {
      if (this.data.length < 1) return
      let local = this.data

      // sortOrder can be empty, so we have to check for that as well
      if (sortOrder.length > 0) {
        local = _.orderBy(local, sortOrder[0].sortField, sortOrder[0].direction)
      }
      pagination = this.$refs.vuetable.makePagination(
        local.length,
        this.perPage
      )
      let from = pagination.from - 1
      let to = from + this.perPage

      return {
        pagination: pagination,
        data: _.slice(local, from, to),
      }
    },
  }
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <b-alert v-model="isAlter" show=2 variant="success">
        <i class="dripicons-checkmark mr-2"></i>{{ message }}
    </b-alert>
    <b-alert v-model="isError" variant="danger">
      <i class="dripicons-wrong mr-2"></i>{{ error }}</b-alert>
    <div class="row">
      <div class="col-12">

        <div v-show="isEdit" class="card">
          <div class="card-body">
            <div class="table-responsive mt-1 mb-0">
              <table class="table table-bordered table-centered">
                <thead class="thead-light">
                  <tr>
                    <th>设备详情操作</th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Mac地址：{{ device.device_mac }}</td>
                    <td>型号：{{ device.device_model_no }}</td>
                    <td>设备License：{{ device.device_license_key }} <b-button v-show="device.device_license_key === null" v-b-modal.modal-assign class="btn btn-warning btn-sm" style="margin-left:15px;" @click="getLicenses">获取设备License</b-button> </td>
                    <td>激活License：
                      <span v-show="device.device_license_key === null">未分配</span>
                      <span v-show="device.device_license_is_active === 1">已激活</span>
                      <button v-show="device.device_license_key !== null && device.device_license_is_active === 0" type="button" class="btn btn-success btn-sm" style="margin-left:15px;" @click="activate">激活</button> 
                    </td>
                  </tr>
                  <tr>
                    <td>Default Key：{{ device.device_key }}</td>
                    <td><form class="form-inline">Psssword：<label for="inputPassword2" class="sr-only">Password</label>
                         <input id="inputChangePwd" v-model="device.device_user_password" type="text" class="form-control"  placeholder="Password">
                         <b-button variant="info" class="ml-2" @click="changePwd" >修改</b-button>
                    </form></td>
                    <td>激活时间：{{ device.create_time }}</td>
                    <td>授权结束时间：{{ device.update_time }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">

            <div class="row mb-2">
              <div class="col-lg-10">
                <form class="form-inline">
                  <div class="form-group mb-2 mr-sm-2">
                    <label for="inputMac" class="sr-only">Mac</label>
                    <input
                      id="inputMac"
                      type="search"
                      class="form-control"
                      placeholder="Mac..."
                    />
                  </div>
                  <div class="form-group mb-2 mr-sm-2">
                    <label for="inputDefaultKey" class="sr-only">Default Key</label>
                    <input
                      id="inputDefaultKey"
                      type="search"
                      class="form-control"
                      placeholder="Default Key..."
                    />
                  </div>
                  <div class="form-group mb-2 mr-sm-2">
                    <label for="inputPassword" class="sr-only">Password</label>
                    <input
                      id="inputPassword"
                      type="search"
                      class="form-control"
                      placeholder="Password..."
                    />
                  </div>
                  <div class="form-group mb-2 mr-sm-2">
                    <label for="inputDomain" class="sr-only">域名前缀</label>
                    <input
                      id="inputDomain"
                      type="search"
                      class="form-control"
                      placeholder="Domain..."
                    />
                  </div>
                  <div class="form-group mx-sm-3 mb-2">
                    <label for="status-select" class="mr-2">是否激活</label>
                    <select id="status-select" class="custom-select">
                      <option selected>全部</option>
                      <option value="1">已激活</option>
                      <option value="2">未激活</option>
                    </select>
                  </div>
                </form>
              </div>
              <div class="col-lg-2">
                <div class="text-lg-right">
                  <button type="button" class="btn btn-primary ml-1"><i class="mdi dripicons-search mr-1"></i><span>筛选</span></button>
                </div>
              </div>
              <!-- end col-->
            </div>
            
            <!-- Table -->
            <div class="table-responsive">
              <vuetable
                ref="vuetable"
                :per-page="perPage"
                :fields="fields"
                :api-mode="false"
                :data-manager="dataManager"
                pagination-path="pagination"
                class="table table-centered datatables table-hover"
                @vuetable:pagination-data="onPaginationData"
              >

               <template slot="device_license_is_active" slot-scope="props">
                  <span
                    class="badge"
                    :class="{
                      'badge-success-lighten': props.rowData.device_license_is_active === 1,

                      'badge-danger-lighten': props.rowData.device_license_is_active === 0 }"
                  >{{ props.rowData.device_license_is_active === 1 ? 'Y' : 'N' }}</span>
                </template>

                <template slot="actions" slot-scope="props">
                  <div class="table-button-container">
                    <a href="javascript:void(0);" class="action-icon" @click.prevent="edit(props.rowData.device_id)">
                      <i class="mdi mdi-square-edit-outline"></i>
                    </a>
                    <a v-b-modal="props.rowData.device_id.toString()" href="javascript:void(0);" variant="primary" class="action-icon">
                      <i class="mdi mdi-delete"></i>
                    </a>
                    <b-modal :id="props.rowData.device_id.toString()" title="提示" title-class="font-18" @ok="deleteDevice(props.rowData.device_id)">
                      <p>是否删除该设备？</p>
                    </b-modal>
                  </div>
                </template>

              </vuetable>
            </div>
            <!-- end table -->

            <div class="row">
              <div class="col-sm-12 col-md-5">
                <vuetable-pagination-info ref="paginationInfo" class="font-weight-semibold"></vuetable-pagination-info>
              </div>
              <div class="col-sm-12 col-md-7">
                <vuetable-pagination
                  ref="pagination"
                  :css="css.pagination"
                  class="pagination pagination-rounded justify-content-end"
                  @vuetable-pagination:change-page="onChangePage"
                ></vuetable-pagination>
              </div>
            </div>
            <!-- end pagination -->
          </div>
        </div>

        <!-- licenses modal -->
        <b-modal id="modal-assign" ref="modalAssign"  size="lg" hide-header hide-footer >
          <div class="text-center mt-2 mb-4">
            <h3>分配授权码</h3>
          </div>
          
          <form class="pl-3 pr-3" action="#">
            <b-alert v-model="isAssignAlter" show=2 variant="danger">
            <i class="dripicons-wrong mr-2"></i>{{ message }}
          </b-alert>
              <div class="table-responsive">
              <table v-show="isHasLicense" class="table table-centered mb-0">
                <thead class="thead-light">
                  <tr>
                    <th style="width: 20px;">
                      <div class="custom-control custom-checkbox">
                        
                      </div>
                    </th>
                    <th>序号</th>
                    <th>授权码</th>
                    <th>可激活数量</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(licenses, index) of licensesList" :key="licenses.license_id">
                    <td>
                      <div class="custom-control custom-radio">
                        <input
                          :id="`customCheck${index}`"
                          v-model="licenseId"
                          type="radio"
                          name="customRadio"
                          class="custom-control-input"
                          :value="licenses.license_id"
                        />
                        <label class="custom-control-label" :for="`customCheck${index}`">&nbsp;</label>
                      </div>
                    </td>
                    <td>{{ licenses.index }}</td>
                    <td>{{ licenses.license_key }}</td>
                    <td>{{ licenses.quantity }}</td>
                  </tr>
                </tbody>
              </table>
              <div v-show="!isHasLicense" class="text-center mt-2 mb-4" >
                <span>暂时没有激活码</span>
              </div>
            </div>

            <b-form-group v-show="isHasLicense" class="text-center" >
              <b-button type="button" variant="primary" @click="assign">分配</b-button>
            </b-form-group>
          </form>
        </b-modal>

      </div>
    </div>
  </Layout>
</template>