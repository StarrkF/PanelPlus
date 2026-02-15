<template>
  <div class="w-full space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Menü Yönetimi</h1>
        <p class="text-muted-foreground">Sistem menülerini, hiyerarşiyi ve çevirileri yönetin.</p>
      </div>
      <Button 
        @click="openAddModal"
      >
        <Plus class="mr-2 h-4 w-4" />
        Yeni Menü Ekle
      </Button>
    </div>

    <!-- Hata Mesajı -->
    <div v-if="menuStore.error" class="rounded-md bg-destructive/15 p-4 text-sm text-destructive flex items-center">
      <AlertCircle class="h-4 w-4 mr-2" />
      {{ menuStore.error }}
    </div>

    <!-- Menü Tablosu -->
    <div class="rounded-md border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Menü Adı</TableHead>
            <TableHead>Sıralama</TableHead>
            <TableHead>Çeviriler</TableHead>
            <TableHead class="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="menuStore.loading && menuStore.menus.length === 0">
            <TableCell colspan="4" class="p-4 text-center text-muted-foreground">Yükleniyor...</TableCell>
          </TableRow>
          <TableRow v-else-if="menuStore.menus.length === 0">
            <TableCell colspan="4" class="p-4 text-center text-muted-foreground">Hiç menü bulunamadı.</TableCell>
          </TableRow>
          <TableRow 
            v-for="menu in visibleMenus" 
            :key="menu.id"
          >
            <TableCell class="font-medium">
              <div class="flex items-center" :style="{ paddingLeft: `${menu.depth * 1.25}rem` }">
                <div class="flex items-center gap-2">
                  <div v-if="menu.depth > 0" class="w-2 h-2 border-l border-b border-border -mt-1"></div>
                  <span>{{ getMenuName(menu) }}</span>
                </div>
              </div>
            </TableCell>
            <TableCell class="text-muted-foreground">
              {{ menu.weight }}
            </TableCell>
            <TableCell>
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="tr in menu.translations" 
                  :key="tr.language"
                  class="inline-flex items-center rounded-md border border-border bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground"
                  :title="tr.name"
                >
                  {{ tr.language.toUpperCase() }}
                </span>
              </div>
            </TableCell>
            <TableCell class="text-right">
              <Button 
                @click="openTranslationModal(menu)"
                variant="ghost"
                size="xs"
                title="Çeviri Ekle"
              >
                <Languages class="h-3.5 w-3.5 mr-1" />
                Çeviri
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Menü Ekleme Modalı -->
    <Modal 
      v-model="isAddModalOpen" 
      title="Yeni Menü Ekle" 
      description="Hiyerarşik yapıda yeni bir menü öğesi oluşturun."
      maxWidth="lg"
    >
      <form @submit.prevent="handleCreate" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium leading-none">Üst Menü</label>
          <Select v-model="newMenu.parentId">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Üst menü seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="root">Kök Menü (Yok)</SelectItem>
              <SelectItem v-for="m in visibleMenus" :key="m.id" :value="m.id">
                <span class="flex items-center">
                  <span v-for="i in m.depth" :key="i" class="w-4"></span>
                  {{ getMenuName(m) }}
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium leading-none">Sıralama Ağırlığı</label>
          <input 
            v-model.number="newMenu.weight"
            type="number" 
            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            required
          />
        </div>

        <div class="border-t border-border pt-4">
          <h3 class="text-sm font-semibold mb-3">İlk Çeviri (Zorunlu)</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none">Dil</label>
              <Select v-model="initialTranslation.language">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Dil seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="lang in languageStore.languages" :key="lang.code" :value="lang.code">
                    {{ lang.name }} ({{ lang.code }})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none">Menü Adı</label>
              <input 
                v-model="initialTranslation.name"
                type="text" 
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
              />
            </div>
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
            :disabled="menuStore.loading"
          >
            <Loader2 v-if="menuStore.loading" class="mr-2 h-4 w-4 animate-spin" />
            Kaydet
          </Button>
        </div>
      </form>
    </Modal>

    <!-- Çeviri Ekleme Modalı -->
    <Modal 
      v-model="isTranslationModalOpen" 
      title="Çeviri Ekle" 
      :description="`'${getMenuName(selectedMenu)}' için yeni bir dil çevirisi ekleyin.`"
      maxWidth="md"
    >
      <form @submit.prevent="handleAddTranslation" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium leading-none">Dil</label>
          <Select v-model="newTranslation.language">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Dil seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="lang in availableLanguages" :key="lang.code" :value="lang.code">
                {{ lang.name }} ({{ lang.code }})
              </SelectItem>
            </SelectContent>
          </Select>
          <p v-if="availableLanguages.length === 0" class="text-[10px] text-destructive">Tüm mevcut diller için çeviri zaten eklenmiş.</p>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium leading-none">Menü Adı (Yerel)</label>
          <input 
            v-model="newTranslation.name"
            type="text" 
            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            required
          />
        </div>

        <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4">
          <Button 
            type="button"
            @click="isTranslationModalOpen = false"
            variant="outline"
          >
            İptal
          </Button>
          <Button 
            type="submit"
            :disabled="menuStore.loading || availableLanguages.length === 0"
          >
            <Loader2 v-if="menuStore.loading" class="mr-2 h-4 w-4 animate-spin" />
            Ekle
          </Button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { Plus, Languages, AlertCircle, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMenuStore } from '~/stores/menus'
import { useLanguageStore } from '~/stores/languages'

const menuStore = useMenuStore()
const languageStore = useLanguageStore()

const isAddModalOpen = ref(false)
const isTranslationModalOpen = ref(false)
const selectedMenu = ref(null)

const newMenu = ref({
  parentId: null,
  weight: 0
})

const initialTranslation = ref({
  language: '',
  name: ''
})

const newTranslation = ref({
  language: '',
  name: ''
})

onMounted(async () => {
  await Promise.all([
    menuStore.fetchMenus(),
    languageStore.fetchLanguages()
  ])
  
  if (languageStore.languages.length > 0) {
    initialTranslation.value.language = languageStore.languages.find(l => l.defaultLanguage)?.code || languageStore.languages[0].code
  }
})

// Menüleri hiyerarşik yapıya dönüştür
const menuTree = computed(() => {
  const map = {}
  const roots = []
  
  // Önce tüm menüleri map'e ekle ve children dizisi oluştur
  menuStore.menus.forEach(menu => {
    map[menu.id] = { ...menu, children: [] }
  })
  
  // Parent-child ilişkisini kur
  menuStore.menus.forEach(menu => {
    if (menu.parentId && map[menu.parentId]) {
      map[menu.parentId].children.push(map[menu.id])
    } else {
      roots.push(map[menu.id])
    }
  })
  
  // Ağırlığa göre sırala
  const sortMenus = (list) => {
    list.sort((a, b) => (a.weight || 0) - (b.weight || 0))
    list.forEach(item => {
      if (item.children.length > 0) {
        sortMenus(item.children)
      }
    })
  }
  
  sortMenus(roots)
  return roots
})

// Görünür menü listesini (düzleştirilmiş ağaç) oluştur
const visibleMenus = computed(() => {
  const result = []
  
  const flatten = (nodes, depth = 0) => {
    nodes.forEach(node => {
      result.push({ ...node, depth })
      if (node.children && node.children.length > 0) {
        flatten(node.children, depth + 1)
      }
    })
  }
  
  flatten(menuTree.value)
  return result
})

const getMenuName = (menu) => {
  if (!menu || !menu.translations || menu.translations.length === 0) return 'Adsız Menü'
  // Varsayılan dili bulmaya çalışalım yoksa ilkini alalım
  const defaultLang = languageStore.languages.find(l => l.defaultLanguage)?.code
  const translation = menu.translations.find(t => t.language === defaultLang) || menu.translations[0]
  return translation.name
}

const getParentName = (parentId) => {
  if (!parentId) return null
  const parent = menuStore.menus.find(m => m.id === parentId)
  return getMenuName(parent)
}

const openAddModal = () => {
  newMenu.value = { parentId: null, weight: menuStore.menus.length }
  if (languageStore.languages.length > 0) {
    initialTranslation.value.language = languageStore.languages.find(l => l.defaultLanguage)?.code || languageStore.languages[0].code
  }
  initialTranslation.value.name = ''
  isAddModalOpen.value = true
}

const handleCreate = async () => {
  const payload = {
    ...newMenu.value,
    parentId: newMenu.value.parentId === 'root' ? null : newMenu.value.parentId,
    translations: [initialTranslation.value]
  }
  const success = await menuStore.createMenu(payload)
  if (success) {
    isAddModalOpen.value = false
  }
}

const openTranslationModal = (menu) => {
  selectedMenu.value = menu
  newTranslation.value = { language: '', name: '' }
  
  const langs = availableLanguages.value
  if (langs.length > 0) {
    newTranslation.value.language = langs[0].code
  }
  
  isTranslationModalOpen.value = true
}

const availableLanguages = computed(() => {
  if (!selectedMenu.value || !languageStore.languages) return []
  const usedCodes = selectedMenu.value.translations.map(t => t.language)
  return languageStore.languages.filter(l => !usedCodes.includes(l.code))
})

const handleAddTranslation = async () => {
  const success = await menuStore.addTranslation(selectedMenu.value.id, newTranslation.value)
  if (success) {
    isTranslationModalOpen.value = false
  }
}
</script>
