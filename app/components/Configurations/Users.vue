<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Column } from '@tanstack/vue-table'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UAvatar = resolveComponent('UAvatar')

type Usuarios = {
  id: string | number
  nome: string
  imagem?: string
  email: string
  perfil?: string | number
  situacao: '0' | '1'
}

const qtdeRows = ref(10)
const termSearch = ref('')

const endpoint = computed(() => `_painel/users/show?page=1&rows=10`)

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

const searchData = ref<Usuarios[]>([])
const data = computed<Usuarios[]>(() => {
  if (termSearch.value.trim()) {
    return searchData.value
  }

  return result.value as Usuarios[]
})

watch(page, () => fetchResult())

onMounted(() => {
  fetchResult()
})

const usersStore = useUsersStore()

watch(() => usersStore.shouldRefresh, (val) => {
    if (val) {
        fetchResult()
        usersStore.resetRefresh()
    }
})


const columns: TableColumn<Usuarios>[] = [
  {
    accessorKey: 'nome',
    header: ({ column }) => getHeader(column, 'USUÁRIO'),
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          src: row.original.imagem,
          size: 'lg',
          alt: row.original.nome
        }),
        h('div', undefined, [
          h('p', {class: 'font-medium text-highlighted'}, row.original.nome),
          h('p', {class: ''}, row.original.email),
        ])
      ])
    }
  },
  {
    accessorKey: 'perfil',
    header: ({ column }) => getHeader(column, 'PERFIL'),
    cell: ({ row }) => {
      const color = {
        1: 'blueFortune' as const,
        0: 'warning' as const,
      }[row.getValue('perfil') as string]

      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
        row.getValue('perfil') == '1' ? 'Administrador' : 'Operador'
      )
    }
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
              addUser(row.original)
              // navigateTo(`/produtos/categorias/editar/${row.original.id}`)
            }
          },
          {
            label: 'Excluir',
            icon: 'i-lucide-trash-2',
            color: 'error' as const,
            onSelect: () => {
              deleteUser(row.original.id, row.original.nome)
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
import NewUserModal from '~/components/Configurations/NewUser.vue'
const overlay = useOverlay()
const confirmModal = overlay.create(ConfirmModal)
const NewUserOverlay = overlay.create(NewUserModal)
const toast = useToast()



async function addUser(item: Object | null) {
  if(item){
    await NewUserOverlay.open({
      data: item,
      title: 'Editar Usuário'
    })
  } else {
    await NewUserOverlay.open({
      title: 'Novo Usuário'      
    })    
  }
}

async function deleteUser(id: string | number, name: string) {
  const ok = await confirmModal.open({
    title: `Excluir: ${name}`,
    description: 'Deseja realmente excluir este usuário?'
  })

  if (ok) {
    const { fetchResult: fetchDelete, pending: pendingDelete } = useApiRequests(`/_painel/users/${id}`, 'DELETE')
    await fetchDelete()
    if (!pendingDelete.value) {
      toast.add({
        title: 'Sucesso',
        description: 'Usuário deletado com sucesso!',
        color: 'success',
        duration: 1300,
      })
      fetchResult()
    }
  } return
}

function getHeader(column: Column<Usuarios>, label: string) {
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
    `/_painel/users/show?page=1&rows=10&search=${encodeURIComponent(term)}`,
    'GET'
  )

  await fetchSearch()

  const payload = searchResult.value as { data?: Usuarios[] } | Usuarios[]
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
  <div class="mt-5 mb-3">
    <Loading v-if="pending" />
    <div class="flex justify-between">
      <InputSearch @search="handleSearch" />
      <UButton icon="i-lucide-user-plus" label="Adicionar" class="cursor-pointer" @click="addUser(null)" />
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
      />
    </div>
  </div>
</template>

<style scoped>
.squircle {
  mask-size: contain;
  mask-position: center;
  mask-repeat: no-repeat;
}
</style>