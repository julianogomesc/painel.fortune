<template>
  <div class="my-5">
    <!-- <ListBanners /> -->
  </div>
</template>

<script setup lang="ts">
import type { layoutPageType } from '~/types/layoutPage';

definePageMeta({
  layout: 'interna',
})

const titlePage = useState<layoutPageType>('titlePage', () => {
  return {
    title: 'Banners',
    categorie: null,
    description: null,
    colorButton: null,
  }
})
titlePage.value = {title: 'Banners', categorie: null, description: 'Crie, edite e ou remova banners do site.', urlButton: '/banners', textButton: 'Voltar', colorButton: 'neutral'}
</script>
