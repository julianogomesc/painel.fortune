<template>
    <UModal :dismissible="false" title="Adicionar Usuário" :ui="{content: 'sm:max-w-2xl'}">
        <template #body>
            <UForm :schema="schema" :state="state" class="space-y-4 relative" @submit="onSubmit">
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 md:col-span-5">
                        <UFormField label="Imagem:" name="imagem" required>
                            <div class="flex items-center gap-3">
                                <div class="mb-3" v-if="previewImagem && !changeImage">
                                    <img :src="previewImagem" class="w-full object-cover rounded mb-2 block">
                                    <UTooltip text="Alterar Imagem">
                                        <UButton icon="i-lucide-refresh-cw" variant="outline" color="blueFortune"  class="mx-auto px-2 pb-0.5 block cursor-pointer" @click="changeFn(true)"/>
                                    </UTooltip>
                                </div>
                                <div class="w-full" v-else>
                                    <UFileUpload
                                    v-model="state.imagem"
                                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                                    placeholder="Selecione uma imagem"
                                    class="w-full mb-3"
                                    />
                                    <UTooltip text="Cancelar">
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
                        <UFormField label="Senha:" name="password" required>
                            <UInput class="w-full" v-model="state.password" />
                        </UFormField>
                        <UFormField label="Perfil:" name="perfil" required>
                            <USelect class="w-full" :items="perfis" v-model="state.perfil" />
                        </UFormField>
                        <UFormField label="Status:" name="situacao" required>
                            <USelect class="w-full" :items="situacoes" v-model="state.situacao" />
                        </UFormField>
                    </div>
                    <div class="col-span-12 mt-5 text-right">
                        <UButton type="submit" color="error" label="Confirmar" class="mr-3" />
                        <UButton color="neutral" variant="outline" label="Cancelar" @click="cancel" />
                    </div>
                </div>
            </UForm>
        </template>
    </UModal>
</template>

<script setup lang="ts">
const props = defineProps({
    data: {
        type: Object,
        required: false
    }
})

function changeFn(value: boolean){
    changeImage.value = value
}

const changeImage = ref(false)

const emit = defineEmits<{
    close: [value: boolean]
}>()

function onSubmit(){
    // emit('close', true)
}

function cancel(){
    emit('close', false)
}

const perfis = ref([
    {value: 0, label: 'Operador'},
    {value: 1, label: 'Administrador'}
])

const situacoes = ref([
    {value: 0, label: 'Inativo'},
    {value: 1, label: 'Ativo'}
])

import { z } from 'zod'
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const fileSchema = (label: string) =>
  z.instanceof(File, { message: `${label} é obrigatória` })
    .refine(f => ALLOWED_TYPES.includes(f.type), `${label}: formato inválido (use webp, jpg, jpeg ou png)`)

const schema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(255, 'Máximo 255 caracteres'),
  email: z.string().min(1, 'E-mail é obrigatório').max(255, 'Máximo 255 caracteres').email("Informe um e-mail válido"),
  password: z.string().min(8, 'Senha deve conter ao menos 8 caracteres').max(16, 'Máximo 16 caracteres').regex(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/,
    { message: "A senha deve conter ao menos uma letra maiúscula, uma minúscula, um número e um caractere especial." }
  ),
  perfil: z.number().optional(),
  situacao: z.number().optional(),
  imagem: fileSchema('Imagem Desktop').optional(),
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

const previewImagem = ref<string>()

function updatePreview(file: File | string | undefined, previewRef: Ref<string | undefined>) {
  if (previewRef.value?.startsWith('blob:')) URL.revokeObjectURL(previewRef.value)
  previewRef.value = file instanceof File ? URL.createObjectURL(file) : (file || undefined)
}


watch(() => state.imagem, file => updatePreview(file, previewImagem))

onMounted(async () => {
    if(props.data){
        state.nome = props.data.nome
        state.email = props.data.email
        previewImagem.value = props.data.imagem
        state.perfil = Number(props.data.perfil)
        state.situacao = Number(props.data.situacao)
    }
    // await fetchBanner()
    // populateForm()
})

onBeforeUnmount(() => {
  if (previewImagem.value) URL.revokeObjectURL(previewImagem.value)
})
</script>
