<template>
  <div>
    <v-container
      fluid
      grid-list-xl>
      <v-layout
        row
        wrap />
      <v-flex lg12>
        <v-card>
          <v-toolbar
            card
            color="white">
            <v-text-field
              flat
              solo
              prepend-icon="search"
              placeholder="Type something"
              v-model="search"
              hide-details
            />
            <v-btn
              color="primary"
              dark
              @click="editedItem = {}; showCustomer = true;"
              class="mb-2"
              >Add New Contact</v-btn>
          </v-toolbar>
          <v-divider/>
          <v-card-text class="pa-0">
            <v-data-table
              :pagination.sync="pagination"
              :headers="headers"
              :items="contacts"
              hide-default-footer
              disable-pagination
              class="elevation-1"
            >
              <template
                slot="items"
                slot-scope="props">
                <td>{{ props.item.firstname ? props.item.firstname : '-' }}</td>
                <td>{{ props.item.middlename ? _.capitalize(props.item.middlename) : '-' }}</td>
                <td>{{ props.item.lastname ? _.capitalize(props.item.lastname) : '-' }}</td>
                <td>{{ props.item.mobile ? _.capitalize(props.item.mobile) : '-' }}</td>
                <td>{{ props.item.createdOn ? $moment(props.item.createdOn).format('MMMM Do YYYY, h:mm:ss a') : '-' }}</td>
                <td>{{ props.item.updatedOn ? $moment(props.item.updatedOn).format('MMMM Do YYYY, h:mm:ss a') : '-' }}</td>
                <td>
                  <v-tooltip
                    top>
                    <v-btn
                      flat
                      icon
                      slot="activator"
                      @click="editContact(props.item)"
                      color="grey">
                      <v-icon>edit</v-icon>
                    </v-btn>
                    <span>Edit Contact</span>
                  </v-tooltip>
                </td>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-dialog
        v-if="showCustomer"
        v-model="showCustomer"
        max-width="75%"
        @click:outside="closeDialog"
        :scrollable="true">
          <v-card>
            <v-card-text>
              <v-container fluid grid-list-sm>
                <v-layout wrap v-if="editedItem.id">
                  <v-flex xs6 sm4>
                    <img
                      height="200"
                      width="200"
                      :src=getProfile />
                  </v-flex>
                  <v-flex
                    lg4
                    sm12>
                    <v-card
                      color="primary"
                      dark>
                      <v-card-title>
                        <div class="layout row ma-0">
                          <div class="subheading">Views</div>
                        </div>
                      </v-card-title>
                      <v-card-media>
                        <e-chart
                          ref="chart"
                          :path-option="[
                            ['dataset.source', previousVisit()],
                            ['grid.bottom', '10%'],
                            ['grid.top', '5%'],
                            ['xAxis.show', true],
                            ['yAxis.show', true],
                            ['series[0].type', 'bar'],
                            ['series[0].barGap', '-100%'],
                            ['series[0].itemStyle.normal.color', '#fff'],
                            ['series[0].barWidth', '50%'],
                            ['series[1].barWidth', '50%'],
                            ['series[1].type', 'bar'],
                            ['series[1].itemStyle.normal.color', 'rgba(0,0,0,0.1)'],
                          ]"
                          height="315px"
                          width="100%"
                        />
                      </v-card-media>
                    </v-card>
                  </v-flex>
                  <v-flex>
                    <template slot="activator">
                      <input
                        type="file"
                        ref="file"
                        @change="uploadFile(this)"
                      >
                    </template>
                  </v-flex>
                  <v-flex
                    shrink
                    class="pa-0 ma-0">
                    <v-btn
                      color="primary"
                      @click="openFileDialoge()">
                      Upload Profile Pic
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      v-model="editedItem.firstname"
                      :state="!$v.editedItem.firstname.$error"
                      :error-messages="firstNameErrors"
                      label="First name" />
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.middlename" label="Middle name"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      v-model="editedItem.lastname"
                      :state="!$v.editedItem.lastname.$error"
                      :error-messages="lastNameErrors"
                      label="Last name"/>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      v-model="editedItem.mobile"
                      :state="!$v.editedItem.mobile.$error"
                      :error-messages="mobileErrors"
                      label="Mobile"/>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      v-model="editedItem.email"
                      :state="!$v.editedItem.email.$error"
                      :error-messages="emailErrors"
                      label="Email">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.landline" label="Land line"></v-text-field>
                  </v-flex>
                   <v-flex xs12 sm6 md6>
                    <v-text-field v-model="editedItem.notes" label="Notes"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-toolbar-title>Todays Total View: {{ getViewsCount() }}</v-toolbar-title>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="closeDialog">Cancel</v-btn>
              <v-btn color="primary" text @click="saveDetails">Save</v-btn>
            </v-card-actions>
          </v-card>
    </v-dialog>
    </v-container>
  </div>
</template>

<script>
import _ from 'lodash';
import EChart from '@/components/chart/echart';

import {
  required,
  numeric,
  minLength,
  maxLength,
  email,
} from 'vuelidate/lib/validators';
const mobileRegex = /^[6789]\d{9}$/;

export default {
  components: {
    EChart,
  },
  data: () => ({
    search: '',
    pagination: {
      rowsPerPage: 10,
      page: 1,
    },
    headers: [
      {
        text: 'First name',
        value: 'firstname',
      },
      {
        text: 'Middle name',
        value: 'middlename',
        sortable: false,
      },
      {
        text: 'Last name',
        value: 'lastname',
        sortable: false,
      },
      {
        text: 'Mobile',
        value: 'mobile',
        sortable: false,
      },
      {
        text: 'Created On',
        value: 'updatedOn',
      },
      {
        text: 'Updated On',
        value: 'updatedOn',
        sortable: false,
      },
      {
        text: 'Action',
        sortable: false,
      }
    ],
    contacts: [],
    showCustomer: false,
    editedItem: {},
    profile: {},
  }),
  watch: {
    search:
      _.debounce(function () {
        this.loadContacts();
      }, 300),
    showCustomer(val){
      if (!val) {
        window.location.reload(true);
      }
    }
  },
  computed: {
    _() {
      return _;
    },
    getProfile() {
      return this.profile ? this.profile.url : '';
    },
    firstNameErrors() {
      const errors = [];
      if (!this.$v.editedItem.firstname.$dirty) return errors;
      if (!this.$v.editedItem.firstname.required) errors.push('Required.');
      return errors;
    },
    lastNameErrors() {
      const errors = [];
      if (!this.$v.editedItem.lastname.$dirty) return errors;
      if (!this.$v.editedItem.lastname.required) errors.push('Required.');
      return errors;
    },
    mobileErrors() {
      const errors = [];
      if (!this.$v.editedItem.mobile.$dirty) return errors;
      if (!this.$v.editedItem.mobile.required) errors.push('Required.');
      if (!this.$v.editedItem.mobile.minLength || !this.$v.editedItem.mobile.maxLength) {
        errors.push('Invalid Mobile Number.');
      }
      if (!this.$v.editedItem.mobile.isValidMobileNumber) errors.push('Invalid Mobile.');
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.editedItem.email.$dirty) return errors;
      if (!this.$v.editedItem.email.email) errors.push('Invalid Email.');
      return errors;
    },
  },
  validations: {
    editedItem: {
      firstname: {
        required,
      },
      lastname: {
        required,
      },
      email: {
        email,
      },
      mobile: {
        required,
        numeric,
        minLength: minLength(10),
        maxLength: maxLength(10),
        isValidMobileNumber(value) {
          return value ? mobileRegex.test(value) : true;
        },
      },
    },
  },
  async asyncData({ app }) {
    try {
      const query = {
        include: [
          {
            relation: 'profile'
          },
          {
            relation: 'views',
            order: 'date desc',
            limit: 7,
          }
        ]
      };
      const contacts = await app.$axios.$get('Contacts', { headers: {filter: JSON.stringify(query)} });
      return { contacts };
    } catch (error) {
      return { contacts: [] };
    }
  },
  methods: {
    closeDialog() {
      this.showCustomer = false;
      window.location.reload(true);
    },
    async editContact(item) {
      this.showCustomer = true;
      this.editedItem = item;
      this.profile = item.profile || {}
      await this.$axios.post(`/Contacts/${this.editedItem.id}/updateView`);
    },
    getViewsCount(date) {
      const self = this;
      date = self.$moment(date).format('YYYY-MM-DD') || self.$moment().format('YYYY-MM-DD');
      const views = this.editedItem.views || [];
      const details = _.find(this.editedItem.views, function(view) {
        return self.$moment(view.date).format('YYYY-MM-DD') === date;
      }) || {};
      return details.value || 0;
    },
    async saveDetails() {
      try {
        let contactObj = {};
        const isValid = await this.validate();
        if (isValid) {
           if (this.editedItem.id) {
            contactObj = await this.$axios.patch(`Contacts/${this.editedItem.id}`, this.editedItem);
          } else {
            contactObj = await this.$axios.post(`Contacts`, this.editedItem);
          }
          window.getApp.$emit('SHOW_SUCCESS_MESSAGE', { message: 'Details saved successfully.' });
          setTimeout(() => {
            window.location.href = '/';
            this.showCustomer = false;
          }, 1000)
        }
      } catch (error) {
        window.getApp.$emit('SHOW_ERROR_MESSAGE', { message: 'Details saved unsuccessfully.' });
        this.showCustomer = false;
      }

    },
    getContacts() {
      const query = {
        where: {
          or: [
            {
              firstname: {
                regexp: `/${this.search}/i`,
              },
            },
            {
              mobile: {
                regexp: `/${this.search}/i`,
              },
            }
          ]
        },
        include: [
          {
            relation: 'profile'
          },
          {
            relation: 'views',
            order: 'date desc',
            limit: 7,
          }
        ]
      };
      return this.$axios.get('Contacts', { headers: {filter: JSON.stringify(query)} });
    },
    async loadContacts() {
      try {
        const contactObj = await this.getContacts();
        this.contacts = contactObj.data;
      } catch (error) {
        console.error(error);
      }
    },
    validations() {
      return new Promise((resolve) => {
        if (this.$v.editedItem.$error || !this.$v.editedItem.$pending) {
          resolve();
        }
        const poll = setInterval(() => {
          if (!this.$v.editedItem.$pending) {
            clearInterval(poll);
          }
          resolve();
        }, 200);
      });
    },
    async validate() {
      this.$v.editedItem.$touch();
      await this.validations();
      return !this.$v.editedItem.$error;
    },
    openFileDialoge(vehicleType) {
      this.$refs.file.click();
    },
    async uploadFile() {
      try {
        const formData = new FormData();
        formData.append('file', this.$refs.file.files[0]);
        // eslint-disable-next-line no-unused-vars
        const response = await this.$axios.post(`/Contacts/${this.editedItem.id}/uploadPicture`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        // reset the input type file
        this.$refs.file.type = 'text';
        this.$refs.file.type = 'file';
        this.profile = response.data;
      } catch(error) {
        window.getApp.$emit('SHOW_ERROR_MESSAGE', { message: error.message });
      }
    },
    previousVisit() {
      const viewsTillNow = [];
      for (let i = 7; i >= 0; i -= 1) {
        const date = this.$moment().subtract(i, 'days').format('YYYY-MM-DD');
        viewsTillNow.push({ date, count: this.getViewsCount(date), });
      }
      return viewsTillNow;
    },
  },
};
</script>

