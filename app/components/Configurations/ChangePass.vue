<template>
    <Loading v-if="pending" />
    <UForm :schema="schema" :state="data" @submit="updateData" class="w-full">
        <div class="px-4 my-5">
            <div class="grid grid-cols-12 gap-4" v-if="!props.isEditing">
                <div class="col-span-12 lg:col-span-3 mb-3">
                    <UFormField label="Senha*:" name="password" :ui="{ root: 'w-full mb-3', label: 'text-gray-700 px-2'}">
                        <UInput :type="showPass ? 'text' : 'password'" v-model="data.password" class="w-full" />
                        <UButton :icon="!showPass ? 'i-lucide-eye' : 'i-lucide-eye-off'" class="cursor-pointer" @click="showPass = !showPass" :ui="{base: 'text-gray-600 bg-transparent absolute right-1 hover:bg-transparent'}" />
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

const props = defineProps({
    isEditing: {
        default: false
    }
})

const showPass = reactive({
    password: false,
    new_password: false,
    confirm_new_password: false,
})

const {user} = useLoginStore()
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

onMounted(async () => {
    data.password = user.user?.nome
    data.new_password = user.user?.email
    data.confirm_new_password = user.user?.perfil
})

const toast = useToast()
const login = useLoginStore()

const method = computed(() => props.isEditing ? 'PUT' : 'POST')
const endpoint = computed(() => props.isEditing ? `/_painel/users/${user.user?.id}` : '/_painel/users')

props.isEditing ? delete data.password : null

const { pending, error, result, fetchResult } = useApiRequests(
    endpoint,
    method,
    data,
    props.isEditing ? 'none' : 'formdata'
)


type UserPayload = {
  id: number
  nome: string
  email: string
  perfil: number
  situacao: number
  password?: string
}

function isUserPayload(value: unknown): value is UserPayload {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false

  const v = value as Record<string, unknown>

  return (
    typeof v.id === 'number' &&
    typeof v.nome === 'string' &&
    typeof v.email === 'string' &&
    typeof v.perfil === 'number' &&
    typeof v.situacao === 'number'
  )
}

async function updateData(_event: FormSubmitEvent<Schema>) {
  await fetchResult()

  if (error.value[0]) {
    toast.add({
      title: "Erro",
      description: error.value[0],
      icon: 'i-lucide-save-off',
      color: "error",
      duration: 1800
    })
  } else if (isUserPayload(result.value)) {
    const updatedUser = {
        id: result.value.id,
        nome: result.value.nome,
        email: result.value.email,
        perfil: result.value.perfil,
        situacao: result.value.situacao
    }
    login.updateLoginData(updatedUser)

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