<template>
  <div class="my-5">
    <ListBanners />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'interna',
})

const titlePage = useState('titlePage', () => {return {title: 'Banners', categorie: null}})
titlePage.value = {title: 'Banners', categorie: null}
</script>
