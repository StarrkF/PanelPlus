<template>
  <div class="w-full space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Diller</h1>
        <p class="text-muted-foreground">Sistemdeki dilleri yönetin ve yenilerini ekleyin.</p>
      </div>
      <Button 
        @click="isAddModalOpen = true"
      >
        <Plus class="mr-2 h-4 w-4" />
        Yeni Dil Ekle
      </Button>
    </div>

    <!-- Hata Mesajı -->
    <div v-if="languageStore.error" class="rounded-md bg-destructive/15 p-4 text-sm text-destructive flex items-center">
      <AlertCircle class="h-4 w-4 mr-2" />
      {{ languageStore.error }}
    </div>

    <!-- Diller Tablosu -->
    <div class="rounded-md border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dil Kodu</TableHead>
            <TableHead>Dil Adı</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Varsayılan</TableHead>
            <TableHead class="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="languageStore.loading && languageStore.languages.length === 0">
            <TableCell colspan="5" class="p-4 text-center text-muted-foreground">Yükleniyor...</TableCell>
          </TableRow>
          <TableRow v-else-if="languageStore.languages.length === 0">
            <TableCell colspan="5" class="p-4 text-center text-muted-foreground">Hiç dil bulunamadı.</TableCell>
          </TableRow>
          <TableRow 
            v-for="lang in languageStore.languages" 
            :key="lang.code"
          >
            <TableCell class="font-medium">{{ lang.code }}</TableCell>
            <TableCell>{{ lang.name }}</TableCell>
            <TableCell>
              <span 
                :class="lang.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'"
                class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors"
              >
                {{ lang.isActive ? 'Aktif' : 'Pasif' }}
              </span>
            </TableCell>
            <TableCell>
              <Check v-if="lang.defaultLanguage" class="h-4 w-4 text-primary" />
              <span v-else class="text-muted-foreground text-xs">-</span>
            </TableCell>
            <TableCell class="text-right">
              <Button 
                @click="handleDelete(lang.code)"
                variant="ghost"
                size="icon"
                class="text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Sil"
              >
                <Trash2 class="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Ekleme Modalı -->
    <Modal 
      v-model="isAddModalOpen" 
      title="Yeni Dil Ekle" 
      description="Sisteme yeni bir dil seçeneği ekleyin."
      maxWidth="lg"
    >
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
          <Button 
            type="button"
            @click="isAddModalOpen = false"
            variant="outline"
          >
            İptal
          </Button>
          <Button 
            type="submit"
            :disabled="languageStore.loading"
          >
            <Loader2 v-if="languageStore.loading" class="mr-2 h-4 w-4 animate-spin" />
            Kaydet
          </Button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { Plus, Trash2, Check, AlertCircle, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
