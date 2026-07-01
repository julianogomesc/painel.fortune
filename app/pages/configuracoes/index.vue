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
    title: 'Banners',
    categorie: null,
    description: null,
  }
})
titlePage.value = {title: 'Configurações', categorie: null, description: 'Gerencie suas informações e configurações'}
</script>
