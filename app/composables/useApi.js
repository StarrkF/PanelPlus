export const useApi = () => {
  const authStore = useAuthStore()

  const fetchWithAuth = async (url, options = {}) => {
    // authStore.token'ın güncel olduğundan emin ol (initAuth çağrılmamış olabilir)
    if (!authStore.token) {
      authStore.initAuth()
    }

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
      
      // Eğer response bir ApiResponse wrapper'ı ise ve success false ise hata fırlatalım
      // Bu, store'lardaki catch bloklarına düşmesini sağlar
      if (response && typeof response.success === 'boolean' && !response.success) {
        const error = new Error(response.message || 'Bir hata oluştu')
        error.data = response
        error.status = response.status
        throw error
      }

      return response
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        // 403 de yetki hatası olabilir, token geçersizse logout yap
        // authStore.logout() // Şimdilik sert bir çıkış yerine sadece hata fırlatalım
      }
      throw error
    }
  }

  return {
    fetchWithAuth
  }
}
