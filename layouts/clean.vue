<template>
  <div>
    <nuxt/>
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
  </div>
</template>
<script>
import AppEvents from '@/util/event';

export default {
  data() {
    return {
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
