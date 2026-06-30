<script setup lang="ts">
definePageMeta({
  layout: "interna",
})

const {acao, id} = useRoute().params

console.log(acao)
console.log(id)
</script>
<template>

    {{ acao }} {{ id }}
    
</template>