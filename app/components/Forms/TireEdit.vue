<script setup lang="ts">
import { z } from 'zod'
const route = useRoute()
// const isEditing = computed(() => route.params.acao === 'editar' && route.params.id)
// const bannerId = computed(() => String(route.params.id) as string | undefined)

interface item {
  categoria_id: number
  codigo: string
  titulo: string
  slug: string
  descricao?: string | null
  indicacao?: string | null
  pdf?: string | null
  uso_frotas: 0 | 1
  uso_comercial: 0 | 1
  uso_pessoal: 0 | 1
  situacao: 0 | 1
  categoria_nome: string
  imagem_capa?: string
  imagens?: string[]
}

// const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']

// const fileSchema = (label: string) =>
//   z.instanceof(File, { message: `${label} é obrigatória` })
//     .refine(f => ALLOWED_TYPES.includes(f.type), `${label}: formato inválido (use webp, jpg, jpeg ou png)`)

const schema = z.object({
  categoria_id: z.number().min(1, 'Categoria é obrigatório'),
  codigo: z.string().min(1, 'Código é obrigatório'),
  titulo: z.string().min(1, 'Título é obrigatório').max(100, 'Máximo 100 caracteres'),
  descricao: z.string().max(100, 'Máximo 100 caracteres').optional(),
  indicacao: z.string().max(255, 'Máximo 100 caracteres').optional(),
  uso_frotas: z.union([z.literal(0), z.literal(1)]),
  uso_comercial: z.union([z.literal(0), z.literal(1)]),
  uso_pessoal: z.union([z.literal(0), z.literal(1)]),
  situacao: z.union([z.literal(0), z.literal(1)]),
  categoria_nome: z.string().optional()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  categoria_id: 0,
  codigo: '',
  titulo: '',
  descricao: '',
  indicacao: '',
  uso_frotas: 0,
  uso_comercial: 0,
  uso_pessoal: 0,
  situacao: 0,
})

const image_principal = ref<File | string | undefined>(undefined)
const pdf = ref<File | string | undefined>(undefined)
const image_galery = ref<Array<File | string>>([])

const hasImagePrincipalChanged = computed(() => image_principal.value instanceof File)
const hasPdfChanged = computed(() => pdf.value instanceof File)
const hasGaleryChanged = computed(() => image_galery.value.some(item => item instanceof File))


// const hasImageFile = computed(() => state.imagem instanceof File || String(state.imagem) === '[object File]')
// const categoryPayload = computed(() => ({
//   nome: state.nome,
//   descricao: state.descricao,
//   situacao: state.situacao,
// }))
// const imagePayload = computed(() => ({
//   imagem: state.imagem,
// }))
// const hasFieldChanges = computed(() => {
//   if (!isEditing.value || !categoryResult.value || typeof categoryResult.value !== 'object') return false

//   const currentCategory = categoryResult.value as {
//     nome?: string,
//     descricao?: string,
//     situacao?: number,
//   }

//   return state.nome !== (currentCategory.nome ?? '')
//     || state.descricao !== (currentCategory.descricao ?? '')
//     || state.situacao !== (currentCategory.situacao ?? undefined)
// })

const emit = defineEmits<{ success: [] }>()

// const { fetchResult, pending, error } = useApiRequests(
//   `/_painel/familias/view/${route.params.id}`,
//   'GET',
//   state,
//   'formdata'
// )
const { fetchResult, result, pending, error } = useApiRequests(
  `/_painel/familias/view/${route.params.id}`,
  'GET'
)

const previewImagem = ref<string>()
const previewImagemMobile = ref<string>()

function updatePreview(file: File | undefined, previewRef: Ref<string | undefined>) {
  if (previewRef.value) URL.revokeObjectURL(previewRef.value)
  previewRef.value = file ? URL.createObjectURL(file) : undefined
}

watch(() => image_principal.value, file => updatePreview(file, previewImagem))

onMounted(async () => {
    await fetchResult()
    populateForm()
})

onBeforeUnmount(() => {
  if (previewImagem.value) URL.revokeObjectURL(previewImagem.value)
  if (previewImagemMobile.value) URL.revokeObjectURL(previewImagemMobile.value)
})

function populateForm(){
    const data = result.value as item
    state.categoria_id = data.categoria_id ?? 0
    state.codigo = data.codigo ?? ''
    state.titulo = data.titulo ?? ''
    state.descricao = data.descricao ?? ''
    state.indicacao = data.indicacao ?? ''
    state.uso_frotas = data.uso_frotas ?? 0
    state.uso_comercial = data.uso_comercial ?? 0
    state.uso_pessoal = data.uso_pessoal ?? 0
    state.situacao = data.situacao ?? 0
    if(data.imagem_capa){
        previewImagem.value = data.imagem_capa
    }
    image_principal.value = data.imagem_capa ?? undefined
    pdf.value = data.pdf ?? undefined
    image_galery.value = data.imagens ?? []

}

const { fetchResult: fetchImagePrincipal, error: errorImagePrincipal } = useApiRequests(
  `/_painel/familias/imagens/${route.params.id}`,
  'POST',
  { imagem: image_principal },
  'formdata'
)

const { fetchResult: fetchPdf, error: errorPdf } = useApiRequests(
  `/_painel/familias/pdf/${route.params.id}`,
  'POST',
  { pdf },
  'formdata'
)

const { fetchResult: fetchGalery, error: errorGalery } = useApiRequests(
  `/_painel/familias/imagens/${route.params.id}`,
  'POST',
  { imagens: image_galery },
  'formdata'
)


async function onSubmit() {
   await fetchResult() // rota principal de alteração do produto (sempre chamada)
  if (Object.keys(error.value).length) return

  if (hasImagePrincipalChanged.value) {
    await fetchImagePrincipal() // rota separada para imagem principal
    if (Object.keys(errorImagePrincipal.value).length) return
  }

  if (hasPdfChanged.value) {
    await fetchPdf() // rota separada para pdf
    if (Object.keys(errorPdf.value).length) return
  }

  if (hasGaleryChanged.value) {
    await fetchGalery() // rota separada para galeria
    if (Object.keys(errorGalery.value).length) return
  }
  if (!Object.keys(error.value).length) {
    emit('success')
  }
}
</script>

<template>
<UForm :schema="schema" :state="state" class="space-y-4 relative" @submit="onSubmit">
    <Loading v-if="pending" />
    <div class="grid grid-cols-12 gap-5">
        <div class="col-span-12 mb-1">
            <h2 class="font-bold text-2xl uppercase text-blueFortune">Editar Pneu</h2>
        </div>
        <div class="col-span-12 md:col-span-9">
            <UFormField label="Título:" name="nome" required>
              <UInput v-model="state.titulo" maxlength="255" placeholder="Nome do pneu" class="w-full" />
            </UFormField>
        </div>
        <div class="col-span-12 md:col-span-3">
          <UFormField label="Código:" name="codigo" required>
            <UInput v-model="state.codigo" maxlength="255" class="w-full" disabled />
          </UFormField>
        </div>
        <div class="col-span-12 md:col-span-6">
            <UFormField label="Descrição:" name="descricao">
              <UTextarea v-model="state.descricao" class="w-full" />
            </UFormField>
        </div>
        <div class="col-span-12 md:col-span-6">
            <UFormField label="Indicação de Uso:" name="indicacao_uso">
              <UTextarea v-model="state.indicacao" class="w-full" />
            </UFormField>
        </div>
        <div class="col-span-12 md:col-span-3">
          <UFormField label="Uso de Frota:" name="frota">
            <USwitch v-model="state.uso_frotas" :true-value="1" :false-value="0" unchecked-icon="i-lucide-x" checked-icon="i-lucide-check" :ui="{base: 'cursor-pointer'}" />
          </UFormField>
        </div>
        <div class="col-span-12 md:col-span-3">
          <UFormField label="Uso Comercial:" name="comercial">
            <USwitch v-model="state.uso_comercial" :true-value="1" :false-value="0" unchecked-icon="i-lucide-x" checked-icon="i-lucide-check" :ui="{base: 'cursor-pointer'}" />
          </UFormField>
        </div>
        <div class="col-span-12 md:col-span-3">
          <UFormField label="Uso Pessoal:" name="pessoal">
            <USwitch v-model="state.uso_pessoal" :true-value="1" :false-value="0" unchecked-icon="i-lucide-x" checked-icon="i-lucide-check" :ui="{base: 'cursor-pointer'}" />
          </UFormField>
        </div>        
        <div class="col-span-5 md:col-span-3">
          <UFormField label="Status:" name="situacao">
            <USwitch v-model="state.situacao" :true-value="1" :false-value="0" unchecked-icon="i-lucide-x" checked-icon="i-lucide-check" :ui="{base: 'cursor-pointer'}" />
          </UFormField>
        </div>
        <div class="col-span-12 ">
        <!-- <pre>{{ state }}</pre> -->
            <UFormField label="Imagem:" name="imagem">
                <div class="flex items-center gap-3">
                    <img v-if="previewImagem" :src="previewImagem" class="h-12 w-12 object-cover rounded">
                    <UFileUpload
                        v-model="image_principal"
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
