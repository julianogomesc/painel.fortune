<template>
    <div class="absolute bottom-2 right-2">
        <div class="flex justify-between">
            <UTooltip text="Configurações">
                <UButton to="/configuracoes" variant="outline" color="neutral" icon="i-lucide-settings" class="mr-3 cursor-pointer" />
            </UTooltip>
            <UTooltip text="Logout">
                <UButton variant="solid" color="error" icon="i-lucide-log-out" class="cursor-pointer" @click="logout"/>
            </UTooltip>
        </div>
    </div>
</template>

<script setup lang="ts">
const login = useLoginStore()
const toast = useToast()
const logout = () => {
    login.doLogout()
    toast.add({
        title: "Logout realizado com sucesso",
        description: "Estamos lhe redirecionando...",
        icon: "i-lucide-door-closed",
        color: "blueFortune",
        duration: 10000
    })
    navigateTo('/')
}
</script>