<script setup lang="ts">
const state = reactive({
  imagem: undefined,
})

const {user} = useLoginStore()

const previewImagem = ref<string>()
const loadingPreview = ref(false)

function updatePreview(file: File | string | undefined, previewRef: Ref<string | undefined>) {
  if (previewRef.value?.startsWith('blob:')) URL.revokeObjectURL(previewRef.value)
  previewRef.value = file instanceof File ? URL.createObjectURL(file) : (file || undefined)
}

import ConfirmModal from '~/components/ConfirmModal.vue'
const overlay = useOverlay()
const toast = useToast()
const router = useRouter()
const confirmModal = overlay.create(ConfirmModal)

const pendingImage = ref(false)

async function saveImage(id: string | number) {
  const ok = await confirmModal.open({
    title: `Alterar imagem de perfil`,
    description: 'Deseja realmente alterar a sua imagem de perfil?'
  })

  if (ok && state.imagem) {
    const { userSaveImage, result, error } = useApiRequests(`/_painel/users/avatar/${id}`, 'POST', state, 'formdata' )
    await userSaveImage()

    const response = result.value as {success: boolean}

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
    if (response.success) {
      toast.add({
        title: 'Sucesso',
        description: 'Imagem alterada com sucesso!',
        color: 'success',
        duration: 1600,
      })
      pendingImage.value = true
      setTimeout(() => {
        router.go(0)
      }, 1500)
    }
  } return
}

const changeImage = ref(false)
function changeFn(value: boolean){
    changeImage.value = value
}

watch(() => state.imagem, (file) => {
    if(file){
        loadingPreview.value = true
        changeImage.value = false 
        updatePreview(file, previewImagem)
    }
})
</script>

<template>
  <UModal :dismissible="false" title="Alterar Imagem do Perfil" :ui="{content: 'sm:max-w-xl'}">
    <template #body>
      <Loading v-if="pendingImage" />
      <div class="mb-3" v-if="previewImagem && !changeImage">
          <img :src="previewImagem" class="w-auto max-h-62 mx-auto object-cover rounded mb-2 block" @load="loadingPreview = false" @error="loadingPreview = false">
          <div class="flex justify-center">
            <UTooltip text="Alterar Imagem">
              <UButton icon="i-lucide-refresh-cw" variant="outline" color="blueFortune"  class="mr-4 px-2 pb-0.5 block cursor-pointer" @click="changeFn(true)"/>
            </UTooltip>
            <UTooltip text="Salvar Imagem">
              <UButton icon="i-lucide-image-up" variant="outline" color="success"  class="px-2 pb-0.5 block cursor-pointer" @click="saveImage(user.user?.id)"/>
            </UTooltip>
          </div>
        </div>
      <div class="w-full" v-else>
          <ConfigurationsCadUpImage v-model="state.imagem" :url-image="previewImagem" :chn-image="changeImage" />
          <!-- <UTooltip text="Cancelar" v-if="props.data">
              <UButton icon="i-lucide-arrow-left" variant="outline" color="neutral"  class="mx-auto px-2 pb-0.5 block cursor-pointer" @click="changeFn(false)"/>
          </UTooltip> -->
      </div>
    </template>
  </UModal>
</template>