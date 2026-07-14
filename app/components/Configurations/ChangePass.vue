<template>
    <Loading v-if="pending" />
    <UForm :schema="schema" :state="data" @submit="updateData" class="w-full">
        <div class="px-4 my-5">
            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 lg:col-span-3 mb-3">
                    <UFormField label="Senha Atual*:" name="password" :ui="{ root: 'w-full mb-3', label: 'text-gray-700 px-2'}">
                        <UInput :type="showPass.password ? 'text' : 'password'" v-model="data.password" class="w-full" />
                        <UButton :icon="!showPass.password ? 'i-lucide-eye' : 'i-lucide-eye-off'" class="cursor-pointer" @click="showP('password')" :ui="{base: 'text-gray-600 active:bg-transparent disabled:bg-transparent bg-transparent absolute right-1 hover:bg-transparent'}" />
                    </UFormField>
                </div>
                <div class="col-span-12 lg:col-span-3 mb-3">
                    <UFormField label="Nova Senha*:" name="new_password" :ui="{ root: 'w-full mb-3', label: 'text-gray-700 px-2'}">
                        <UInput :type="showPass.new_password ? 'text' : 'password'" v-model="data.new_password" class="w-full" />
                        <UButton :icon="!showPass.new_password ? 'i-lucide-eye' : 'i-lucide-eye-off'" class="cursor-pointer" @click="showP('new_password')" :ui="{base: 'text-gray-600 active:bg-transparent disabled:bg-transparent bg-transparent absolute right-1 hover:bg-transparent'}" />
                    </UFormField>
                </div>
                <div class="col-span-12 lg:col-span-3 mb-3">
                    <UFormField label="Confirmar Senha*:" name="confirm_new_password" :ui="{ root: 'w-full mb-3', label: 'text-gray-700 px-2'}">
                        <UInput :type="showPass.confirm_new_password ? 'text' : 'password'" v-model="data.confirm_new_password" class="w-full" />
                        <UButton :icon="!showPass.confirm_new_password ? 'i-lucide-eye' : 'i-lucide-eye-off'" class="cursor-pointer" @click="showP('confirm')" :ui="{base: 'text-gray-600 active:bg-transparent disabled:bg-transparent bg-transparent absolute right-1 hover:bg-transparent'}" />
                    </UFormField>
                </div>
            </div>
            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 lg:col-span-7 ">
                    <UButton type="submit" label="Salvar" color="blueFortune" size="md" :ui="{base: 'px-4 cursor-pointer'}" />
                </div>
            </div>
        </div>
    </UForm>
</template>

<script setup lang="ts">

const showPass = reactive({
    password: false,
    new_password: false,
    confirm_new_password: false,
})

import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui';

interface Dados {
    password: string
    new_password: string
    confirm_new_password: string
}

const schema = z.object({
  password: z.string().min(8, 'A senha deve conter pelo menos 8 caracteres').max(16, 'A senha deve contar no máx. 16 caracteres'),
  new_password: z.string().min(8, 'A senha deve conter pelo menos 8 caracteres').max(16, 'A senha deve contar no máx. 16 caracteres'),
  confirm_new_password: z.string().min(8, 'A senha deve conter pelo menos 8 caracteres').max(16, 'A senha deve contar no máx. 16 caracteres'),
})

type Schema = z.output<typeof schema>

const data = reactive<Dados>({
    password: '',
    new_password: '',
    confirm_new_password: '',
})

function showP(item: String){
    if(item == 'password'){
        showPass.password = !showPass.password
    }
    if(item == 'new_password'){
        showPass.new_password = !showPass.new_password
    }
    if(item == 'confirm'){
        showPass.confirm_new_password = !showPass.confirm_new_password
    }
}

const toast = useToast()

const endpoint = `/_painel/users/password`

const { pending, error, result, fetchResult } = useApiRequests(
    endpoint,
    'PUT',
    data,
    'none'
)

async function updateData(_event: FormSubmitEvent<Schema>) {
  await fetchResult()

  if (Array.isArray(error.value)) {
    toast.add({
      title: "Erro",
      description: error.value[0],
      icon: 'i-lucide-save-off',
      color: "error",
      duration: 1800
    })
  } else if (result.value) {
    console.log(result.value)
    toast.add({
      title: "Sucesso",
      description: "Dados salvos com sucesso!",
      icon: "i-lucide-save-check",
      color: "success",
      duration: 1800
    })
  }
}

</script>