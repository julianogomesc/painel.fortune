<script setup lang="ts">
const store = useLoginStore()
</script>

<template>
  <div class="bg-blueFortune/80 flex flex-col justify-between min-h-62 h-full rounded-2xl p-8 text-white bg-size-[60%] bg-[url('./images/mechanicperson.webp')] bg-no-repeat bg-position-[right_-3em_bottom_-3em]  md:bg-position-[right_-4em_bottom_-3em] xl:bg-position-[right_-4em_top_-1em] xl:bg-size-[45%]!">
    <div>
      <span class="block text-blue-200 text-sm">Bem vindo!</span>
      <strong class="text-blue-50 text-xl">
        {{ store.user?.user?.nome }}
      </strong>
      <p class="max-[321px]:pr-18 pr-38 md:pr-0 lg:pr-46 xl:pr-52 2xl:pr-64 text-blueFortuneDark">
        O seu acesso é individual, jamais compartilhe seus dados de acesso
      </p>
    </div>
    <div>
      <UTooltip text="Configurações">
        <UButton to="/configuracoes" class="cursor-pointer" icon="i-lucide-user" size="sm" variant="solid" color="blueFortune" />
      </UTooltip>
    </div>
  </div>
</template>