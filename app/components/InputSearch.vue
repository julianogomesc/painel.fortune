<script setup lang="ts">
const model = ref('')

const emit = defineEmits<{
  search: [value: string]
}>()

function handleInput(value: string) {
  model.value = value

  if (!value.trim()) {
    emit('search', '')
  }
}
</script>

<template>
  <div class="relative">
    <UIcon name="i-lucide-search" class="absolute top-2 left-1.5 z-50" />
    <UInput
      v-model="model"
      class="d-inline w-full"
      :ui="{ base: 'outline-blueFortune/25 px-7' }"
      placeholder="Pressione ENTER após digitar..."
      @update:model-value="handleInput"
      @keydown.enter.prevent="emit('search', model)"
    />
  </div>
</template>
