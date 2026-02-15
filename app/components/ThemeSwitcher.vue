<template>
  <Button 
    @click="toggleTheme"
    variant="outline"
    size="icon"
    aria-label="Temayı değiştir"
  >
    <!-- Sun Icon (Visible when dark) -->
    <svg v-if="currentTheme === 'dark'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
    </svg>

    <!-- Moon Icon (Visible when light) -->
    <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
    <span class="sr-only">Temayı değiştir</span>
  </Button>
</template>

<script setup>
import { Button } from '@/components/ui/button'
const currentTheme = ref('light')

const toggleTheme = () => {
  const newTheme = currentTheme.value === 'light' ? 'dark' : 'light'
  applyTheme(newTheme)
}

const applyTheme = (theme) => {
  currentTheme.value = theme
  document.documentElement.setAttribute('data-theme', theme)
  // Shadcn often uses 'dark' class on html or body
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('selected-theme', theme)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('selected-theme') || 'light'
  applyTheme(savedTheme)
})
</script>
