<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
    <div 
      ref="modalRef"
      :class="[
        'w-full scale-in-95 animate-in fade-in duration-200 border border-border bg-card p-6 shadow-lg rounded-xl',
        maxWidthClass
      ]"
    >
      <div class="flex flex-col space-y-1.5 text-center sm:text-left mb-6 relative">
        <h2 class="text-lg font-semibold leading-none tracking-tight">{{ title }}</h2>
        <p v-if="description" class="text-sm text-muted-foreground">{{ description }}</p>
        <Button 
          @click="$emit('update:modelValue', false)"
          variant="ghost"
          size="icon"
          class="absolute right-0 top-0 h-6 w-6"
        >
          <X class="h-4 w-4" />
          <span class="sr-only">Kapat</span>
        </Button>
      </div>

      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  maxWidth: {
    type: String,
    default: 'md' // sm, md, lg, xl, 2xl
  }
})

const emit = defineEmits(['update:modelValue'])

const modalRef = ref(null)

const maxWidthClass = computed(() => {
  const classes = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl'
  }
  return classes[props.maxWidth] || 'max-w-md'
})

const handleEscape = (e) => {
  if (e.key === 'Escape' && props.modelValue) {
    emit('update:modelValue', false)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape)
})
</script>
