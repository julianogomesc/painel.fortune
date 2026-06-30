<script setup lang="ts">
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
  },
{
    label: 'Configurações',
    class:'py-2',
    icon: 'i-lucide-settings',
    to: '/configuracoes'
  }
]
</script>

<template>
  <UNavigationMenu
    orientation="vertical"
    :items="items"
    color="blueFortune"
    highlight highlight-color="blueFortune"
  />
</template>