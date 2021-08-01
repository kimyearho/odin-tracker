import { createApp } from 'vue'
import router from '@/router/router'
import element from '@/plugins/element-plus'
import App from './App.vue'

createApp(App)
.use(router)
.use(element)
.mount('#app')
