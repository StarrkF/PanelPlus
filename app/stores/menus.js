import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menus: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchMenus() {
      const { fetchWithAuth } = useApi()
      this.loading = true
      this.error = null
      try {
        const response = await fetchWithAuth('http://localhost:8080/api/menus')
        if (response.success) {
          this.menus = response.data
        } else {
          this.error = response.message || 'Menüler yüklenemedi'
        }
      } catch (err) {
        this.error = err.data?.message || err.message || 'Menüler yüklenemedi'
      } finally {
        this.loading = false
      }
    },

    async createMenu(menuRequest) {
      const { fetchWithAuth } = useApi()
      this.loading = true
      this.error = null
      try {
        const response = await fetchWithAuth('http://localhost:8080/api/menus', {
          method: 'POST',
          body: menuRequest
        })
        if (response.success) {
          this.menus.push(response.data)
          return true
        } else {
          this.error = response.message || 'Menü oluşturulamadı'
          return false
        }
      } catch (err) {
        this.error = err.data?.message || err.message || 'Menü oluşturulamadı'
        return false
      } finally {
        this.loading = false
      }
    },

    async addTranslation(menuId, translationRequest) {
      const { fetchWithAuth } = useApi()
      this.loading = true
      this.error = null
      try {
        const response = await fetchWithAuth(`http://localhost:8080/api/menus/${menuId}/translations`, {
          method: 'POST',
          body: translationRequest
        })
        if (response.success) {
          // Güncel listeyi tekrar çekebiliriz veya yerelde güncelleyebiliriz
          await this.fetchMenus()
          return true
        } else {
          this.error = response.message || 'Çeviri eklenemedi'
          return false
        }
      } catch (err) {
        this.error = err.data?.message || err.message || 'Çeviri eklenemedi'
        return false
      } finally {
        this.loading = false
      }
    }
  }
})
