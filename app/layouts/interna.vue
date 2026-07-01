<template>
    <div class="max-w-full md:min-h-screen bg-gray-50 flex flex-col md:flex-row">
        <!-- Mobile Header -->
        <div class="flex items-center justify-between md:hidden bg-gray-100 border-b border-gray-200 px-4 py-3 sticky top-0 z-40 w-full">
            <img src="/images/logo-fortune.webp" alt="Fortune Pneus" class="max-w-36">
            <MenuLeft :mobile="true" />
        </div>

        <div class="grid grid-cols-12 w-full flex-1">
            <!-- Desktop Sidebar -->
            <div class="hidden md:block md:col-span-3 lg:col-span-2 bg-gray-100 min-h-screen px-3 relative border-r border-gray-200">
                <div class="block mb-3 pb-4 mt-4 border-b border-gray-200">
                    <img src="/images/logo-fortune.webp" alt="Fortune Pneus" class="max-w-44 mx-2">
                </div>
                <MenuLeft />
                <LogoutConfig />
            </div>

            <!-- Context Title Column -->
            <div class="col-span-12 md:col-span-3 lg:col-span-2 md:min-h-screen bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 py-5" v-if="route.path !== '/dashboard'">
                <span v-if="titlePage.categorie" class="uppercase mx-5 text-blueFortune tracking-[0.1em] block text-[0.6em]">
                    {{ titlePage.categorie }} 
                </span>
                <h1 :class="['mx-5 font-medium uppercase text-2xl text-blueFortuneDark tracking-tight', titlePage.categorie ? 'mt-0' : '']">{{ titlePage.title }}</h1>
                <span v-if="titlePage.description" class="mx-5 mt-2 text-gray-500 font-light block text-sm">{{ titlePage.description }}</span>
                <div v-if="titlePage.urlButton && titlePage.textButton" class="mx-5 mt-4">
                    <UButton :to="titlePage.urlButton" variant="outline" :color="titlePage.colorButton || 'blueFortune'">{{ titlePage.textButton }}</UButton>
                </div>
            </div>

            <!-- Content Area -->
            <div :class="['p-4 md:p-6', route.path == '/dashboard' ? 'col-span-12 md:col-span-9 lg:col-span-10' : 'col-span-12 md:col-span-6 lg:col-span-8']">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const titlePage = useState('titlePage', () => {return {title: 'Banners', categorie: null, description: null, urlButton: null, textButton: null, colorButton: null}})
</script>
