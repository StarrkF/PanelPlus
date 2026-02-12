<template>
  <div class="w-full max-w-md p-8 bg-card border border-border rounded-xl shadow-sm transition-all duration-300">
    <div class="flex flex-col space-y-1.5 mb-6 text-center">
      <h1 class="text-2xl font-semibold leading-none tracking-tight">Giriş Yap</h1>
      <p class="text-sm text-muted-foreground mt-2">Hesabınıza erişmek için bilgilerinizi girin</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <div class="space-y-2">
        <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Kullanıcı Adı
        </label>
        <input 
          v-model="username"
          type="text" 
          placeholder="username" 
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Şifre
        </label>
        <input 
          v-model="password"
          type="password" 
          placeholder="••••••••" 
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        />
      </div>

      <div v-if="authStore.error" class="text-destructive text-sm text-center font-medium">
        {{ authStore.error }}
      </div>

      <button 
        type="submit" 
        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
        :disabled="authStore.loading"
      >
        <svg v-if="authStore.loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Giriş Yap
      </button>
    </form>

    <div class="mt-6 text-center text-sm">
      <p class="text-muted-foreground">
        Hesabınız yok mu? 
        <NuxtLink to="/register" class="text-primary font-medium underline underline-offset-4 hover:opacity-80 transition-opacity">Kayıt Ol</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const username = ref('')
const password = ref('')

const handleLogin = async () => {
  const success = await authStore.login({
    username: username.value,
    password: password.value
  })
  
  if (success) {
    navigateTo('/')
  }
}
</script>
