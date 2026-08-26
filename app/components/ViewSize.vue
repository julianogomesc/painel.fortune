<script setup lang="ts">

const situations = reactive([
    {label: 'Inativo', value: '0'},
    {label: 'Ativo', value: '1'},
    {label: 'Em Breve', value: '2'},
])

const props = defineProps({
    item: Object
})

const emit = defineEmits<{
    refreshData: [value: boolean]
}>()

const { fetchResult: updateSituacao, pending: pendingSituacao } = useApiRequests(`/_painel/produtos/${props.item?.id}`, 'PUT', computed(() => ({ situacao: props.item?.situacao })))

async function onToggle(value: string){
    if(!props.item) return
    props.item.situacao = value
    await updateSituacao()
    emit('refreshData', true)
}

</script>

<template>
    <template v-if="props.item">
        <div class="grid grid-cols-3 gap-4 border-b border-gray-200 py-3 text-sm" v-if="props.item?.medida">
            <div class="col-span-1 text-right">
                Medida:
            </div>
            <div class="col-span-2 font-bold flex items-center">
                {{ props.item?.medida }}
            </div>
        </div>
        <div class="grid grid-cols-3 gap-4 border-b border-gray-200 py-3 text-sm" v-if="props.item?.codigo">
            <div class="col-span-1 text-right">
                Código:
            </div>
            <div class="col-span-2 font-bold flex items-center">
                {{ props.item?.codigo }}
            </div>
        </div>
        <div class="grid grid-cols-3 gap-4 border-b border-gray-200 py-3 text-sm" v-if="props.item?.aro">
            <div class="col-span-1 text-right">
                Aro:
            </div>
            <div class="col-span-2 font-bold flex items-center">
                {{ props.item?.aro }}
            </div>
        </div>
        <div class="grid grid-cols-3 gap-4 border-b border-gray-200 py-3 text-sm" v-if="props.item?.carga">
            <div class="col-span-1 text-right">
                Carga e Velocidade:
            </div>
            <div class="col-span-2 font-bold flex items-center">
                {{ props.item?.carga }}{{ props.item?.velocidade }}
            </div>
        </div>
        <div class="grid grid-cols-3 gap-4 border-b border-gray-200 py-3 text-sm" v-if="props.item?.rr">
            <div class="col-span-1 text-right">
                Resist. ao Rolamento
            </div>
            <div class="col-span-2 font-bold flex items-center">
                {{ props.item?.rr }}
            </div>
        </div>
        <div class="grid grid-cols-3 gap-4 border-b border-gray-200 py-3 text-sm" v-if="props.item?.apm">
            <div class="col-span-1 text-right">
                Ader. em Piso Molhado:
            </div>
            <div class="col-span-2 font-bold flex items-center">
                {{ props.item?.apm }}
            </div>
        </div>
        <div class="grid grid-cols-3 gap-4 border-b border-gray-200 py-3 text-sm" v-if="props.item?.eps">
            <div class="col-span-1 text-right">
                Ruído Externo:
            </div>
            <div class="col-span-2 font-bold flex items-center">
                {{ props.item?.eps }}
            </div>
        </div>
        <div class="grid grid-cols-3 gap-4 py-3 text-sm">
            <div class="col-span-1 text-right">
                Status:
            </div>
            <div class="col-span-2 font-bold flex items-center">
                <USelect :model-value="props.item?.situacao" :items="situations" :loading="pendingSituacao" :disabled="pendingSituacao" @update:model-value="onToggle" class="min-w-30" />
            </div>
        </div>
    </template>
</template>