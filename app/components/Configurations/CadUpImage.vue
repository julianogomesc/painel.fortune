<script setup lang="ts">

const props = defineProps({
  urlImage: {
    type: String,
    default: ''
  },
  chnImage: {
    type: Boolean,
    default: false
  }
})

const imagem = defineModel<File | File | null>({
  default: null
})

</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div :class="['col-span-12'] ">
      <UFileUpload
          v-model="imagem"
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          placeholder="Selecione uma imagem"
          class="w-full mb-3"
        />
    </div>
  </div>
</template>