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
    <!-- <div class="col-span-12 md:col-span-5 lg:col-span-4" v-if="props.urlImage == '' && chnImage || imagem">
      <img :src="props.urlImage" alt="Imagem do perfil">  
    </div> -->
    <div :class="['col-span-12'] ">
      <UFileUpload
          v-model="imagem"
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          placeholder="Selecione uma imagem"
          class="w-full mb-3"
        />
        <!-- <UTooltip text="Cancelar" v-if="props.data">
            <UButton icon="i-lucide-arrow-left" variant="outline" color="neutral"  class="mx-auto px-2 pb-0.5 block cursor-pointer" @click="changeFn(false)"/>
        </UTooltip> -->
    </div>
  </div>
</template>