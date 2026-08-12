<script setup lang="ts">
const qtdeRows = ref(10)
const endpoint = computed(() => `_painel/categorias/show`)

const { fetchResult, pending, result, page, rows, total } = useApiRequestsPaginated(endpoint, qtdeRows.value)

onMounted(() => {
  fetchResult()
})


</script>

<template>
  <div class="bg-gray-200 flex flex-col justify-between h-full rounded-2xl p-8 text-black bg-[url('./images/maspireside.webp')] bg-no-repeat bg-right bg-size-[55%] lg:bg-size-[45%] 2xl:pr-48 relative">
    <Loading v-if="pending" />
    <div>
      <span class="block text-gray-600 px-2 text-sm mb-3">Categorias Registradas:</span>
      <UButton v-for="cat in result" :to="`/produtos/categorias/editar/${cat.id}`" class="cursor-pointer mr-3 mb-2" :label="cat.nome" variant="soft" color="neutral" />      
    </div>
    <div>
      <UTooltip text="Ver Todas">
        <UButton to="/produtos/categorias" class="cursor-pointer" icon="i-lucide-layers" size="sm" variant="solid" color="blueFortune" />
      </UTooltip>
    </div>
  </div>
</template>