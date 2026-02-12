import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    languages: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchLanguages() {
      const { fetchWithAuth } = useApi()
      
      this.loading = true
      this.error = null
      try {
        const response = await fetchWithAuth('http://localhost:8080/api/languages')
        // Backend returns ApiResponse<List<LanguageDto>>
        if (response.success) {
          this.languages = response.data
        } else {
          this.error = response.message || 'Diller yüklenemedi'
        }
      } catch (err) {
        this.error = err.data?.message || err.message || 'Diller yüklenemedi'
      } finally {
        this.loading = false
      }
    },

    async createLanguage(languageDto) {
      const { fetchWithAuth } = useApi()
      this.loading = true
      this.error = null
      try {
        const response = await fetchWithAuth('http://localhost:8080/api/languages', {
          method: 'POST',
          body: languageDto
        })
        // Backend returns ApiResponse<LanguageDto>
        if (response.success) {
          this.languages.push(response.data)
          return true
        } else {
          this.error = response.message || 'Dil eklenemedi'
          return false
        }
      } catch (err) {
        this.error = err.data?.message || err.message || 'Dil eklenemedi'
        return false
      } finally {
        this.loading = false
      }
    },

    async deleteLanguage(code) {
      const { fetchWithAuth } = useApi()
      this.loading = true
      this.error = null
      try {
        const response = await fetchWithAuth(`http://localhost:8080/api/languages/${code}`, {
          method: 'DELETE'
        })
        // Backend returns ApiResponse<Void>
        if (response.success) {
          this.languages = this.languages.filter(l => l.code !== code)
          return true
        } else {
          this.error = response.message || 'Dil silinemedi'
          return false
        }
      } catch (err) {
        this.error = err.data?.message || err.message || 'Dil silinemedi'
        return false
      } finally {
        this.loading = false
      }
    }
  }
})
