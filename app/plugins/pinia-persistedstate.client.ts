import { type Pinia } from 'pinia' // 👈 Importação somente de tipo
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
    const pinia = nuxtApp.$pinia as Pinia
    pinia.use(piniaPluginPersistedstate)
})