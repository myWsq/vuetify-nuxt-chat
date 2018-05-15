const routerBase = process.env.DEPLOY_ENV === 'GH_PAGES' ? {
  router: {
    base: '/vuetify-nuxt-chat/'
  }
} : {}

module.exports = {
  /*
   ** Headers of the page
   */
  ...routerBase,
  head: {
    title: 'cs-nuxt-demo',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Nuxt.js + Vuetify.js project'
      }
    ],
    link: [{
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },
  plugins: ['~/plugins/vuetify.js'],
  css: [
    '~/assets/style/app.styl'
  ],
  modules: ['@nuxtjs/apollo'],
  apollo: {
    clientConfigs: {
      default: '~/graphql/test.js',
    }
  },
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: '#3B8070'
  },
  /*
   ** Build configuration
   */
  build: {
    vendor: [
      '~/plugins/vuetify.js',
    ],
    extractCSS: true,
  }
}