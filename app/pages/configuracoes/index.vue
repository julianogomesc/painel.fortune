<template>
    Pneus
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'interna',
})

const titlePage = useState('titlePage', () => {return {title: 'Configurações', categorie: ''}})
titlePage.value = {title: 'Configurações', categorie: ''}
</script>
