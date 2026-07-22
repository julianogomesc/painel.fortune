import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
    state: () => ({
        shouldRefresh: false,
    }),
    actions: {
        triggerRefresh() {
            this.shouldRefresh = true
        },
        resetRefresh() {
            this.shouldRefresh = false
        }
    }
})
