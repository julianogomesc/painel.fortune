<template>
    <div class="max-w-full min-h-screen">
        <div class="grid grid-cols-12">
            <div class="col-span-12 md:col-span-3 lg:col-span-2 bg-gray-100 min-h-screen px-3">
                <div class="block mb-3 pb-4 mt-4 border-b border-gray-200">
                    <img src="/images/logo-fortune.webp" alt="Fortune Pneus" class="max-w-44 mx-2">
                </div>
                <MenuLeft />
            </div>
            <div class="col-span-12 md:col-span-2 lg:col-span-2 min-h-screen bg-gray-50" v-if="route.path !== '/dashboard'">
                <span v-if="titlePage.categorie" class="uppercase mx-5 mt-5 text-blueFortune  tracking-[0.1em] block text-[0.6em]">
                    {{ titlePage.categorie }} 
                </span>
                <h1 :class="['mx-5 font-medium uppercase text-2xl text-blueFortuneDark tracking-tight', titlePage.categorie ? 'mt-0' : 'mt-5']">{{ titlePage.title }}</h1>
            </div>
            <div :class="['min-h-screen p-4', route.path == '/dashboard' ? 'col-span-12 md:col-span-9 lg:col-span-10' : 'col-span-12 md:col-span-7 lg:col-span-8']">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const titlePage = useState('titlePage', () => {return {title: 'Banners', categorie: null}})
</script>
