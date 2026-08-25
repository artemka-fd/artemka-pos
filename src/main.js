import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { useCatalogStore } from './stores/catalog'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

await useCatalogStore(pinia).fetchCatalog()

app.mount('#app')