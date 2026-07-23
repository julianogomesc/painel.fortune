<template>
    <UModal :dismissible="false" :title="title" :ui="{content: 'sm:max-w-2xl'}">
        <template #body>
            <Loading v-if="loadingPreview" />
            <UForm :schema="schema" :state="state" class="space-y-4 relative" @submit="onSubmit">
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 md:col-span-5">
                        <UFormField label="Imagem:" name="imagem" required>
                            <div class="flex items-center gap-3">
                                <div class="mb-0 w-full" v-if="previewImagem && !changeImage">
                                    <img :src="previewImagem" class="w-auto max-h-50 mx-auto rounded mb-2 block" @load="loadingPreview = false" @error="loadingPreview = false">
                                    <UTooltip text="Alterar Imagem">
                                        <UButton icon="i-lucide-refresh-cw" variant="outline" color="blueFortune"  class="mx-auto px-2 pb-0.5 block cursor-pointer" @click="changeFn(true)"/>
                                    </UTooltip>
                                    <!-- {{ previewImagem }} {{ state.imagem }} {{ changeImage }} -->
                                </div>
                                <div class="w-full" v-else>
                                    <ConfigurationsCadUpImage v-model="state.imagem" :url-image="previewImagem" :chn-image="changeImage" />
                                    <UTooltip text="Cancelar" v-if="props.data">
                                        <UButton icon="i-lucide-arrow-left" variant="outline" color="neutral"  class="mx-auto px-2 pb-0.5 block cursor-pointer" @click="changeFn(false)"/>
                                    </UTooltip>
                                </div>
                            </div>
                        </UFormField>
                    </div>
                    <div class="col-span-12 md:col-span-7">
                        <UFormField label="Nome:" name="nome" required>
                            <UInput class="w-full" v-model="state.nome" />
                        </UFormField>
                        <UFormField label="E-mail:" name="email" required>
                            <UInput class="w-full" v-model="state.email" />
                        </UFormField>
                        <UFormField label="Senha:" name="password" required v-if="!props.data" class="relative">
                            <UInput :type="!viewPass ? 'text' : 'password'" class="w-full" v-model="state.password" />
                            <UButton class="absolute cursor-pointer right-0.5 top-0" :icon="viewPass ? 'i-lucide-eye' : 'i-lucide-eye-off'" @click="showPass" :ui="{ base: 'bg-neutral text-black active:bg-transparent disabled:bg-transparent hover:bg-neutral active:bg-neutral'}" />
                        </UFormField>
                        <UFormField label="Perfil:" name="perfil" required>
                            <USelect class="w-full" :items="perfis" v-model="state.perfil" />
                        </UFormField>
                        <UFormField label="Status:" name="situacao" required>
                            <USelect class="w-full" :items="situacoes" v-model="state.situacao" />
                        </UFormField>
                    </div>
                    <div class="col-span-12 mt-5 text-right">
                        <UButton type="submit" color="error" label="Confirmar" class="mr-3 cursor-pointer" />
                        <UButton color="neutral" variant="outline" label="Cancelar" @click="cancel" />
                    </div>
                </div>
            </UForm>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { pick } from 'lodash-es';

const viewPass = ref(false)

function showPass(){
    viewPass.value = !viewPass.value
}

const props = defineProps({
    data: {
        type: Object,
        required: false
    },
    title: {
        type: String,
        required: true
    },
})
const emit = defineEmits<{
    close: [value: boolean]
}>()

const perfis = ref([
    {value: 0, label: 'Operador'},
    {value: 1, label: 'Administrador'}
])
const situacoes = ref([
    {value: 0, label: 'Inativo'},
    {value: 1, label: 'Ativo'}
])

const changeImage = ref(false)
function changeFn(value: boolean){
    changeImage.value = value
}

const toast = useToast()
const pendingImage = ref(false)

interface resUserSuccess {
    id: number,
    nome: string,
    email: string,
    imagem: null,
    perfil: number,
    situacao: number,
    created_at: string,
    updated_at: string
}

const isEditing = computed(() => !!props.data)

const previewImagem = ref<string>()
const loadingPreview = ref(false)

function updatePreview(file: File | string | undefined, previewRef: Ref<string | undefined>) {
  if (previewRef.value?.startsWith('blob:')) URL.revokeObjectURL(previewRef.value)
  previewRef.value = file instanceof File ? URL.createObjectURL(file) : (file || undefined)
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const fileSchema = (label: string) =>
  z.instanceof(File, { message: `${label}: arquivo inválido` })
    .refine(f => ALLOWED_TYPES.includes(f.type), `${label}: formato inválido (use webp, jpg, jpeg ou png)`).nullable().optional()

const schema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(255, 'Máximo 255 caracteres'),
  email: z.string().min(1, 'E-mail é obrigatório').max(255, 'Máximo 255 caracteres').email("Informe um e-mail válido"),
  password: isEditing.value
    ? z.string().optional()
    : z.string().min(8, 'Senha deve conter ao menos 8 caracteres').max(16, 'Máximo 16 caracteres').regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/,
        { message: "A senha deve conter ao menos uma letra maiúscula, uma minúscula, um número e um caractere especial." }
      ),
  perfil: z.number().optional(),
  situacao: z.number().optional(),
  imagem: fileSchema('Imagem')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  nome: '',
  email: '',
  password: '',
  perfil: 0,
  situacao: 0,
  imagem: undefined,
})

watch(() => props.data, (data) => {
    if (data) {
        state.nome = data.nome
        state.email = data.email
        previewImagem.value = data.imagem
        state.perfil = Number(data.perfil)
        state.situacao = Number(data.situacao)
    }
}, { immediate: true })

watch(() => state.imagem, (file) => {
    if(file){
        loadingPreview.value = true
        changeImage.value = false
        updatePreview(file, previewImagem)
    }
})

async function onSubmit() {
    const usersStore = useUsersStore()
    if (!isEditing.value) {
        const { fetchResult: fetchNewUser, result: resNewUser, error } = useApiRequests(`/_painel/users`, 'POST', state, 'formdata')
        await fetchNewUser()

        const response = resNewUser.value as resUserSuccess

        if(Array.isArray(error.value) && error.value.length > 0){
            toast.add({
                title: 'Erro',
                description: error.value[0],
                color: 'error',
                duration: 1600,
            })
            pendingImage.value = true
            setTimeout(() => {
                pendingImage.value = false
            }, 1500)
        }
        if (response.id) {
        toast.add({
            title: 'Sucesso',
            description: `Usuário ${response.nome} criado com sucesso!`,
            color: 'success',
            duration: 1600,
        })
        pendingImage.value = true
        setTimeout(() => {
            usersStore.triggerRefresh()
            emit('close', false)
            // router.go(0)
        }, 1500)
        }
    }
    else {
        const { password, ...editState } = state
        const { fetchResult: fetchEditUser, result: resEditUser, error } = useApiRequests(`/_painel/users/${props.data?.id}`, 'PUT', editState, 'formdata')
        await fetchEditUser()

        const response = resEditUser.value as resUserSuccess

        if(Array.isArray(error.value) && error.value.length > 0){
            toast.add({
                title: 'Erro',
                description: error.value[0],
                color: 'error',
                duration: 1600,
            })
            pendingImage.value = true
            setTimeout(() => {
                pendingImage.value = false
            }, 1500)
        }
        if (response.id) {
        toast.add({
            title: 'Sucesso',
            description: `Usuário ${response.nome} atualizado com sucesso!`,
            color: 'success',
            duration: 1600,
        })
        if(previewImagem.value?.startsWith('blob:') && state.imagem instanceof File){
            toast.add({
                title: 'Atualizando Imagem',
                description: `Atualizado imagem do usuário ${response.nome}!`,
                color: 'warning',
                duration: 1600,
            })

            const imageUploading = pick(state, [
                'imagem'
            ])

            const { userSaveImage, result: resultUpImg, error: errorUpImg } = useApiRequests(`/_painel/users/avatar/${response.id}`, 'POST', imageUploading, 'formdata' )
            await userSaveImage()

            const res = resultUpImg.value as {success: boolean}

            if(Array.isArray(errorUpImg.value) && errorUpImg.value.length > 0){
                toast.add({
                    title: 'Erro',
                    description: errorUpImg.value[0],
                    color: 'error',
                    duration: 1600,
                })
                pendingImage.value = true
                setTimeout(() => {
                    pendingImage.value = false
                }, 1500)
            }
            if (res.success) {
                toast.add({
                    title: 'Sucesso',
                    description: 'Imagem alterada com sucesso!',
                    color: 'success',
                    duration: 1600,
                })
                pendingImage.value = true
                setTimeout(() => {
                    usersStore.triggerRefresh()
                    emit('close', true)
                }, 1500)
            }            
        }
        pendingImage.value = true
        setTimeout(() => {
            usersStore.triggerRefresh()
            emit('close', true)
        }, 1500)
        }
    }
}

function cancel(){
    emit('close', false)
}

onBeforeUnmount(() => {
  if (previewImagem.value) URL.revokeObjectURL(previewImagem.value)
})
</script>
