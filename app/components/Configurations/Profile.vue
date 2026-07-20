<template>
    <Loading v-if="pending" />
    <UForm :schema="schema" :state="data" @submit="updateData" class="w-full">
        <div class="px-4 my-5">
            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 lg:col-span-3 mb-3 text-center">
                    <UAvatar class="rounded-none squircle" :src="imagem ? imagem : '/images/nopicture.jpg'" alt="Benjamin Canac" loading="lazy" size="4xl" />
                    <div class="-mt-4 mb-3 relative z-50">
                        <!-- <UTooltip text="Excluir Imagem">
                            <UButton icon="i-lucide-trash" class="mr-2 cursor-pointer" variant="solid" color="error" />
                        </UTooltip> -->
                        <UTooltip text="Alterar Imagem">
                            <UButton icon="i-lucide-image-up" class="cursor-pointer" variant="solid" color="blueFortuneDark" />
                        </UTooltip>
                    </div>
                </div>
                <div class="col-span-12 lg:col-span-9 mb-3">
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12">
                            <UFormField label="Nome*:" name="nome" :ui="{ root: 'w-full', label: 'text-gray-700 px-2'}">
                                <UInput v-model="data.nome" class="w-full" />
                            </UFormField>
                        </div>
                        <div class="col-span-12">
                            <UFormField label="E-mail*:" name="email" type="email" :ui="{ root: 'w-full', label: 'text-gray-700 px-2'}">
                                <UInput v-model="data.email" class="w-full" />
                            </UFormField>
                        </div>
                        <div class="col-span-12 lg:col-span-4">
                            <UFormField label="Perfil*:" name="perfil" :ui="{ root: 'w-full mb-2', label: 'text-gray-700 px-2'}">
                                <USelect v-model="data.perfil" class="w-full" :items="perfis" :disabled="user.user?.perfil == 0" />
                            </UFormField>
                        </div>
                        <div class="col-span-12 lg:col-span-4">
                            <UFormField label="Status*:" name="situacao" :ui="{ root: 'w-full mb-2', label: 'text-gray-700'}">
                                <USwitch v-model="data.situacao" :true-value="1" :false-value="0" unchecked-icon="i-lucide-x" checked-icon="i-lucide-check" color="blueFortune" class="mt-2" :disabled="user.user?.perfil == 0" />
                            </UFormField>
                        </div>
                        <div class="col-span-12 lg:col-span-7 ">
                            <UButton type="submit" label="Salvar" color="blueFortune" size="md" :ui="{base: 'px-4 cursor-pointer'}" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </UForm>
</template>

<script setup lang="ts">

const {user} = useLoginStore()
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui';

interface Dados {
    nome: string
    email: string
    perfil: 0 | 1
    situacao: 0 | 1
}

const schema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(255, 'Máximo 255 caracteres'),
  email: z.string().min(1, 'Informe o e-mail').email("Informe um e-mail válido"),
  perfil: z.union([z.literal(0), z.literal(1)]),
  situacao: z.union([z.literal(0), z.literal(1)])
})

type Schema = z.output<typeof schema>

const data = reactive<Dados>({
    nome: '',
    email: '',
    perfil: 0,
    situacao: 0,
})

const imagem = ref('')

const perfis = ref([
    {value: 0, label: 'Operador'},
    {value: 1, label: 'Administrador'}
])

onMounted(async () => {
    
    const {pending, error: errorGetData, result: resultGetData, fetchResult: fetchGetResult} = useApiRequests(
        `/_painel/users/view/${user.user?.id}`,
        'GET'
    )
    await fetchGetResult()
    
    interface UserResponse {
        nome: string,
        email: string,
        perfil: number,
        situacao: number,
        imagem: string,
    }
    const userData = resultGetData.value as UserResponse
    data.nome = userData.nome
    data.email = userData.email
    data.perfil = Number(userData.perfil) as 0 | 1
    data.situacao = Number(userData.situacao) as 0 | 1
    imagem.value = userData.imagem
})

const toast = useToast()
const login = useLoginStore()

const method = 'PUT'
const endpoint = `/_painel/users/${user.user?.id}`

const { pending, error, result, fetchResult } = useApiRequests(
    endpoint,
    method,
    data,
    'none'
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

  if (Array.isArray(error.value)) {
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

<style>
.squircle {
  max-width: 180px;
  max-height: 180px;
  mask-image: url("data:image/svg+xml,%3csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M100 0C20 0 0 20 0 100s20 100 100 100 100-20 100-100S180 0 100 0Z'/%3e%3c/svg%3e");
  mask-size: 180px;
  mask-position: center;
  mask-repeat: no-repeat;
}
</style>