<template>
  <div class="w-full space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Yazılar</h1>
        <p class="text-muted-foreground">İçeriklerinizi, haberlerinizi ve blog yazılarınızı yönetin.</p>
      </div>
      <button 
        @click="openAddModal"
        class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Plus class="mr-2 h-4 w-4" />
        Yeni Yazı Ekle
      </button>
    </div>

    <!-- Hata Mesajı -->
    <div v-if="postStore.error" class="rounded-md bg-destructive/15 p-4 text-sm text-destructive flex items-center">
      <AlertCircle class="h-4 w-4 mr-2" />
      {{ postStore.error }}
    </div>

    <!-- Yazı Tablosu -->
    <div class="rounded-md border border-border bg-card">
      <div class="relative w-full overflow-auto">
        <table class="w-full caption-bottom text-sm">
          <thead class="[&_tr]:border-b border-border">
            <tr class="border-b transition-colors hover:bg-muted/50">
              <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Başlık</th>
              <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Durum</th>
              <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Tarih</th>
              <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Çeviriler</th>
              <th class="h-10 px-4 text-right align-middle font-medium text-muted-foreground">İşlemler</th>
            </tr>
          </thead>
          <tbody class="[&_tr:last-child]:border-0">
            <tr v-if="postStore.loading && postStore.posts.length === 0">
              <td colspan="5" class="p-4 text-center align-middle text-muted-foreground">Yükleniyor...</td>
            </tr>
            <tr v-else-if="postStore.posts.length === 0">
              <td colspan="5" class="p-4 text-center align-middle text-muted-foreground">Hiç yazı bulunamadı.</td>
            </tr>
            <tr 
              v-for="post in postStore.posts" 
              :key="post.id"
              class="border-b transition-colors hover:bg-muted/50 last:border-0"
            >
              <td class="p-3 align-middle font-medium">
                <div class="flex flex-col">
                  <span>{{ getPostTitle(post) }}</span>
                  <span class="text-[10px] text-muted-foreground font-normal">{{ post.translations[0]?.slug }}</span>
                </div>
              </td>
              <td class="p-3 align-middle">
                <span 
                  :class="post.status === 1 ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'"
                  class="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors"
                >
                  {{ post.status === 1 ? 'Yayında' : 'Taslak' }}
                </span>
              </td>
              <td class="p-3 align-middle text-muted-foreground text-xs">
                {{ formatDate(post.createdAt) }}
              </td>
              <td class="p-3 align-middle">
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
              </td>
              <td class="p-3 align-middle text-right">
                <button 
                  @click="openTranslationModal(post)"
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

    <!-- Yazı Ekleme Modalı -->
    <div v-if="isAddModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div class="w-full max-w-2xl scale-in-95 animate-in fade-in duration-200 border border-border bg-card p-6 shadow-lg rounded-xl overflow-y-auto max-h-[90vh]">
        <div class="flex flex-col space-y-1.5 text-center sm:text-left mb-6">
          <h2 class="text-lg font-semibold leading-none tracking-tight">Yeni Yazı Ekle</h2>
          <p class="text-sm text-muted-foreground">Sisteme yeni bir yazı ve ilk çevirisini ekleyin.</p>
        </div>

        <form @submit.prevent="handleCreate" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none">Durum</label>
              <select 
                v-model.number="newPost.status"
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option :value="0">Taslak</option>
                <option :value="1">Yayında</option>
              </select>
            </div>
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
              :disabled="postStore.loading"
              class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Loader2 v-if="postStore.loading" class="mr-2 h-4 w-4 animate-spin" />
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Çeviri Ekleme Modalı -->
    <div v-if="isTranslationModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div class="w-full max-w-2xl scale-in-95 animate-in fade-in duration-200 border border-border bg-card p-6 shadow-lg rounded-xl overflow-y-auto max-h-[90vh]">
        <div class="flex flex-col space-y-1.5 text-center sm:text-left mb-6">
          <h2 class="text-lg font-semibold leading-none tracking-tight">Çeviri Ekle</h2>
          <p class="text-sm text-muted-foreground">"{{ getPostTitle(selectedPost) }}" için yeni bir dil çevirisi ekleyin.</p>
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
            <button 
              type="button"
              @click="isTranslationModalOpen = false"
              class="mt-2 sm:mt-0 inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent transition-colors"
            >
              İptal
            </button>
            <button 
              type="submit"
              :disabled="postStore.loading || availableLanguages.length === 0"
              class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Loader2 v-if="postStore.loading" class="mr-2 h-4 w-4 animate-spin" />
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
import { usePostStore } from '~/stores/posts'
import { useLanguageStore } from '~/stores/languages'
import { useAuthStore } from '~/stores/auth'

const postStore = usePostStore()
const languageStore = useLanguageStore()
const authStore = useAuthStore()

const isAddModalOpen = ref(false)
const isTranslationModalOpen = ref(false)
const selectedPost = ref(null)

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
    languageStore.fetchLanguages()
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
  newPost.value = { status: 0, userId: null } // userId is not easily available in state yet but let's assume it might be needed or handled by backend
  if (languageStore.languages.length > 0) {
    initialTranslation.value.language = languageStore.languages.find(l => l.defaultLanguage)?.code || languageStore.languages[0].code
  }
  initialTranslation.value.title = ''
  initialTranslation.value.subtitle = ''
  initialTranslation.value.body = ''
  isAddModalOpen.value = true
}

const handleCreate = async () => {
  const payload = {
    ...newPost.value,
    userId: null, // Backend should probably handle this from token or we need current user ID
    translations: [initialTranslation.value]
  }
  const success = await postStore.createPost(payload)
  if (success) {
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
</script>
