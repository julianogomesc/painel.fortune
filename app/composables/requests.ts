export const useApiRequests = (endpoint: Ref<string> | string, method: string | Ref<string>, body?: Object, typeSend: 'formdata' | 'none' = 'none', auth: boolean = true) => {
    const config = useRuntimeConfig()
    const store = useLoginStore()

    const pending = ref(false)
    const error = ref({})
    const result = ref<[] | {}>([])
    const txt = ref(endpoint)

    type methodsPermited = 'GET' | 'POST' | 'DELETE' | 'PUT'

    const fetchResult = async () => {
        pending.value = true
        error.value = {}

        const fd = new FormData()
        if (typeSend == 'formdata') {

            for (const [key, value] of Object.entries(body || {})) {
                if (value != null && value != undefined) {
                    fd.append(key, value instanceof Blob ? value : String(value))
                }
            }
        }

        const now = new Date().getMilliseconds()

        try {
            const methodVal = unref(method).toUpperCase() as methodsPermited
            const { data, error: fetchError } = await useFetch(unref(endpoint), {
                key: `${txt.value.slice(0, 4)}-${methodVal.toLowerCase()}-${now}`,
                baseURL: config.public.apiBase,
                method: methodVal,
                headers: auth && store.user.token ? {
                    Authorization: `Bearer ${store.user.token}`
                } : {},
                body: methodVal == 'GET' ? undefined : typeSend == 'formdata' ? fd : body
            })
            result.value = data.value || {}
            if (fetchError.value) {
                error.value = toRaw(fetchError.value.data.errors)
            }
        }
        catch (e) {
            // console.log(e)
            error.value = e || { title: 'Erro Inesperado no RQ Front' }
        }
        finally {
            pending.value = false
        }
    }

    return {
        fetchResult, pending, error, result
    }

}

export const useApiRequestsPaginated = (endpoint: Ref<string> | string, rowsQtde: number = 10, auth: boolean = true) => {
    const config = useRuntimeConfig()
    const store = useLoginStore()

    const pending = ref(false)
    const error = ref({})
    const result = ref<any[]>([])
    const page = ref(1)
    const rows = ref(rowsQtde || 10)
    const total = ref(0)

    const fetchResult = async () => {
        pending.value = true
        error.value = {}

        const now = new Date().getMilliseconds()

        try {
            const endpointStr = unref(endpoint)
            const separator = endpointStr.includes('?') ? '&' : '?'
            const urlWithParams = `${endpointStr}${separator}page=${page.value}&rows=${rows.value}`

            const { data, error: fetchError } = await useFetch(urlWithParams, {
                key: `${endpointStr.split('?')[0]?.slice(0, 4) || ''}-get-paginated-${now}`,
                baseURL: config.public.apiBase,
                method: 'GET',
                headers: auth && store.user.token ? {
                    Authorization: `Bearer ${store.user.token}`
                } : {},
            })

            if (data.value) {
                const res = data.value as any
                page.value = res.page ?? page.value
                rows.value = res.rows ?? rows.value
                total.value = res.total ?? 0
                result.value = res.data ?? []
            } else {
                result.value = []
                total.value = 0
            }

            if (fetchError.value) {
                error.value = toRaw(fetchError.value.data?.errors || fetchError.value.data)
            }
        }
        catch (e) {
            console.log(e)
            error.value = e || { title: 'Erro Inesperado no RQ Front' }
        }
        finally {
            pending.value = false
        }
    }

    return {
        fetchResult, pending, error, result, page, rows, total
    }
}