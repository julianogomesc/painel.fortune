<template>
    <FormsTireEdit @success="onSuccess"/>
</template>

<script setup lang="ts">
import type { layoutPageType } from '~/types/layoutPage';

definePageMeta({
  layout: 'interna',
})

const toast = useToast()

const titlePage = useState<layoutPageType>('titlePage', () => {
  return {
    title: 'Pneus',
    categorie: null,
    description: null,
    colorButton: null,
  }
})
titlePage.value = {title: 'Pneus', categorie: 'Produtos', description: 'Gerenciar dados do pneu', textButton: 'Voltar', urlButton: '/produtos/pneus', colorButton: 'neutral'}

function onSuccess(){
  toast.add({
    title: 'Sucesso',
    description: 'Pneu salvo com sucesso!',
    color: 'success',
    duration: 1500,
  })
  // navigateTo('/produtos/pneus')
}
</script>
