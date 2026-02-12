export const useApi = () => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  const fetchWithAuth = async (url, options = {}) => {
    const headers = {
      ...options.headers,
    }

    if (authStore.token) {
      headers.Authorization = `Bearer ${authStore.token}`
    }

    try {
      const response = await $fetch(url, {
        ...options,
        headers,
      })
      return response
    } catch (error) {
      if (error.status === 401) {
        authStore.logout()
      }
      throw error
    }
  }

  return {
    fetchWithAuth
  }
}
