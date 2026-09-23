<template>
    <FormsTireEdit @success="onSuccess" @error="onError"/>
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

type APIErrors = Record<string, string | string[]>

function onError(data: APIErrors){
  Object.entries(data).forEach(([, value]) => {
    const message = Array.isArray(value) ? value.join(', ') : value
    const title = message.split(':') || value
    toast.add({
      title: `ERRO - ${title[0] ? title[0].toUpperCase() : title}`,
      description: title[1] || title[0],
      color: 'error',
      duration: 1500,
    })
  })
  // navigateTo('/produtos/pneus')
}
</script>
