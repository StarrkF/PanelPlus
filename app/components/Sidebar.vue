<template>
  <aside 
    class="fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300 lg:translate-x-0"
    :class="[
      isOpen ? 'translate-x-0' : '-translate-x-full',
      isCollapsed ? 'w-16' : 'w-64'
    ]"
  >
    <div class="flex h-16 items-center border-b border-border px-6 overflow-hidden">
      <NuxtLink to="/" class="text-xl font-bold tracking-tight whitespace-nowrap transition-opacity duration-300" :class="{ 'opacity-0 lg:opacity-100 lg:w-0 lg:invisible': isCollapsed }">
        PanelPlus
      </NuxtLink>
      <div v-if="isCollapsed" class="flex w-full justify-center">
        <span class="text-xl font-bold">P</span>
      </div>
    </div>

    <div class="flex flex-col justify-between h-[calc(100vh-4rem)] p-3 overflow-hidden">
      <nav class="space-y-1">
        <NuxtLink 
          v-for="item in menuItems" 
          :key="item.path" 
          :to="item.path"
          class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground group relative"
          active-class="bg-accent text-accent-foreground"
        >
          <component :is="item.icon" class="h-4 w-4 shrink-0" />
          <span class="whitespace-nowrap transition-all duration-300" :class="{ 'opacity-0 w-0 invisible': isCollapsed }">
            {{ item.label }}
          </span>
          
          <!-- Tooltip for collapsed mode -->
          <div v-if="isCollapsed" class="absolute left-full ml-2 hidden group-hover:block z-50">
            <div class="bg-popover text-popover-foreground text-xs rounded border border-border px-2 py-1 shadow-md whitespace-nowrap">
              {{ item.label }}
            </div>
          </div>
        </NuxtLink>
      </nav>

      <div class="pt-4 border-t border-border">
        <Button 
          @click="authStore.logout"
          variant="ghost"
          class="flex w-full items-center justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive group relative"
        >
          <LogOut class="h-4 w-4 shrink-0" />
          <span class="whitespace-nowrap transition-all duration-300" :class="{ 'opacity-0 w-0 invisible': isCollapsed }">
            Çıkış Yap
          </span>

          <!-- Tooltip for collapsed mode -->
          <div v-if="isCollapsed" class="absolute left-full ml-2 hidden group-hover:block z-50">
            <div class="bg-destructive text-white text-xs rounded px-2 py-1 shadow-md whitespace-nowrap">
              Çıkış Yap
            </div>
          </div>
        </Button>
      </div>
    </div>
  </aside>

  <!-- Mobile Overlay -->
  <div 
    v-if="isOpen" 
    @click="$emit('close')" 
    class="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
  ></div>
</template>

<script setup>
import { 
  Home, 
  Menu as MenuIcon, 
  FileText, 
  Languages, 
  Settings, 
  LogOut 
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

defineProps({
  isOpen: Boolean,
  isCollapsed: Boolean
})

defineEmits(['close'])

const authStore = useAuthStore()

const menuItems = [
  { label: 'Anasayfa', path: '/', icon: Home },
  { label: 'Menü', path: '/menu', icon: MenuIcon },
  { label: 'Post', path: '/post', icon: FileText },
  { label: 'Dil', path: '/language', icon: Languages },
  { label: 'Ayarlar', path: '/settings', icon: Settings },
]
</script>
