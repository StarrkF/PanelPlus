import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null
  }),

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch('http://localhost:8080/api/auth/login', { 
          method: 'POST', 
          body: credentials 
        })
        
        // Backend returns ApiResponse<TokenResponse>
        if (response.success) {
          this.token = response.data.token
          this.user = { username: credentials.username }
          localStorage.setItem('auth_token', this.token)
          return true
        } else {
          this.error = response.message || 'Giriş başarısız'
          return false
        }
      } catch (err) {
        this.error = err.data?.message || err.message || 'Giriş başarısız'
        return false
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch('http://localhost:8080/api/auth/register', { 
          method: 'POST', 
          body: userData 
        })
        
        // Backend returns ApiResponse<TokenResponse> on successful registration
        if (response.success) {
          this.token = response.data.token
          this.user = { username: userData.username }
          localStorage.setItem('auth_token', this.token)
          return true
        } else {
          this.error = response.message || 'Kayıt başarısız'
          return false
        }
      } catch (err) {
        this.error = err.data?.message || err.message || 'Kayıt başarısız'
        return false
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('auth_token')
      navigateTo('/login')
    },

    initAuth() {
      const token = localStorage.getItem('auth_token')
      if (token) {
        this.token = token
        // Token ile kullanıcı bilgilerini çekme işlemi burada yapılabilir
      }
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token
  }
})
