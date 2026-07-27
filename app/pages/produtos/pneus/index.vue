<template>
    <ListPneus />
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
  }
})
titlePage.value = {title: 'Pneus', categorie: 'Produtos', description: 'Gerencie seus modelos de pneus.', textButton: 'Novo Pneu', urlButton: ''}
</script>
