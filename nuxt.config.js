const pkg = require('./package')

const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#FFFFFF' },

  /*
  ** Global CSS
  */
  css: [
    'vuetify/src/stylus/main.styl'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify',
    '@/plugins/vuelidate',
    '@/plugins/axios',
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/toast',
    '@nuxtjs/auth',
    '~/modules/routes.js',
    '@nuxtjs/moment',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    baseURL: 'http://0.0.0.0:5000/api',
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/Customers/Login', method: 'post', propertyName: 'id' },
          logout: { url: '/Customers/Logout', method: 'post' },
          user: { url: '/Customers/findOne', method: 'get', propertyName: false },
        },
        tokenRequired: true,
        tokenType: null,
      }
    },
    // plugins: [
    //   '~/plugins/config'
    // ],
    redirect: {
      home: '/dashboard',
      logout: '/login'
    }
  },
  router: {
    middleware: ['auth']
  },
  toast: {
    iconPack : 'material',
    theme: "bubble",
    position: "top-right",
    duration : 10000
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      if (ctx.isServer) {
        config.externals = [
          nodeExternals({
            whitelist: [/^vuetify/]
          })
        ]
      }
    }
  }
}
