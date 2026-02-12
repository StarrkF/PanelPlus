<template>
  <div class="min-h-screen bg-background text-foreground transition-colors duration-300">
    <!-- Sidebar (Sadece Giriş Yapılmışsa) -->
    <Sidebar 
      v-if="authStore.isAuthenticated" 
      :is-open="isSidebarOpen" 
      :is-collapsed="isSidebarCollapsed"
      @close="isSidebarOpen = false" 
    />

    <div :class="{ 
      'lg:pl-64': authStore.isAuthenticated && !isSidebarCollapsed,
      'lg:pl-16': authStore.isAuthenticated && isSidebarCollapsed 
    }" class="transition-all duration-300">
      <!-- Navbar -->
      <nav class="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 w-full px-6 flex justify-between items-center h-16">
        <div class="flex items-center gap-4">
          <!-- Desktop Sidebar Toggle -->
          <button 
            v-if="authStore.isAuthenticated"
            @click="isSidebarCollapsed = !isSidebarCollapsed"
            class="hidden lg:flex p-2 rounded-md hover:bg-accent transition-colors"
          >
            <ChevronLeft v-if="!isSidebarCollapsed" class="h-5 w-5" />
            <ChevronRight v-else class="h-5 w-5" />
          </button>

          <!-- Mobile Menu Toggle -->
          <button 
            v-if="authStore.isAuthenticated"
            @click="isSidebarOpen = !isSidebarOpen"
            class="lg:hidden p-2 rounded-md hover:bg-accent transition-colors"
          >
            <Menu class="h-5 w-5" />
          </button>
          <NuxtLink v-if="!authStore.isAuthenticated" to="/" class="text-xl font-bold tracking-tight">PanelPlus</NuxtLink>
        </div>

        <div class="flex items-center gap-4">
          <div v-if="authStore.isAuthenticated" class="flex items-center gap-4 text-sm font-medium">
            <span class="text-muted-foreground hidden sm:inline">{{ authStore.user?.username }}</span>
          </div>
          <ThemeSwitcher />
        </div>
      </nav>

      <!-- Main Content -->
      <main class="p-6">
        <div :class="{ 'flex min-h-[calc(100vh-8rem)] items-center justify-center': !authStore.isAuthenticated }">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { Menu, ChevronLeft, ChevronRight } from 'lucide-vue-next'
const authStore = useAuthStore()
const isSidebarOpen = ref(false)
const isSidebarCollapsed = ref(false)
</script>

<style>
/* Base transition and resets */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
</style>
