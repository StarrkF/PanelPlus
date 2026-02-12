<template>
  <div class="w-full space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Menü Yönetimi</h1>
        <p class="text-muted-foreground">Sistem menülerini, hiyerarşiyi ve çevirileri yönetin.</p>
      </div>
      <button 
        @click="openAddModal"
        class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Plus class="mr-2 h-4 w-4" />
        Yeni Menü Ekle
      </button>
    </div>

    <!-- Hata Mesajı -->
    <div v-if="menuStore.error" class="rounded-md bg-destructive/15 p-4 text-sm text-destructive flex items-center">
      <AlertCircle class="h-4 w-4 mr-2" />
      {{ menuStore.error }}
    </div>

    <!-- Menü Tablosu -->
    <div class="rounded-md border border-border bg-card">
      <div class="relative w-full overflow-auto">
        <table class="w-full caption-bottom text-sm">
          <thead class="[&_tr]:border-b border-border">
            <tr class="border-b transition-colors hover:bg-muted/50">
              <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Menü Adı</th>
              <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Sıralama</th>
              <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Çeviriler</th>
              <th class="h-10 px-4 text-right align-middle font-medium text-muted-foreground">İşlemler</th>
            </tr>
          </thead>
          <tbody class="[&_tr:last-child]:border-0">
            <tr v-if="menuStore.loading && menuStore.menus.length === 0">
              <td colspan="5" class="p-4 text-center align-middle text-muted-foreground">Yükleniyor...</td>
            </tr>
            <tr v-else-if="menuStore.menus.length === 0">
              <td colspan="5" class="p-4 text-center align-middle text-muted-foreground">Hiç menü bulunamadı.</td>
            </tr>
            <tr 
              v-for="menu in visibleMenus" 
              :key="menu.id"
              class="border-b transition-colors hover:bg-muted/50 last:border-0"
            >
              <td class="p-3 align-middle font-medium">
                <div class="flex items-center" :style="{ paddingLeft: `${menu.depth * 1.25}rem` }">
                  <div class="flex items-center gap-2">
                    <div v-if="menu.depth > 0" class="w-2 h-2 border-l border-b border-border -mt-1"></div>
                    <span>{{ getMenuName(menu) }}</span>
                  </div>
                </div>
              </td>
              <td class="p-3 align-middle text-muted-foreground">
                {{ menu.weight }}
              </td>
              <td class="p-3 align-middle">
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
              </td>
              <td class="p-3 align-middle text-right">
                <button 
                  @click="openTranslationModal(menu)"
                  class="inline-flex items-center justify-center rounded-md text-xs font-medium text-primary hover:bg-primary/10 h-7 px-2 transition-colors"
                  title="Çeviri Ekle"
                >
                  <Languages class="h-3.5 w-3.5 mr-1" />
                  Çeviri
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Menü Ekleme Modalı -->
    <div v-if="isAddModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div class="w-full max-w-lg scale-in-95 animate-in fade-in duration-200 border border-border bg-card p-6 shadow-lg rounded-xl overflow-y-auto max-h-[90vh]">
        <div class="flex flex-col space-y-1.5 text-center sm:text-left mb-6">
          <h2 class="text-lg font-semibold leading-none tracking-tight">Yeni Menü Ekle</h2>
          <p class="text-sm text-muted-foreground">Hiyerarşik yapıda yeni bir menü öğesi oluşturun.</p>
        </div>

        <form @submit.prevent="handleCreate" class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Üst Menü</label>
            <select 
              v-model="newMenu.parentId"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option :value="null">Kök Menü (Yok)</option>
              <option v-for="m in visibleMenus" :key="m.id" :value="m.id">
                {{ '\u00A0'.repeat(m.depth * 4) }}{{ getMenuName(m) }}
              </option>
            </select>
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
                <select 
                  v-model="initialTranslation.language"
                  class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  required
                >
                  <option v-for="lang in languageStore.languages" :key="lang.code" :value="lang.code">
                    {{ lang.name }} ({{ lang.code }})
                  </option>
                </select>
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
            <button 
              type="button"
              @click="isAddModalOpen = false"
              class="mt-2 sm:mt-0 inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent transition-colors"
            >
              İptal
            </button>
            <button 
              type="submit"
              :disabled="menuStore.loading"
              class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Loader2 v-if="menuStore.loading" class="mr-2 h-4 w-4 animate-spin" />
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Çeviri Ekleme Modalı -->
    <div v-if="isTranslationModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div class="w-full max-w-md scale-in-95 animate-in fade-in duration-200 border border-border bg-card p-6 shadow-lg rounded-xl">
        <div class="flex flex-col space-y-1.5 text-center sm:text-left mb-6">
          <h2 class="text-lg font-semibold leading-none tracking-tight">Çeviri Ekle</h2>
          <p class="text-sm text-muted-foreground">"{{ getMenuName(selectedMenu) }}" için yeni bir dil çevirisi ekleyin.</p>
        </div>

        <form @submit.prevent="handleAddTranslation" class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Dil</label>
            <select 
              v-model="newTranslation.language"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              required
            >
              <option v-for="lang in availableLanguages" :key="lang.code" :value="lang.code">
                {{ lang.name }} ({{ lang.code }})
              </option>
            </select>
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
            <button 
              type="button"
              @click="isTranslationModalOpen = false"
              class="mt-2 sm:mt-0 inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent transition-colors"
            >
              İptal
            </button>
            <button 
              type="submit"
              :disabled="menuStore.loading || availableLanguages.length === 0"
              class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Loader2 v-if="menuStore.loading" class="mr-2 h-4 w-4 animate-spin" />
              Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Plus, Languages, AlertCircle, Loader2 } from 'lucide-vue-next'
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
