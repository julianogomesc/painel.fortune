<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Column } from '@tanstack/vue-table'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UAvatarGroup = resolveComponent('UAvatarGroup')
const UAvatar = resolveComponent('UAvatar')

type Categorias = {
  id: string | number
  imagem?: string
  descricao?: string
  nome: string
  slug: string
  situacao: '0' | '1'
}

const qtdeRows = ref(10)
const termSearch = ref('')

const endpoint = computed(() => `_painel/categorias/show`)

function handleSearch(value: string) {
  termSearch.value = value

  if (!value.trim()) {
    searchData.value = []
    void fetchResult()
    return
  }

  void searchCategories(value)
}

const { fetchResult, pending, result, page, rows, total } = useApiRequestsPaginated(endpoint, qtdeRows.value)

const searchData = ref<Categorias[]>([])
const data = computed<Categorias[]>(() => {
  if (termSearch.value.trim()) {
    return searchData.value
  }

  return result.value as Categorias[]
})

watch(page, () => fetchResult())

onMounted(() => {
  fetchResult()
})

const columns: TableColumn<Categorias>[] = [
  {
    accessorKey: 'imagem',
    header: 'IMAGEM',
    cell: ({ row }) => {
      return h(UAvatarGroup, { size: '3xl' }, () => [
        h(UAvatar, {
          src: row.getValue('imagem') as string,
          class: '-mr-4',
          alt: `${row.original.nome} (desktop)`
        })
      ])
    }

  },
  {
      accessorKey: 'nome',
      header: ({ column }) => getHeader(column, 'CATEGORIA')
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
              navigateTo(`/produtos/categorias/editar/${row.original.id}`)
            }
          },
          {
            label: 'Excluir',
            icon: 'i-lucide-trash-2',
            color: 'error' as const,
            onSelect: () => {
              deleteBanner(row.original.id)
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

import ConfirmModal from '~/components/ConfirmModal.vue'
const overlay = useOverlay()
const confirmModal = overlay.create(ConfirmModal)
const toast = useToast()

async function deleteBanner(id: string | number) {
  const ok = await confirmModal.open({
    title: 'Excluir Categoria',
    description: 'Deseja realmente excluir esta categoria?'
  })

  if (ok) {
    const { fetchResult: fetchDelete, pending: pendingDelete } = useApiRequests(`/_painel/categorias/${id}`, 'DELETE')
    await fetchDelete()
    if (!pendingDelete.value) {
      toast.add({
        title: 'Sucesso',
        description: 'Categoria excluída com sucesso!',
        color: 'success',
        duration: 1300,
      })
      fetchResult()
    }
  } return
}

function getHeader(column: Column<Categorias>, label: string) {
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

async function searchCategories(term = termSearch.value.trim()) {
  if (!term) {
    searchData.value = []
    await fetchResult()
    return
  }

  const { fetchResult: fetchSearch, result: searchResult } = useApiRequests(
    `/_painel/categorias/show?page=1&rows=10&search=${encodeURIComponent(term)}`,
    'GET'
  )

  await fetchSearch()

  const payload = searchResult.value as { data?: Categorias[] } | Categorias[]
  searchData.value = Array.isArray(payload) ? payload : payload?.data ?? []
}

const sorting = ref([
  {
    id: 'nome',
    desc: false
  }
])
</script>

<template>
  <Loading v-if="pending" />
  <div class="grid grid-cols-12 gap-2 mb-3">
    <div class="col-span-12 lg:col-span-4 lg:col-start-9 relative">
      <InputSearch @search="handleSearch" />
    </div>
  </div>
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
      :ui="{
          item: 'cursor-pointer',
          first: 'cursor-pointer',
          prev: 'cursor-pointer',
          next: 'cursor-pointer',
          last: 'cursor-pointer',
        }"
    />
  </div>
</template>
