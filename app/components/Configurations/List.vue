<template>
    <UTabs :items="items" variant="link" :ui="{trigger: 'grow'}" class="gap-4 w-full">
        <template #profile>
            <ConfigurationsProfile />
        </template>
        <template #password>
            <!-- <ChangePassword /> -->
        </template>
        <template #users>
            <!-- <UsersList /> -->
        </template>
    </UTabs>

</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

const items = [
    {
        label: 'Perfil',
        icon: 'i-lucide-user',
        slot: 'profile' as const,
    },
    {
        label: 'Alterar Senha',
        icon: 'i-lucide-lock',
        slot: 'password' as const,
    },
    {
        label: 'Ger. Usuários',
        icon: 'i-lucide-users',
        slot: 'users' as const,
    }
] satisfies TabsItem[]

</script>