<template>
    <div class="min-h-screen bg-gray-50 w-full">        
        <div class="grid grid-cols-12 gap-0">
            <div class="col-span-12 md:col-span-4 px-5 bg-gray-100 min-h-screen">
                <div class="flex items-center justify-center h-full flex-col">
                    <img src="/images/logo-fortune.webp" alt="Fortune Pneus" class="mb-12 max-w-62">
                    <FormsLogin />
                </div>
            </div>
            <div class="col-span-12 hidden md:block md:col-span-8 bg-[url('/images/bglogin.webp')] bg-cover bg-center bg-no-repeat"></div>
        </div>        
    </div>

</template>

<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

useHead({
    title: 'Gestão - Fortune Pneus',
})
</script>