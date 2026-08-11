<script setup lang="ts">
  definePageMeta({
    layout: "interna",
  })
</script>
<template>
    <h1 class="text-2xl font-bold uppercase text-gray-700 px-7 mb-6">Dashboard</h1>
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12 md:col-span-6 lg:col-span-7" >
        <WelcomeUser />
      </div>
      <div class="col-span-12 md:col-span-6 lg:col-span-5" >
        <CloudCategories />
      </div>
    </div>

    <div class="grid grid-cols-12 gap-12 mt-8">
      <div class="col-span-12 md:col-span-6">
        <h3 class="my-5 font-bold text-2xl uppercase tracking-tight px-5">Medidas</h3>
        <ListMedidas />
      </div>
      <div class="col-span-12 md:col-span-6">
        <h3 class="my-5 font-bold text-2xl uppercase tracking-tight px-5">Pneus</h3>
        <ListPneus />
      </div>
    </div>
</template>
