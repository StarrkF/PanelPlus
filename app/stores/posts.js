import { defineStore } from 'pinia'

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchPosts() {
      const { fetchWithAuth } = useApi()
      this.loading = true
      this.error = null
      try {
        const response = await fetchWithAuth('http://localhost:8080/api/posts')
        if (response.success) {
          this.posts = response.data
        } else {
          this.error = response.message || 'Yazılar yüklenemedi'
        }
      } catch (err) {
        this.error = err.data?.message || err.message || 'Yazılar yüklenemedi'
      } finally {
        this.loading = false
      }
    },

    async createPost(postRequest) {
      const { fetchWithAuth } = useApi()
      this.loading = true
      this.error = null
      try {
        const response = await fetchWithAuth('http://localhost:8080/api/posts', {
          method: 'POST',
          body: postRequest
        })
        if (response.success) {
          this.posts.push(response.data)
          return true
        } else {
          this.error = response.message || 'Yazı oluşturulamadı'
          return false
        }
      } catch (err) {
        this.error = err.data?.message || err.message || 'Yazı oluşturulamadı'
        return false
      } finally {
        this.loading = false
      }
    },

    async addTranslation(postId, translationRequest) {
      const { fetchWithAuth } = useApi()
      this.loading = true
      this.error = null
      try {
        const response = await fetchWithAuth(`http://localhost:8080/api/posts/${postId}/translations`, {
          method: 'POST',
          body: translationRequest
        })
        if (response.success) {
          await this.fetchPosts()
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
