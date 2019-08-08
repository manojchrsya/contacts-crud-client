<template>
  <v-app id="login" class="primary">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <v-form v-if="signUpForm" >
                  <v-text-field  name="username" label="User Name" type="text"
                    :state="!$v.model.username.$error"
                    :error-messages="usernameErrors"
                    v-model="model.username"></v-text-field>
                  <v-text-field append-icon="password"  name="password" label="Password" type="password"
                    :state="!$v.model.password.$error"
                    :error-messages="passwordErrors"
                    v-model="model.password"></v-text-field>
                  <v-text-field append-icon="password"  name="confirmPassword" label="Confirm Password" type="password" v-model="model.confirmPassword"></v-text-field>
                </v-form>
                <v-form v-else>
                  <v-text-field name="username"
                    :state="!$v.model.username.$error"
                    :error-messages="usernameErrors"
                    label="User Name" type="text"
                    v-model="model.username" />
                  <v-text-field name="password" label="Password" type="password"
                    :state="!$v.model.password.$error"
                    :error-messages="passwordErrors"
                    v-model="model.password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn block color="primary" @click="login"  :loading="loading">Login</v-btn>
                <v-btn block color="primary" @click="signUp" :loading="loading">Sign Up</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import {
  required,
} from 'vuelidate/lib/validators';

export default {
  layout: 'clean',
  data: () => ({
    loading: false,
    signUpForm: false,
    model: {
      username: '',
      password: '',
      confirmPassword: '',
    }
  }),
  validations: {
    model: {
      username: {
        required,
      },
      password: {
        required,
      },
    },
  },
  computed: {
    usernameErrors() {
      const errors = [];
      if (!this.$v.model.username.$dirty) return errors;
      if (!this.$v.model.username.required) errors.push('Required.');
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.model.password.$dirty) return errors;
      if (!this.$v.model.password.required) errors.push('Required.');
      return errors;
    },
  },
  methods: {
    async login () {
      if (this.signUpForm) {
        this.model.username = '';
        this.model.password = '';
        this.signUpForm = false; return true;
      }

      try {
        const isValid = await this.validate();
        if (isValid) {
          await this.$auth.loginWith('local', {
            data: {
              username: this.model.username,
              password: this.model.password
            }
          });
          window.location.reload(true);
        }

      } catch (error) {
        this.loading = false;
        window.getApp.$emit('SHOW_ERROR_MESSAGE', { message: error.response.data.error.message });
      }
    },
    async signUp () {
      if (!this.signUpForm) {
        this.model.username = '';
        this.model.password = '';
        this.model.confirmPassword = '';
        this.signUpForm = true; return true;
      }
      try {
        const isValid = await this.validate();
        if (isValid) {
          const response = await this.$axios.$post('Customers/signup', {
            username: this.model.username,
            password: this.model.password,
            confirmPassword: this.model.confirmPassword,
          });
          window.getApp.$emit('SHOW_SUCCESS_MESSAGE', { message: 'Customer registered successfully.' });
          setTimeout(() => {
            window.location.reload(true);
          }, 2000);
        }
      } catch (error) {
        window.getApp.$emit('SHOW_ERROR_MESSAGE', { message: error.response.data.error.message });
      }
    },
    async validate() {
      this.$v.model.$touch();
      return !this.$v.model.$error;
    },
  }
}
</script>
<style scoped lang="css">
  #login {
    height: 50%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    z-index: 0;
  }
</style>
