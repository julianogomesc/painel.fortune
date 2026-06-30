<template>
    <UForm :schema="schema" :state="state" @submit="onSubmit" class="w-full px-8 md:px-15 lg:px-25" v-if="!route.query.esqueceu_senha">
        <UFormField label="E-mail*:" name="email" :ui="{ root: 'w-full mb-3', label: 'text-gray-700 px-2'}">
            <UInput v-model="state.email" type="email" class="w-full" size="xl" :disabled="pendingLogin" />
        </UFormField>
        <UFormField label="Senha*:" name="password" :ui="{ root: 'w-full mb-3', label: 'text-gray-700 px-2'}">
            <UInput v-model="state.password" :type="typeInput" class="w-full" size="xl" :disabled="pendingLogin" />
            <UButton :icon="!showPassword ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'" class="absolute right-1 top-1 cursor-pointer" :ui="{ base: 'bg-neutral text-black hover:bg-neutral active:bg-neutral'}" @click="showEnabledPassword" :disabled="pendingLogin"></UButton>
        </UFormField>
        <div class="flex justify-between">
            <a href="#" @click.prevent="forgetPassword(true)" class="text-gray-700 py-2 text-sm">Lembrar Senha?</a>
            <UButton type="submit" label="Logar" color="blueFortune" size="xl" :ui="{base: 'px-6 cursor-pointer'}" :disabled="pendingLogin" />
        </div>
    </UForm>
    <UForm :schema="schemaForgetPass" :state="stateForgetPass" @submit="forgetPassSubmit" class="w-full px-8 md:px-15 lg:px-25" v-else>
        <UFormField label="E-mail*:" name="email" :ui="{ root: 'w-full mb-3', label: 'text-gray-700 px-2'}">
            <UInput v-model="stateForgetPass.email" type="email" class="w-full" size="xl" />
        </UFormField>
        <div class="flex justify-between">
            <a href="#" @click.prevent="forgetPassword(false)" class="text-gray-700 py-2 text-sm">Voltar ao Login</a>
            <UButton type="submit" label="Recuperar Senha" color="blueFortune" size="xl" :ui="{base: 'px-6 cursor-pointer'}" />
        </div>
    </UForm>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui';
import type { userType } from '~/types/user';

const login = useLoginStore()

const route = useRoute()
const router = useRouter()

function forgetPassword(validate: boolean){
    if(validate){
        router.push({
            query: {
                'esqueceu_senha': 'true'
            }
        })
    } else {
        router.push({
            query: {}
        })
    }
}

const schema = z.object({
    email: z.string('Informe o e-mail').email("Informe um e-mail válido"),
    password: z.string('Informe a senha').min(6, "Mínimo 6 caracteres")
})
const schemaForgetPass = z.object({
    email: z.string('Informe o e-mail').email("Informe um e-mail válido"),
})

type Schema = z.output<typeof schema>
type SchemaForgetPass = z.output<typeof schemaForgetPass>

const showPassword = ref(false)
const typeInput = ref('password')

const state = reactive<Partial<Schema>>({
    email: undefined,
    password: undefined
})
const stateForgetPass = reactive<Partial<SchemaForgetPass>>({
    email: undefined
})
const toast = useToast()

const formData = computed(() => {
    const fd = new FormData()
    fd.append('email', state.email || '')
    fd.append('password', state.password || '')
    return fd
})

const { pending: pendingLogin, error: errorLogin, result: resultLogin, fetchResult: fetchLogin } = useApiRequests("/_painel/users/login", "POST", formData, 'none', false)

async function onSubmit(_event: FormSubmitEvent<Schema>) {
    await fetchLogin()
    if(errorLogin.value[0]) {
        toast.add({
            title: "Erro no login",
            description: errorLogin.value[0],
            icon: 'i-lucide-door-closed-locked',
            color: "error",
            duration: 10000
        })
    }
    else if (resultLogin.value.token){
        login.doLogin(resultLogin.value as userType)
        toast.add({
            title: "Login realizado com sucesso",
            description: "Estamos lhe redirecionando...",
            icon: "i-lucide-door-open",
            color: "success",
            duration: 10000
        })
        navigateTo('/dashboard')
    }
}

async function forgetPassSubmit(_event: FormSubmitEvent<SchemaForgetPass>) {
    toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
}

function showEnabledPassword(){
    if(typeInput.value == 'password'){
        typeInput.value = 'text'
        showPassword.value = true
    }else{
        typeInput.value = 'password'
        showPassword.value = false
    }
}

</script>