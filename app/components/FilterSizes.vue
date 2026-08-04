<script setup lang="ts">
const config = useRuntimeConfig()
const store = useLoginStore()
const items = reactive<SizeItem[]>([
  { id: 0, titulo: 'Todos'}
])

const { data } = await useFetch('/_painel/familias/show', {
  baseURL: config.public.apiBase,
  method: 'GET',
  headers: store.user.token ? {
      Authorization: `Bearer ${store.user.token}`
  } : {},
})

const emit = defineEmits<{
  (e: 'update:size', value: SizeItem['id'] | undefined): void
}>()

const value = ref<SizeItem['id']>(0)

function onSelect(val: SizeItem['id'] | undefined) {
  emit('update:size', val)
}

interface SizeItem {
  id: string | number
  titulo: string
}

if (data.value) {
  const res = data.value as { data?: SizeItem[] } | SizeItem[]
  const lista = Array.isArray(res) ? res : (res.data ?? [])
  items.splice(1, items.length - 1, ...lista)
}


</script>


<template>
  <USelectMenu
  v-model="value"
  icon="i-lucide-funnel"
  size="md"
  :items="items"
  label-key="titulo"
  value-key="id"
  class="w-full"
  placeholder="Filtrar por Pneu"
  @update:model-value="onSelect"
/>
</template>
