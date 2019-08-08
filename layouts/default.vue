<template>
  <v-app>
    <v-navigation-drawer
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      fixed
      app
    >
      <v-list>
        <v-list-tile
          router
          :to="item.url"
          :key="i"
          v-for="(item, i) in navs"
          exact
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.name"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title @click="$auth.logout()">Logout</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer>
    <v-snackbar
      auto-height
      :timeout="3000"
      top
      right
      :color="snackbar.color"
      v-model="snackbar.show"
    >
      <div v-html="snackbar.text"/>
      <v-btn
        dark
        flat
        @click.native="snackbar.show = false"
        icon>
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import AppEvents from '@/util/event';

import { menus } from './menu.js';
  export default {
    data() {
      return {
        clipped: false,
        drawer: true,
        fixed: false,
        items: [
          { icon: 'apps', title: 'Welcome', to: '/' },
          { icon: 'bubble_chart', title: 'Inspire', to: '/inspire' }
        ],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'Vuetify.js',
        navs: menus,
        snackbar: {},
      }
    },
    created() {
      AppEvents.forEach((item) => {
        this.$on(item.name, item.callback);
      });
      window.getApp = this;
    },
  }
</script>
