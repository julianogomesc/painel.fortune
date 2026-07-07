<template>
    <div class="px-4 my-5">
        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 lg:col-span-3 mb-3">
                <label for="" class="text-muted mx-2.5 text-sm">Nome:</label>
                <UInput v-model="data.nome" class="w-full" />
            </div>
            <div class="col-span-12 lg:col-span-4 mb-3">
                <label for="" class="text-muted mx-2.5 text-sm">E-mail:</label>
                <UInput v-model="data.email" class="w-full" />
            </div>
        </div>
        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 lg:col-span-3 mb-3">
                <label for="" class="text-muted mx-2.5 text-sm">Perfil:</label>
                <USelect v-model="data.perfil" class="w-full" :items="perfis" :disabled="user.user?.perfil == 0" />
            </div>
            <div class="col-span-12 lg:col-span-4 mb-3">
                <label for="" class="text-muted text-sm">Status:</label>
                <USwitch v-model="data.situacao" :true-value="1" :false-value="0" unchecked-icon="i-lucide-x" checked-icon="i-lucide-check" color="blueFortune" class="mt-1" :disabled="user.user?.perfil == 0" />
            </div>
        </div>
        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 lg:col-span-7 ">
                <UButton variant="solid" color="blueFortune" class="cursor-pointer" @click="updateData">
                    Atualizar
                </UButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const {user} = useLoginStore()

interface Dados {
    nome: string
    email: string
    perfil: number
    situacao: number
}

const data = reactive<Dados>({
    nome: '',
    email: '',
    perfil: 0,
    situacao: 0,
})

const perfis = ref([
    {value: 0, label: 'Operador'},
    {value: 1, label: 'Administrador'}
])

onMounted(async () => {
    data.nome = user.user?.nome
    data.email = user.user?.email
    data.perfil = user.user?.perfil
    data.situacao = user.user?.situacao
})

async function updateData(){
    alert(JSON.stringify(data))
}

</script>