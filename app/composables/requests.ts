export const useApiRequests = (endpoint: Ref<string> | string, method: string | Ref<string>, body?: Object, typeSend: 'formdata' | 'none' = 'none') => {
    const config = useRuntimeConfig()

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
                body: methodVal == 'GET' ? undefined : typeSend == 'formdata' ? fd : body
            })
            result.value = data.value || {}
            if (fetchError.value) {
                error.value = toRaw(fetchError.value.data.errors)
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
        fetchResult, pending, error, result
    }

}