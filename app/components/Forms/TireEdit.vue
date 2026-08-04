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

interface imageGalery{
  capa: number
  id: number
  imagem: string
}

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
type GalleryImage = string | File | { imagem: string; id?: number }

const image_galery = ref<GalleryImage[]>([])

const isImageObject = (image: GalleryImage): image is { imagem: string; id?: number } =>
  typeof image !== 'string' && !(image instanceof File) && 'imagem' in image

const uploadImageGallery = computed(() =>
  image_galery.value.filter(
    (item): item is string | File => typeof item === 'string' || item instanceof File
  )
)

const hasImagePrincipalChanged = computed(() => image_principal.value instanceof File)
const hasPdfChanged = computed(() => pdf.value instanceof File)
const hasGaleryChanged = computed(() => image_galery.value.some(item => item instanceof File))


function isFile(value: unknown): value is File {
  return typeof File !== 'undefined' && value instanceof File
}

const emit = defineEmits<{ success: [] }>()

const { fetchResult, result, pending, error } = useApiRequests(
  `/_painel/familias/view/${route.params.id}`,
  'GET'
)

const { fetchResult: submitForm, result: resultForm, pending: pendingForm, error: errorForm } = useApiRequests(
  `/_painel/familias/${route.params.id}`,
  'PUT',
  state,
  'none'
)

const previewImagem = ref<string>()
const previewImagemMobile = ref<string>()

function updatePreview(file: File | string | undefined, previewRef: Ref<string | undefined>) {
  if (previewRef.value?.startsWith('blob:')) URL.revokeObjectURL(previewRef.value)
  previewRef.value = file instanceof File ? URL.createObjectURL(file) : file ?? undefined
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

function addImageGalerie(){
  image_galery.value.push('')
}

function delImageGalerie(id:number){
  image_galery.value.splice(id, 1)
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
  {pdf},
  "formdata"
)

const { fetchResult: fetchGalery, pending: pendingGallery, error: errorGalery } = useApiRequestsGallery(
  `/_painel/familias/imagens/${route.params.id}`,
  'POST',
  "imagens",
  uploadImageGallery
)

function changeImage(index: number){
  image_galery.value[index] = ''
}


async function onSubmit() {
   await submitForm() // rota principal de alteração do produto (sempre chamada)
  if (Object.keys(error.value).length) return

  if (hasImagePrincipalChanged.value) {
    await fetchImagePrincipal() // rota separada para imagem principal
    if (Object.keys(errorImagePrincipal.value).length) return
  }

  if (hasPdfChanged.value) {
    // alert('deve subir o pdf')
    await fetchPdf() // rota separada para pdf
    if (Object.keys(errorPdf.value).length) return
  }

  if (hasGaleryChanged.value) {
    await fetchGalery() // rota separada para galeria
    if (Object.keys(errorGalery.value).length) return
  }
  if (!Object.keys(error.value).length) {
    await fetchResult()
    populateForm()
    emit('success')
  }
}

function namePdf(item: string){
  const res = item.split("/").pop()
  return res
}

import ConfirmModal from '~/components/ConfirmModal.vue'
const overlay = useOverlay()
const confirmModal = overlay.create(ConfirmModal)
const toast = useToast()

async function deletePDF() {
  const ok = await confirmModal.open({
    title: 'Excluir PDF',
    description: 'Deseja realmente excluir este arquivo?'
  })

  if (ok) {
    const { fetchResult: fetchDelete, pending: pendingDelete } = useApiRequests(`/_painel/familias/pdf/${route.params.id}`, 'DELETE')
    await fetchDelete()
    if (!pendingDelete.value) {
      toast.add({
        title: 'Sucesso',
        description: 'Arquivo PDF excluído com sucesso!',
        color: 'success',
        duration: 1300,
      })
      await fetchResult()
      populateForm()
    }
  } return
}

async function deleteImg(id: string | number) {
  const ok = await confirmModal.open({
    title: 'Excluir Imagem',
    description: 'Deseja realmente excluir esta imagem?'
  })

  if (ok) {
    // alert(route.params.id + ' - ' + id)
    const { fetchResult: fetchDeleteImg, pending: pendingDeleteImg } = useApiRequests(`/_painel/familias/imagens/${route.params.id}/${id}`, 'DELETE')
    await fetchDeleteImg()
    if (!pendingDeleteImg.value) {
      toast.add({
        title: 'Sucesso',
        description: 'Imagem excluída com sucesso!',
        color: 'success',
        duration: 1300,
      })
      await fetchResult()
      populateForm()
    }
  } return
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
            <UInput v-model="state.codigo" maxlength="255" class="w-full" disabled :ui="{base: 'bg-gray-200'}" />
          </UFormField>
        </div>
        <div class="col-span-12">
          <!-- {{ pdf }}
          {{ hasPdfChanged }} -->
          <UFormField label="PDF Técnico:" name="pdf">
            <!-- {{ pdf }} -->
            <UButton v-if="typeof pdf === 'string'" :href="pdf" target="_blank" icon="i-lucide-file-text" color="black" class="mr-2 bg-gray-400 hover:bg-white hover:text-black" size="xs">
              Visualizar PDF
            </UButton>
            <UTooltip text="Deletar / Alterar PDF">
              <UButton v-if="typeof pdf === 'string'" icon="i-lucide-x" color="error" size="xs" :ui="{base: 'cursor-pointer'}" @click="deletePDF" />
            </UTooltip>
            <UFileUpload
              v-if="typeof pdf !== 'string'"
                layout="list"
                position="inside"
                :model-value="isFile(pdf) ? pdf : undefined"
                @update:model-value="(f) => pdf = f ?? ''"
                accept=".pdf,.pdfx"
                placeholder="Selecione um arquivo PDF"
                class="w-full"
            />
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
        <div class="col-span-12 my-6">
          <div class="grid grid-cols-12 gap-4">
            <!-- {{ image_galery }} -->
            <div class="col-span-12 md:col-span-3 relative mb-3" v-for="(image, index) in image_galery" :key="index" >
              <UFormField :label="index == 0 ? 'Imagem Principal': `${index + 1}º Imagem`" name="imagem">
                  <div class="flex items-center gap-3">
                      <!-- <img v-if="previewImagem" :src="previewImagem" class="h-12 w-12 object-cover rounded"> -->
                      <img v-if="isImageObject(image)" :src="image?.imagem" class="max-h-22 rounded-xl w-full object-cover">
                      <UFileUpload
                          v-if="!isImageObject(image)"
                          :model-value="isFile(image) ? image : undefined"
                          @update:model-value="(f) => image_galery[index] = f ?? ''"
                          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                          placeholder="Selecione uma imagem"
                          class="w-full"
                      />
                  </div>
              </UFormField>
              <template v-if="isImageObject(image) && image.id !== null && image.id !== undefined">
                <UTooltip text="Alterar Imagem">
                  <UButton icon="i-lucide-refresh-ccw" color="neutral" size="xs" class="absolute top-4 -right-2 cursor-pointer rounded-full" @click="changeImage(index)" />
                </UTooltip>
                <UTooltip text="Deletar Imagem">
                  <UButton icon="i-lucide-trash" color="error" size="xs" class="absolute top-11 -right-2 cursor-pointer rounded-full" @click="deleteImg(image.id)" />
                </UTooltip>
              </template>

              <UButton v-if="!isImageObject(image)" icon="i-lucide-trash" color="error" size="xs" class="absolute top-11 -right-2 cursor-pointer rounded-full" @click="delImageGalerie(index)" />
            </div>
            <div class="col-span-12 md:col-span-3 bg-blueFortune rounded-lg justify-center align-items-center flex">
              <UButton label="ADICIONAR IMAGEM" size="sm" color="white" :ui="{base: 'cursor-pointer min-h-24'}" @click="addImageGalerie" />
            </div>
          </div>
        <!-- <pre>{{ state }}</pre> -->
        </div>
        <div class="col-span-12 text-right">
            <UButton type="submit" :loading="pending" :ui="{base: 'cursor-pointer py-2.5 px-5'}">
              Salvar
            </UButton>
        </div>
    </div>
</UForm>
</template>
