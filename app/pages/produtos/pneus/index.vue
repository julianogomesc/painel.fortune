<template>
    Pneus
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'interna',
})

const titlePage = useState<{
  title: string
  categorie?: string | null
  description?: string | null
  urlButton?: string | null
  textButton?: string | null
}>('titlePage', () => {
  return {
    title: 'Pneus',
    categorie: null,
    description: null,
  }
})
titlePage.value = {title: 'Pneus', categorie: 'Produtos', description: 'Gerencie seus modelos de Pneus'}
</script>
