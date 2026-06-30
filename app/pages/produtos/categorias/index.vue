<template>
    Banners
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'interna',
})

const titlePage = useState('titlePage', () => {return {title: 'Categorias', categorie: ''}})
titlePage.value = {title: 'Categorias', categorie: 'Produtos'}
</script>
