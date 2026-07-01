// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
    // Só protege páginas que usam o layout interna
    if (to.meta.layout !== 'interna') {
        return
    }

    const store = useLoginStore()

    if (!store.user.user?.id) {
        return navigateTo('/')
    }
})