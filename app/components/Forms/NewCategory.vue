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
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Máximo 100 caracteres'),
//   descricao: z.string().optional(),
  situacao: z.number().optional(),
  imagem: isEditing.value ? fileSchema('Imagem da categoria').optional() : fileSchema('Imagem da categoria').optional(),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  nome: '',
//   descricao: '',
  situacao: undefined,
//   imagem: undefined
})

const emit = defineEmits<{ success: [] }>()

// const { fetchResult, pending, error } = useApiRequests('/banners', 'POST', state, 'formdata')
const { fetchResult, pending, error } = useApiRequests(
    computed(() => isEditing.value ? `/_painel/categorias/${bannerId.value}` : '/_painel/categorias'),
    computed(() => isEditing.value ? 'PUT' : 'POST'),
    state, 
    // 'formdata'
)

const {
    fetchResult: fetchCategory,
    pending: pendingCategory,
    result: categoryResult,
    error: categoryError
} = useApiRequests(`/_painel/categorias/view/${bannerId.value}`, 'GET')

const previewImagem = ref<string>()
const previewImagemMobile = ref<string>()

function updatePreview(file: File | undefined, previewRef: Ref<string | undefined>) {
  if (previewRef.value) URL.revokeObjectURL(previewRef.value)
  previewRef.value = file ? URL.createObjectURL(file) : undefined
}

watch(() => state.imagem, file => updatePreview(file, previewImagem))

onMounted(async () => {
    if(!isEditing.value) return
    await fetchCategory()
    populateForm()
})

onBeforeUnmount(() => {
  if (previewImagem.value) URL.revokeObjectURL(previewImagem.value)
  if (previewImagemMobile.value) URL.revokeObjectURL(previewImagemMobile.value)
})

function populateForm(){
    const data = categoryResult.value as {
        nome?: string,
        // descricao?: string,
        situacao?: number,
        // imagem?: string
    }
    state.nome = data.nome ?? ''
    // state.descricao ? state.descricao = data.descricao : null
    state.situacao = data.situacao ?? undefined
    // if(data.imagem){
    //     previewImagem.value = data.imagem
    // }
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
    <Loading v-if="pendingCategory || pending" />
    <div class="grid grid-cols-12 gap-5">
        <div class="col-span-12 mb-1">
            <h2 class="font-bold text-2xl uppercase text-blueFortune">{{route.params.acao == 'nova' ? 'Nova Categoria' : 'Editar Categoria'}}</h2>
        </div>
        <div class="col-span-12 md:col-span-5">
            <UFormField label="Nome:" name="nome" required>
              <UInput v-model="state.nome" maxlength="50" placeholder="Nome da categoria" class="w-full" />
            </UFormField>
        </div>
        <!-- <div :class="['col-span-7', route.params.acao !== 'nova' && 'md:col-span-5']">
            <UFormField label="Descrição:" name="descricao">
              <UInput v-model="state.descricao" placeholder="Descrição da categoria" class="w-full" />
            </UFormField>
        </div> -->
        <div class="col-span-5 md:col-span-2" v-if="route.params.acao !== 'nova'">
            <UFormField label="Status:" name="situacao">
                <USwitch v-model="state.situacao" :true-value="1" :false-value="0" unchecked-icon="i-lucide-x" checked-icon="i-lucide-check" />
            </UFormField>
        </div>
        <div class="col-span-12 ">
            <UFormField label="Imagem:" name="imagem">
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
        <div class="col-span-12 text-right">
            <UButton type="submit" :loading="pending" :ui="{base: 'cursor-pointer py-2.5 px-5'}">
              Salvar
            </UButton>
        </div>
    </div>
</UForm>
</template>
