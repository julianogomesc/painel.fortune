<template>
    Banners
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'interna',
})

const titlePage = useState('titlePage', () => {return {title: 'Medidas', categorie: ''}})
titlePage.value = {title: 'Medidas', categorie: 'Produtos'}
</script>
