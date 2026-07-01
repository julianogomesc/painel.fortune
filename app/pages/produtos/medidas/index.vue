<template>
    Medidas
</template>

<script setup lang="ts">
import type { layoutPageType } from '~/types/layoutPage';

definePageMeta({
  layout: 'interna',
})

const titlePage = useState<layoutPageType>('titlePage', () => {
  return {
    title: 'Medidas',
    categorie: null,
    description: null,
  }
})
titlePage.value = {title: 'Medidas', categorie: 'Produtos', description: 'Gerencie suas medidas de Pneus'}
</script>
