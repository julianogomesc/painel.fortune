<template>
    <UModal :dismissible="false" :title="title">
        <template #body>
            <div class="">
                <p class="text-gray-500 text-sm">{{ description }}</p>
                <div class="d-block mt-5">
                    <UButton color="error" label="Confirmar" @click="confirm" class="mr-3" />
                    <UButton color="neutral" variant="outline" label="Cancelar" @click="cancel" />
                </div>
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

const emit = defineEmits<{
    close: [value: boolean]
}>()

function confirm(){
    emit('close', true)
}

function cancel(){
    emit('close', false)
}
</script>
