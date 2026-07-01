<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from '#app'

defineProps<{
  mobile?: boolean
}>()

const isOpen = ref(false)
const route = useRoute()

// Close menu when route changes
watch(() => route.path, () => {
  isOpen.value = false
})

const items = [
  {
    label: 'Dashboard',
    class:'py-2',
    icon: 'i-lucide-house',
    to: '/dashboard'
  },
  {
    label: 'Banners',
    class:'py-2',
    icon: 'i-lucide-image',
    to: '/banners'
  },
  {
    label: 'Produtos',
    class:'py-2',
    icon: 'i-lucide-shopping-cart',
    children: [
      {
        label: 'Categorias',
        class:'py-2',
        icon: 'i-lucide-layers',
        to: '/produtos/categorias'
      },
      {
        label: 'Pneus',
        class:'py-2',
        icon: 'i-lucide-package',
        to: '/produtos/pneus'
      },
      {
        label: 'Medidas',
        class:'py-2',
        icon: 'i-lucide-ruler-dimension-line',
        to: '/produtos/medidas'
      }
    ]
  }
]
</script>

<template>
  <div>
    <!-- Desktop Navigation (Default/Non-mobile view) -->
    <template v-if="!mobile">
      <UNavigationMenu
        orientation="vertical"
        :items="items"
        color="blueFortune"
        highlight highlight-color="blueFortune"
      />
    </template>

    <!-- Mobile Navigation Trigger & Drawer -->
    <template v-else>
      <!-- Burger Button -->
      <UButton
        icon="i-lucide-menu"
        color="neutral"
        variant="ghost"
        size="lg"
        class="cursor-pointer text-blueFortuneDark"
        @click="isOpen = true"
      />

      <!-- Drawer Portal (teleport to body to avoid z-index/overflow issues) -->
      <Teleport to="body">
        <!-- Backdrop -->
        <Transition
          enter-active-class="transition-opacity ease-out duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity ease-in duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="isOpen"
            class="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            @click="isOpen = false"
          />
        </Transition>

        <!-- Drawer Content -->
        <Transition
          enter-active-class="transition-transform ease-out duration-300"
          enter-from-class="-translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition-transform ease-in duration-200"
          leave-from-class="translate-x-0"
          leave-to-class="-translate-x-full"
        >
          <div
            v-if="isOpen"
            class="fixed inset-y-0 left-0 w-72 bg-gray-100 z-50 p-5 flex flex-col justify-between shadow-xl"
          >
            <div>
              <!-- Header inside Drawer -->
              <div class="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
                <img src="/images/logo-fortune.webp" alt="Fortune Pneus" class="max-w-36">
                <UButton
                  icon="i-lucide-x"
                  color="neutral"
                  variant="ghost"
                  class="cursor-pointer"
                  @click="isOpen = false"
                />
              </div>

              <!-- Navigation Links -->
              <UNavigationMenu
                orientation="vertical"
                :items="items"
                color="blueFortune"
                highlight highlight-color="blueFortune"
              />
            </div>

            <!-- Logout & Settings inside Drawer -->
            <div class="relative h-12">
              <LogoutConfig />
            </div>
          </div>
        </Transition>
      </Teleport>
    </template>
  </div>
</template>