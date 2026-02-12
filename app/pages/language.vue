<template>
  <div class="w-full space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Diller</h1>
        <p class="text-muted-foreground">Sistemdeki dilleri yönetin ve yenilerini ekleyin.</p>
      </div>
      <button 
        @click="isAddModalOpen = true"
        class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Plus class="mr-2 h-4 w-4" />
        Yeni Dil Ekle
      </button>
    </div>

    <!-- Hata Mesajı -->
    <div v-if="languageStore.error" class="rounded-md bg-destructive/15 p-4 text-sm text-destructive flex items-center">
      <AlertCircle class="h-4 w-4 mr-2" />
      {{ languageStore.error }}
    </div>

    <!-- Diller Tablosu -->
    <div class="rounded-md border border-border bg-card">
      <div class="relative w-full overflow-auto">
        <table class="w-full caption-bottom text-sm">
          <thead class="[&_tr]:border-b border-border">
            <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Dil Kodu</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Dil Adı</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Durum</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Varsayılan</th>
              <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">İşlemler</th>
            </tr>
          </thead>
          <tbody class="[&_tr:last-child]:border-0">
            <tr v-if="languageStore.loading && languageStore.languages.length === 0">
              <td colspan="5" class="p-4 text-center align-middle text-muted-foreground">Yükleniyor...</td>
            </tr>
            <tr v-else-if="languageStore.languages.length === 0">
              <td colspan="5" class="p-4 text-center align-middle text-muted-foreground">Hiç dil bulunamadı.</td>
            </tr>
            <tr 
              v-for="lang in languageStore.languages" 
              :key="lang.code"
              class="border-b transition-colors hover:bg-muted/50"
            >
              <td class="p-4 align-middle font-medium">{{ lang.code }}</td>
              <td class="p-4 align-middle">{{ lang.name }}</td>
              <td class="p-4 align-middle">
                <span 
                  :class="lang.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'"
                  class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors"
                >
                  {{ lang.isActive ? 'Aktif' : 'Pasif' }}
                </span>
              </td>
              <td class="p-4 align-middle">
                <Check v-if="lang.defaultLanguage" class="h-4 w-4 text-primary" />
                <span v-else class="text-muted-foreground text-xs">-</span>
              </td>
              <td class="p-4 align-middle text-right">
                <button 
                  @click="handleDelete(lang.code)"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 h-8 w-8 transition-colors"
                  title="Sil"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Ekleme Modalı (Basit Shadcn UI Stili) -->
    <div v-if="isAddModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div class="w-full max-w-lg scale-in-95 animate-in fade-in duration-200 border border-border bg-card p-6 shadow-lg rounded-xl">
        <div class="flex flex-col space-y-1.5 text-center sm:text-left mb-6">
          <h2 class="text-lg font-semibold leading-none tracking-tight">Yeni Dil Ekle</h2>
          <p class="text-sm text-muted-foreground">Sisteme yeni bir dil seçeneği ekleyin.</p>
        </div>

        <form @submit.prevent="handleCreate" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none">Dil Kodu (Örn: tr, en)</label>
              <input 
                v-model="newLanguage.code"
                type="text" 
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none">Dil Adı</label>
              <input 
                v-model="newLanguage.name"
                type="text" 
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>
          </div>

          <div class="flex items-center space-x-4 pt-2">
            <div class="flex items-center space-x-2">
              <input 
                v-model="newLanguage.isActive"
                type="checkbox" 
                id="isActive"
                class="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
              />
              <label for="isActive" class="text-sm font-medium leading-none">Aktif</label>
            </div>
            <div class="flex items-center space-x-2">
              <input 
                v-model="newLanguage.defaultLanguage"
                type="checkbox" 
                id="defaultLanguage"
                class="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
              />
              <label for="defaultLanguage" class="text-sm font-medium leading-none">Varsayılan Dil</label>
            </div>
          </div>

          <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4">
            <button 
              type="button"
              @click="isAddModalOpen = false"
              class="mt-2 sm:mt-0 inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              İptal
            </button>
            <button 
              type="submit"
              :disabled="languageStore.loading"
              class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              <Loader2 v-if="languageStore.loading" class="mr-2 h-4 w-4 animate-spin" />
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Plus, Trash2, Check, AlertCircle, Loader2 } from 'lucide-vue-next'
import { useLanguageStore } from '~/stores/languages'

const languageStore = useLanguageStore()
const isAddModalOpen = ref(false)

const newLanguage = ref({
  code: '',
  name: '',
  isActive: true,
  defaultLanguage: false
})

onMounted(() => {
  languageStore.fetchLanguages()
})

const handleCreate = async () => {
  const success = await languageStore.createLanguage({ ...newLanguage.value })
  if (success) {
    isAddModalOpen.value = false
    newLanguage.value = {
      code: '',
      name: '',
      isActive: true,
      defaultLanguage: false
    }
  }
}

const handleDelete = async (code) => {
  if (confirm('Bu dili silmek istediğinize emin misiniz?')) {
    await languageStore.deleteLanguage(code)
  }
}
</script>
