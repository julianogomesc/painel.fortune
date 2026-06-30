// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
    const store = useLoginStore()

    // Se não tem usuário, redireciona para login
    if (!store.user.data?.id) {
        return navigateTo('/')
    }
})