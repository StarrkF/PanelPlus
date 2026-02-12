<template>
  <div class="w-full">
    <div class="flex flex-col space-y-4">
      <h1 class="text-3xl font-bold tracking-tight">Anasayfa</h1>
      <p class="text-muted-foreground">PanelPlus yönetim paneline hoş geldiniz.</p>
    </div>
    
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
      <!-- Örnek kartlar eklenebilir -->
      <div v-for="i in 4" :key="i" class="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div class="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="text-sm font-medium tracking-tight">İstatistik {{ i }}</h3>
        </div>
        <div class="text-2xl font-bold">+{{ i * 125 }}</div>
        <p class="text-xs text-muted-foreground">+20.1% geçen aydan beri</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuth()
})
</script>
