<template>
    Categorias
</template>

<script setup lang="ts">
import type { layoutPageType } from '~/types/layoutPage';

definePageMeta({
  layout: 'interna',
})

const titlePage = useState<layoutPageType>('titlePage', () => {
  return {
    title: 'Categorias',
    categorie: null,
    description: null,
    colorButton: null,
  }
})
titlePage.value = {title: 'Categorias', categorie: 'Produtos', description: 'Gerencie suas categorias de produtos', textButton: 'Voltar', urlButton: '/produtos/categorias', colorButton: 'neutral'}
</script>
