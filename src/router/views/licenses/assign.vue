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
    title: '激活与分配设备',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PageHeader,
    Vuetable,
    VuetablePagination,
    VuetablePaginationInfo, },
  data() {
    return {
      devicesList: [],
    //   device:{},
      licensesList:[],
      deviceId: null, 
      licenseId: null,
      isEdit:false,
      isAlter:false,
      isError:false,
      isAssignAlter:false,
      message:'',
      error:'',
      title: '激活与分配设备',
      items: [
        {
          text: '首页',
          href: '/',
        },
        {
          text: '我的授权码',
          href: '/licenses',
        },
        {
          text: '激活与分配设备',
          active: true,
        },
        
      ],
      data: [],
      perPage: 10,
      fields: [
        { name: '__slot:deviceMac', title: 'Mac地址', sortField: 'deviceMac' },
        { name: 'deviceMac', title: 'Mac地址', sortField: 'deviceMac' },
        { name: 'deviceModelNo', title: '型号', sortField: 'quantity' },
        { name: 'isAssign', title: '是否分配Licence', sortField: 'isAssign' },
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
        this.$http.get('/api/Devices/UnassignedList')
            .then((response) => {
              let list = response.data.responseData
              list.forEach((item, index) => {
              let deviceData = {};
              deviceData.index = ++index
              deviceData.deviceId = item.device_id
              deviceData.deviceMac = item.device_mac
              deviceData.deviceModelNo = item.device_model_no
              deviceData.isAssign = 'N'
              this.devicesList.push(deviceData)
            })
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

        <div class="card">
          <div class="card-body">
            
            <!-- Table -->
            <div class="table-responsive">
              <vuetable
                ref="vuetable"
                :per-page="perPage"
                :fields="fields"
                :api-mode="false"
                :data-manager="dataManager"
                pagination-path="pagination"
                class="table table-centered datatables"
                @vuetable:pagination-data="onPaginationData"
              >                
              </vuetable>
            </div>
            <!-- end table -->

            <!-- pagination -->
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
            <h3>激活与分配设备</h3>
          </div>
          
          <form class="pl-3 pr-3" action="#">
            <b-alert v-model="isAssignAlter" show=2 variant="danger">
            <i class="dripicons-wrong mr-2"></i>{{ message }}
          </b-alert>
              <div class="table-responsive">
              <table class="table table-centered mb-0">
                <thead class="thead-light">
                  <tr>
                    <th style="width: 20px;">
                      <div class="custom-control custom-checkbox">
                        全选
                      </div>
                    </th>
                    <th>Mac地址</th>
                    <th>型号</th>
                    <th>是否分配License</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(device, index) of devicesList" :key="device.deviceId">
                    <td>
                      <div class="custom-control custom-radio">
                        <input
                          :id="`customCheck${index}`"
                          v-model="deviceId"
                          type="radio"
                          name="customRadio"
                          class="custom-control-input"
                          :value="device.deviceId"
                        />
                        <label class="custom-control-label" :for="`customCheck${index}`">&nbsp;</label>
                      </div>
                    </td>
                    <td>{{ device.deviceMac }}</td>
                    <td>{{ device.deviceModelNo }}</td>
                    <td>N</td>
                  </tr>
                </tbody>
              </table>
              <div class="text-center mt-2 mb-4" >
                <span>暂时没有设备</span>
              </div>
            </div>

            <b-form-group class="text-center" >
              <b-button type="button" variant="primary" >分配</b-button>
            </b-form-group>
          </form>
        </b-modal>

      </div>
    </div>
  </Layout>
</template>