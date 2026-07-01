<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Column } from '@tanstack/vue-table'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

type Banners = {
  imagem: string
  titulo: string
  situacao: '0' | '1'
  id: string
}

const qtdeRows = ref(10)

const endpoint = computed(() => `_painel/banners/show`)

const { fetchResult, pending, result, page, rows, total } = useApiRequestsPaginated(endpoint, qtdeRows.value)

const data = computed<Banners[]>(() => result.value as Banners[])

watch(page, () => fetchResult())

onMounted(() => {
  fetchResult()
})

const columns: TableColumn<Banners>[] = [
//   {
//     accessorKey: 'id',
//     header: ({ column }) => getHeader(column, 'ID'),
//     cell: ({ row }) => `#${row.getValue('id')}`
//   },
  {
    accessorKey: 'imagem',
    header: 'IMAGEM',
    cell: ({ row }) => {
      return h('img', { src: row.getValue('imagem'), class: 'max-h-15 h-auto' })
    }
  },
  {
      accessorKey: 'titulo',
      header: ({ column }) => getHeader(column, 'BANNER')
    },
    {
      accessorKey: 'situacao',
      header: ({ column }) => getHeader(column, 'STATUS'),
      cell: ({ row }) => {
        const color = {
          1: 'success' as const,
          0: 'error' as const,
        }[row.getValue('situacao') as string]
  
        return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
          row.getValue('situacao') == '1' ? 'Ativo' : 'Inativo'
        )
      }
    },
  {
    id: 'acoes',
    header: 'AÇÕES',
    meta: {
      class: {
        th: 'text-right',
        td: 'text-right'
      }
    },
    cell: ({ row }) => {
      return h(UDropdownMenu, {
        'aria-label': 'Ações do banner',
        items: [
          {
            label: 'Editar',
            icon: 'i-lucide-pencil',
            onSelect: () => {
              navigateTo(`/banners/editar/${row.original.id}`)
            }
          },
          {
            label: 'Excluir',
            icon: 'i-lucide-trash-2',
            color: 'error' as const,
            onSelect: () => {
              console.log('Excluir', row.original.id)
            }
          }
        ]
      },
      () => h(UButton, {
        icon: 'i-lucide-ellipsis-vertical',
        color: 'neutral',
        variant: 'ghost',
        'aria-label': 'Abrir menu de ações'
      }))
    }
  }
]

function getHeader(column: Column<Banners>, label: string) {
  const isSorted = column.getIsSorted()

  return h(
    UDropdownMenu,
    {
      content: {
        align: 'start'
      },
      'aria-label': 'Actions dropdown',
      items: [
        {
          label: 'Asc',
          type: 'checkbox',
          icon: 'i-lucide-arrow-up-narrow-wide',
          checked: isSorted === 'asc',
          onSelect: () => {
            if (isSorted === 'asc') {
              column.clearSorting()
            } else {
              column.toggleSorting(false)
            }
          }
        },
        {
          label: 'Desc',
          icon: 'i-lucide-arrow-down-wide-narrow',
          type: 'checkbox',
          checked: isSorted === 'desc',
          onSelect: () => {
            if (isSorted === 'desc') {
              column.clearSorting()
            } else {
              column.toggleSorting(true)
            }
          }
        }
      ]
    },
    () =>
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label,
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5 data-[state=open]:bg-elevated',
        'aria-label': `Sort by ${isSorted === 'asc' ? 'descending' : 'ascending'}`
      })
  )
}

const sorting = ref([
  {
    id: 'titulo',
    desc: false
  }
])
</script>

<template>
  <UTable v-model:sorting="sorting" :data="data" :columns="columns" :loading="pending" class="flex-1">
    <template #empty>
      <div class="text-center text-gray-400 py-0">Nenhum registro encontrado!</div>
    </template>
  </UTable>

  <div v-if="total > qtdeRows" class="flex justify-end mt-4">
    <UPagination
      v-model:page="page"
      :total="total"
      :items-per-page="rows"
    />
  </div>
</template>
