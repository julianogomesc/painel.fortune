import { defineStore } from 'pinia';
import type { userType } from '~/types/user.ts';

interface upType {
    user: {
        id: number,
        nome: string,
        email: string,
        perfil: number,
        situacao: number
    }
}

export const useLoginStore = defineStore('userLog', {
    state: () => ({
        user: {} as userType,
    }),
    actions: {
        doLogin(user: userType) {
            this.user = {
                expires_in: user.expires_in,
                token: user.token,
                user: user.user
            }
        },
        updateLoginData(user: upType['user']){
            this.user.user = user
        },
        doLogout() {
            this.$reset()
            sessionStorage.removeItem('userLog')
        }
    },
    persist: {
        pick: ['user'],
        storage: sessionStorage,
    },
})