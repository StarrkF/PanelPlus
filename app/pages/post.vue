<template>
  <div class="w-full space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Yazılar</h1>
        <p class="text-muted-foreground">İçeriklerinizi, haberlerinizi ve blog yazılarınızı yönetin.</p>
      </div>
      <Button 
        @click="openAddModal"
      >
        <Plus class="mr-2 h-4 w-4" />
        Yeni Yazı Ekle
      </Button>
    </div>

    <!-- Hata Mesajı -->
    <div v-if="postStore.error" class="rounded-md bg-destructive/15 p-4 text-sm text-destructive flex items-center">
      <AlertCircle class="h-4 w-4 mr-2" />
      {{ postStore.error }}
    </div>

    <!-- Yazı Tablosu -->
    <div class="rounded-md border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Başlık</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Menüler</TableHead>
            <TableHead>Tarih</TableHead>
            <TableHead>Çeviriler</TableHead>
            <TableHead class="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="postStore.loading && postStore.posts.length === 0">
            <TableCell colspan="6" class="p-4 text-center text-muted-foreground">Yükleniyor...</TableCell>
          </TableRow>
          <TableRow v-else-if="postStore.posts.length === 0">
            <TableCell colspan="6" class="p-4 text-center text-muted-foreground">Hiç yazı bulunamadı.</TableCell>
          </TableRow>
          <TableRow 
            v-for="post in postStore.posts" 
            :key="post.id"
          >
            <TableCell class="font-medium">
              <div class="flex flex-col">
                <span>{{ getPostTitle(post) }}</span>
                <span class="text-[10px] text-muted-foreground font-normal">{{ post.translations[0]?.slug }}</span>
              </div>
            </TableCell>
            <TableCell>
              <span 
                :class="post.status === 1 ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'"
                class="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors"
              >
                {{ post.status === 1 ? 'Yayında' : 'Taslak' }}
              </span>
            </TableCell>
            <TableCell>
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="menu in post.menus" 
                  :key="menu.id"
                  class="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-medium text-primary"
                >
                  {{ menu.name }}
                </span>
                <span v-if="!post.menus || post.menus.length === 0" class="text-[10px] text-muted-foreground">Menü yok</span>
              </div>
            </TableCell>
            <TableCell class="text-muted-foreground text-xs">
              {{ formatDate(post.createdAt) }}
            </TableCell>
            <TableCell>
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="tr in post.translations" 
                  :key="tr.language"
                  class="inline-flex items-center rounded-md border border-border bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground"
                  :title="tr.title"
                >
                  {{ tr.language.toUpperCase() }}
                </span>
              </div>
            </TableCell>
            <TableCell class="text-right flex items-center justify-end gap-2">
              <Button 
                @click="openTranslationModal(post)"
                variant="ghost"
                size="xs"
                title="Çeviri Ekle"
              >
                <Languages class="h-3.5 w-3.5 mr-1" />
                Çeviri
              </Button>
              <Button 
                @click="openMenuModal(post)"
                variant="ghost"
                size="xs"
                title="Menüye Bağla"
              >
                <Link2 class="h-3.5 w-3.5 mr-1" />
                Menü
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Yazı Ekleme Modalı -->
    <Modal 
      v-model="isAddModalOpen" 
      title="Yeni Yazı Ekle" 
      description="Sisteme yeni bir yazı ve ilk çevirisini ekleyin."
      maxWidth="2xl"
    >
      <form @submit.prevent="handleCreate" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Durum</label>
            <Select v-model="newPost.status">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Durum seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="0">Taslak</SelectItem>
                <SelectItem :value="1">Yayında</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium leading-none">Başlık</label>
          <input 
            v-model="initialTranslation.title"
            type="text" 
            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            required
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium leading-none">Alt Başlık</label>
          <input 
            v-model="initialTranslation.subtitle"
            type="text" 
            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium leading-none">İçerik</label>
          <RichTextEditor v-model="initialTranslation.body" placeholder="Yazı içeriğini buraya girin..." />
        </div>

        <div class="grid grid-cols-2 gap-4 border-t border-border pt-4 mt-4">
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Menüye Bağla (Opsiyonel)</label>
            <Select v-model="selectedMenuId">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Seçiniz..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Seçiniz...</SelectItem>
                <SelectItem v-for="menu in menuStore.menus" :key="menu.id" :value="menu.id">
                  {{ getMenuTitle(menu) }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Sıralama Ağırlığı</label>
            <input 
              v-model.number="selectedMenuWeight"
              type="number" 
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="0"
            />
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
            :disabled="postStore.loading"
          >
            <Loader2 v-if="postStore.loading" class="mr-2 h-4 w-4 animate-spin" />
            Kaydet
          </Button>
        </div>
      </form>
    </Modal>

    <!-- Çeviri Ekleme Modalı -->
    <Modal 
      v-model="isTranslationModalOpen" 
      title="Çeviri Ekle" 
      :description="`'${getPostTitle(selectedPost)}' için yeni bir dil çevirisi ekleyin.`"
      maxWidth="2xl"
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
          <label class="text-sm font-medium leading-none">Başlık</label>
          <input 
            v-model="newTranslation.title"
            type="text" 
            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            required
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium leading-none">Alt Başlık</label>
          <input 
            v-model="newTranslation.subtitle"
            type="text" 
            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium leading-none">İçerik</label>
          <RichTextEditor v-model="newTranslation.body" placeholder="Yazı içeriğini buraya girin..." />
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
            :disabled="postStore.loading || availableLanguages.length === 0"
          >
            <Loader2 v-if="postStore.loading" class="mr-2 h-4 w-4 animate-spin" />
            Ekle
          </Button>
        </div>
      </form>
    </Modal>

    <!-- Menüye Bağlama Modalı -->
    <Modal 
      v-model="isMenuModalOpen" 
      title="Menüye Bağla" 
      :description="`'${getPostTitle(selectedPost)}' yazısını bir menüye bağlayın.`"
      maxWidth="md"
    >
      <form @submit.prevent="handleAddMenu" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium leading-none">Menü</label>
          <Select v-model="selectedMenuId">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Menü seçin..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="menu in menuStore.menus" :key="menu.id" :value="menu.id">
                {{ getMenuTitle(menu) }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium leading-none">Sıralama Ağırlığı</label>
          <input 
            v-model.number="selectedMenuWeight"
            type="number" 
            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="0"
          />
        </div>

        <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4">
          <Button 
            type="button"
            @click="isMenuModalOpen = false"
            variant="outline"
          >
            İptal
          </Button>
          <Button 
            type="submit"
            :disabled="postStore.loading || !selectedMenuId"
          >
            <Loader2 v-if="postStore.loading" class="mr-2 h-4 w-4 animate-spin" />
            Bağla
          </Button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { Plus, Languages, AlertCircle, Loader2, Link2 } from 'lucide-vue-next'
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
import { usePostStore } from '~/stores/posts'
import { useLanguageStore } from '~/stores/languages'
import { useAuthStore } from '~/stores/auth'
import { useMenuStore } from '~/stores/menus'

const postStore = usePostStore()
const languageStore = useLanguageStore()
const authStore = useAuthStore()
const menuStore = useMenuStore()

const isAddModalOpen = ref(false)
const isTranslationModalOpen = ref(false)
const isMenuModalOpen = ref(false)
const selectedPost = ref(null)

const selectedMenuId = ref('')
const selectedMenuWeight = ref(0)

const newPost = ref({
  status: 0,
  userId: null
})

const initialTranslation = ref({
  language: '',
  title: '',
  subtitle: '',
  body: ''
})

const newTranslation = ref({
  language: '',
  title: '',
  subtitle: '',
  body: ''
})

onMounted(async () => {
  await Promise.all([
    postStore.fetchPosts(),
    languageStore.fetchLanguages(),
    menuStore.fetchMenus()
  ])
  
  if (languageStore.languages.length > 0) {
    initialTranslation.value.language = languageStore.languages.find(l => l.defaultLanguage)?.code || languageStore.languages[0].code
  }
})

const getPostTitle = (post) => {
  if (!post || !post.translations || post.translations.length === 0) return 'Başlıksız Yazı'
  const defaultLang = languageStore.languages.find(l => l.defaultLanguage)?.code
  const translation = post.translations.find(t => t.language === defaultLang) || post.translations[0]
  return translation.title
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const openAddModal = () => {
  newPost.value = { status: 0, userId: null }
  selectedMenuId.value = ''
  selectedMenuWeight.value = 0
  if (languageStore.languages.length > 0) {
    initialTranslation.value.language = languageStore.languages.find(l => l.defaultLanguage)?.code || languageStore.languages[0].code
  }
  initialTranslation.value.title = ''
  initialTranslation.value.subtitle = ''
  initialTranslation.value.body = ''
  isAddModalOpen.value = true
}

const handleCreate = async () => {
  const finalMenuId = selectedMenuId.value === 'none' ? '' : selectedMenuId.value
  const payload = {
    ...newPost.value,
    status: Number(newPost.value.status),
    userId: null,
    translations: [initialTranslation.value]
  }
  const response = await postStore.createPost(payload)
  if (response) {
    if (finalMenuId) {
      const createdPost = postStore.posts[postStore.posts.length - 1]
      if (createdPost) {
        await postStore.addMenuToPost(createdPost.id, finalMenuId, selectedMenuWeight.value)
      }
    }
    isAddModalOpen.value = false
  }
}

const openTranslationModal = (post) => {
  selectedPost.value = post
  newTranslation.value = { language: '', title: '', subtitle: '', body: '' }
  
  const langs = availableLanguages.value
  if (langs.length > 0) {
    newTranslation.value.language = langs[0].code
  }
  
  isTranslationModalOpen.value = true
}

const availableLanguages = computed(() => {
  if (!selectedPost.value || !languageStore.languages) return []
  const usedCodes = selectedPost.value.translations.map(t => t.language)
  return languageStore.languages.filter(l => !usedCodes.includes(l.code))
})

const handleAddTranslation = async () => {
  const success = await postStore.addTranslation(selectedPost.value.id, newTranslation.value)
  if (success) {
    isTranslationModalOpen.value = false
  }
}

const openMenuModal = (post) => {
  selectedPost.value = post
  selectedMenuId.value = ''
  selectedMenuWeight.value = 0
  isMenuModalOpen.value = true
}

const handleAddMenu = async () => {
  if (!selectedMenuId.value) return
  const success = await postStore.addMenuToPost(selectedPost.value.id, selectedMenuId.value, selectedMenuWeight.value)
  if (success) {
    isMenuModalOpen.value = false
  }
}

const getMenuTitle = (menu) => {
  if (!menu || !menu.translations || menu.translations.length === 0) return 'Başlıksız Menü'
  const defaultLang = languageStore.languages.find(l => l.defaultLanguage)?.code
  const translation = menu.translations.find(t => t.language === defaultLang) || menu.translations[0]
  return translation.name
}
</script>
