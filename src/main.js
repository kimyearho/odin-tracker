import { createApp } from 'vue'
import router from '@/router/router'
import element from '@/plugins/element-plus'
import Vue3Autocounter from 'vue3-autocounter';
import App from './App.vue'

import '@/styles/index.scss'

createApp(App)
.use(router)
.use(element)
.component('vue3-autocounter', Vue3Autocounter)
.mount('#app')
