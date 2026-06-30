import { defineStore } from 'pinia';
import type { userType } from '~/types/user.ts';

export const useLoginStore = defineStore('userLog', {
    state: () => ({
        user: {} as userType,
    }),
    actions: {
        doLogin(user: userType) {
            this.user = {
                expires_in: user.expires_in,
                token: user.token,
                data: user.user
            }
        },
        doLogout() {
            this.user = {} as userType
        }
    },
    persist: {
        pick: ['user'],
        storage: sessionStorage,
    },
})