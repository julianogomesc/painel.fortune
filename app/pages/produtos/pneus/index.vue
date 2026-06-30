<template>
    Pneus
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'interna',
})

const titlePage = useState('titlePage', () => {return {title: 'Pneus', categorie: ''}})
titlePage.value = {title: 'Pneus', categorie: 'Produtos'}
</script>
