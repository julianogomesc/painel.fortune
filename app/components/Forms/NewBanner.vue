<script setup lang="ts">
import { z } from 'zod'

const route = useRoute()
const isEditing = computed(() => route.params.acao === 'editar' && route.params.id)
const bannerId = computed(() => String(route.params.id) as string | undefined)

const ALLOWED_TYPES = ['image/jpeg', 'image/png']

const fileSchema = (label: string) =>
  z.instanceof(File, { message: `${label} é obrigatória` })
    .refine(f => ALLOWED_TYPES.includes(f.type), `${label}: formato inválido (use jpg, jpeg ou png)`)

const schema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório').max(50, 'Máximo 50 caracteres'),
  texto: z.string().optional(),
  url: z.string().optional(),
  situacao: z.number().optional(),
  imagem: isEditing.value ? fileSchema('Imagem Desktop').optional() : fileSchema('Imagem Desktop'),
  imagem_mobile: isEditing.value ? fileSchema('Imagem Mobile').optional() : fileSchema('Imagem Mobile'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  titulo: '',
  texto: '',
  url: '',
  situacao: undefined,
  imagem: undefined,
  imagem_mobile: undefined
})

const emit = defineEmits<{ success: [] }>()

// const { fetchResult, pending, error } = useApiRequests('/banners', 'POST', state, 'formdata')
const { fetchResult, pending, error } = useApiRequests(
    computed(() => isEditing.value ? `/_painel/banners/edit/${bannerId.value}` : '/_painel/banners'),
    computed(() => isEditing.value ? 'PUT' : 'POST'),
    state, 
    'formdata'
)

const {
    fetchResult: fetchBanner,
    pending: pendingBanner,
    result: bannerResult,
    error: bannerError
} = useApiRequests(`/_painel/banners/view/${bannerId.value}`, 'GET')

const previewImagem = ref<string>()
const previewImagemMobile = ref<string>()

function updatePreview(file: File | undefined, previewRef: Ref<string | undefined>) {
  if (previewRef.value) URL.revokeObjectURL(previewRef.value)
  previewRef.value = file ? URL.createObjectURL(file) : undefined
}

watch(() => state.imagem, file => updatePreview(file, previewImagem))
watch(() => state.imagem_mobile, file => updatePreview(file, previewImagemMobile))

onMounted(async () => {
    if(!isEditing.value) return
    await fetchBanner()
    populateForm()
})

onBeforeUnmount(() => {
  if (previewImagem.value) URL.revokeObjectURL(previewImagem.value)
  if (previewImagemMobile.value) URL.revokeObjectURL(previewImagemMobile.value)
})

function populateForm(){
    const data = bannerResult.value as {
        titulo?: string,
        texto?: string,
        url?: string,
        situacao?: number,
        imagem?: string,
        imagem_mobile?: string
    }
    state.titulo = data.titulo ?? ''
    state.texto = data.texto ?? ''
    state.url = data.url ?? ''
    state.situacao = data.situacao ?? undefined

    if(data.imagem){
        previewImagem.value = data.imagem
    }
    if(data.imagem_mobile){
        previewImagemMobile.value = data.imagem_mobile
    }
}

async function onSubmit() {
  await fetchResult()
  if (!Object.keys(error.value).length) {
    emit('success')
  }
}
</script>

<template>
<UForm :schema="schema" :state="state" class="space-y-4 relative" @submit="onSubmit">
    <Loading v-if="pendingBanner || pending" />
    <div class="grid grid-cols-12 gap-5">
        <div class="col-span-12 mb-1">
            <h2 class="font-bold text-2xl uppercase text-blueFortune">{{route.params.acao == 'novo' ? 'Novo Banner' : 'Editar Banner'}}</h2>
        </div>
        <div class="col-span-12 md:col-span-5">
            <UFormField label="Titulo:" name="titulo" required>
              <UInput v-model="state.titulo" maxlength="50" placeholder="Título do banner" class="w-full" />
            </UFormField>
        </div>
        <div :class="['col-span-7', route.params.acao !== 'novo' && 'md:col-span-5']">
            <UFormField label="Link:" name="url">
              <UInput v-model="state.url" placeholder="https://..." class="w-full" />
            </UFormField>
        </div>
        <div class="col-span-5 md:col-span-2" v-if="route.params.acao !== 'novo'">
            <UFormField label="Status:" name="situacao">
                <USwitch v-model="state.situacao" :true-value="1" :false-value="0" unchecked-icon="i-lucide-x" checked-icon="i-lucide-check" />
            </UFormField>
        </div>
        <div class="col-span-12">
            <UFormField label="Texto:" name="texto">
              <UInput v-model="state.texto" placeholder="Texto do banner" class="w-full" />
            </UFormField>
        </div>
        <div class="col-span-12 md:col-span-6">
            <UFormField label="Imagem Desktop:" name="imagem" required>
                <div class="flex items-center gap-3">
                    <img v-if="previewImagem" :src="previewImagem" class="h-12 w-12 object-cover rounded">
                    <UFileUpload
                        v-model="state.imagem"
                        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                        placeholder="Selecione uma imagem"
                        class="w-full"
                    />
                </div>
            </UFormField>
        </div>
        <div class="col-span-12 md:col-span-6">
            <UFormField label="Imagem Mobile:" name="imagem_mobile" required>
              <div class="flex items-center gap-3">
                <img v-if="previewImagemMobile" :src="previewImagemMobile" class="h-12 w-12 object-cover rounded">
                <UFileUpload
                    v-model="state.imagem_mobile"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    placeholder="Selecione uma imagem"
                    class="w-full"
                />
              </div>
            </UFormField>
        </div>
        <div class="col-span-12 text-right">
            <UButton type="submit" :loading="pending" :ui="{base: 'cursor-pointer py-2.5 px-5'}">
              Salvar
            </UButton>
        </div>
    </div>
</UForm>
</template>
