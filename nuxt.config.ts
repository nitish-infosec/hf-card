// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@vueuse/nuxt'
  ],

  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light'
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css'
  },

  app: {
    head: {
      title: 'HF-Cards | Micro-Training Library',
      meta: [
        { name: 'description', content: 'Bite-sized security awareness training' },
        { name: 'author', content: 'HumanFirewall' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  }
})
