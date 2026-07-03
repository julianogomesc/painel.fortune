<template>
  <div class="mb-5">
    <FormsNewBanner @success="onSuccess"/>
  </div>
</template>

<script setup lang="ts">
import type { layoutPageType } from '~/types/layoutPage';

definePageMeta({
  layout: 'interna',
})

const toast = useToast()

const titlePage = useState<layoutPageType>('titlePage', () => {
  return {
    title: 'Banners',
    categorie: null,
    description: null,
    colorButton: null,
  }
})
titlePage.value = {title: 'Banners', categorie: null, description: 'Crie, edite e ou remova banners do site.', urlButton: '/banners', textButton: 'Voltar', colorButton: 'neutral'}

function onSuccess(){
  toast.add({
    title: 'Sucesso',
    description: 'Banner salvo com sucesso!',
    color: 'success',
    duration: 1500,
  })
  navigateTo('/banners')
}
</script>
