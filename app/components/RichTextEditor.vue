<template>
  <div v-if="editor" class="flex flex-col border border-input rounded-md bg-background overflow-hidden min-h-[300px]">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-1 p-1 border-b border-input bg-muted/30">
      <!-- Headings & Font Size -->
      <div class="flex items-center gap-1 pr-2 border-r border-input mr-1">
        <select 
          @change="editor.chain().focus().toggleHeading({ level: parseInt($event.target.value) }).run()"
          class="h-8 bg-transparent text-xs border rounded px-1 focus:outline-none"
        >
          <option value="0">Paragraf</option>
          <option value="1" :selected="editor.isActive('heading', { level: 1 })">Başlık 1</option>
          <option value="2" :selected="editor.isActive('heading', { level: 2 })">Başlık 2</option>
          <option value="3" :selected="editor.isActive('heading', { level: 3 })">Başlık 3</option>
        </select>

        <select 
          @change="editor.chain().focus().setFontSize($event.target.value).run()"
          class="h-8 bg-transparent text-xs border rounded px-1 focus:outline-none"
        >
          <option value="12px">12px</option>
          <option value="14px" selected>14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="30px">30px</option>
          <option value="36px">36px</option>
        </select>
      </div>

      <!-- Text Styles -->
      <div class="flex items-center gap-1 pr-2 border-r border-input mr-1">
        <button 
          @click="editor.chain().focus().toggleBold().run()" 
          :disabled="!editor.can().chain().focus().toggleBold().run()"
          :class="{ 'bg-accent text-accent-foreground': editor.isActive('bold') }"
          class="p-1.5 rounded hover:bg-accent transition-colors" title="Kalın">
          <Bold class="w-4 h-4" />
        </button>
        <button 
          @click="editor.chain().focus().toggleItalic().run()" 
          :disabled="!editor.can().chain().focus().toggleItalic().run()"
          :class="{ 'bg-accent text-accent-foreground': editor.isActive('italic') }"
          class="p-1.5 rounded hover:bg-accent transition-colors" title="İtalik">
          <Italic class="w-4 h-4" />
        </button>
        <button 
          @click="editor.chain().focus().toggleUnderline().run()" 
          :class="{ 'bg-accent text-accent-foreground': editor.isActive('underline') }"
          class="p-1.5 rounded hover:bg-accent transition-colors" title="Altı Çizili">
          <UnderlineIcon class="w-4 h-4" />
        </button>
        <button 
          @click="editor.chain().focus().toggleStrike().run()" 
          :disabled="!editor.can().chain().focus().toggleStrike().run()"
          :class="{ 'bg-accent text-accent-foreground': editor.isActive('strike') }"
          class="p-1.5 rounded hover:bg-accent transition-colors" title="Üstü Çizili">
          <Strikethrough class="w-4 h-4" />
        </button>
      </div>

      <!-- Alignment -->
      <div class="flex items-center gap-1 pr-2 border-r border-input mr-1">
        <button 
          @click="editor.chain().focus().setTextAlign('left').run()" 
          :class="{ 'bg-accent text-accent-foreground': editor.isActive({ textAlign: 'left' }) }"
          class="p-1.5 rounded hover:bg-accent transition-colors" title="Sola Yasla">
          <AlignLeft class="w-4 h-4" />
        </button>
        <button 
          @click="editor.chain().focus().setTextAlign('center').run()" 
          :class="{ 'bg-accent text-accent-foreground': editor.isActive({ textAlign: 'center' }) }"
          class="p-1.5 rounded hover:bg-accent transition-colors" title="Ortala">
          <AlignCenter class="w-4 h-4" />
        </button>
        <button 
          @click="editor.chain().focus().setTextAlign('right').run()" 
          :class="{ 'bg-accent text-accent-foreground': editor.isActive({ textAlign: 'right' }) }"
          class="p-1.5 rounded hover:bg-accent transition-colors" title="Sağa Yasla">
          <AlignRight class="w-4 h-4" />
        </button>
        <button 
          @click="editor.chain().focus().setTextAlign('justify').run()" 
          :class="{ 'bg-accent text-accent-foreground': editor.isActive({ textAlign: 'justify' }) }"
          class="p-1.5 rounded hover:bg-accent transition-colors" title="İki Yana Yasla">
          <AlignJustify class="w-4 h-4" />
        </button>
      </div>

      <!-- Colors -->
      <div class="flex items-center gap-1 pr-2 border-r border-input mr-1">
        <div class="flex items-center gap-1 p-1">
          <input 
            type="color" 
            @input="editor.chain().focus().setColor($event.target.value).run()"
            :value="editor.getAttributes('textStyle').color || '#000000'"
            class="w-6 h-6 p-0 border-0 bg-transparent cursor-pointer"
            title="Yazı Rengi"
          />
          <button 
            @click="editor.chain().focus().toggleHighlight().run()" 
            :class="{ 'bg-accent text-accent-foreground': editor.isActive('highlight') }"
            class="p-1.5 rounded hover:bg-accent transition-colors" title="Vurgu">
            <Highlighter class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Lists -->
      <div class="flex items-center gap-1 pr-2 border-r border-input mr-1">
        <button 
          @click="editor.chain().focus().toggleBulletList().run()" 
          :class="{ 'bg-accent text-accent-foreground': editor.isActive('bulletList') }"
          class="p-1.5 rounded hover:bg-accent transition-colors" title="Madde İşaretleri">
          <List class="w-4 h-4" />
        </button>
        <button 
          @click="editor.chain().focus().toggleOrderedList().run()" 
          :class="{ 'bg-accent text-accent-foreground': editor.isActive('orderedList') }"
          class="p-1.5 rounded hover:bg-accent transition-colors" title="Numaralı Liste">
          <ListOrdered class="w-4 h-4" />
        </button>
        <button 
          @click="editor.chain().focus().toggleTaskList().run()" 
          :class="{ 'bg-accent text-accent-foreground': editor.isActive('taskList') }"
          class="p-1.5 rounded hover:bg-accent transition-colors" title="Görev Listesi">
          <CheckSquare class="w-4 h-4" />
        </button>
      </div>

      <!-- Tables -->
      <div class="flex items-center gap-1 pr-2 border-r border-input mr-1">
        <button 
          @click="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()" 
          class="p-1.5 rounded hover:bg-accent transition-colors" title="Tablo Ekle">
          <TableIcon class="w-4 h-4" />
        </button>
        <template v-if="editor.isActive('table')">
          <button @click="editor.chain().focus().addColumnBefore().run()" class="p-1.5 rounded hover:bg-accent text-[10px]" title="Sütun Ekle (Önce)">+C</button>
          <button @click="editor.chain().focus().deleteTable().run()" class="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 class="w-3 h-3" /></button>
        </template>
      </div>

      <!-- Media & Links -->
      <div class="flex items-center gap-1">
        <button 
          @click="setLink" 
          :class="{ 'bg-accent text-accent-foreground': editor.isActive('link') }"
          class="p-1.5 rounded hover:bg-accent transition-colors" title="Bağlantı Ekle">
          <LinkIcon class="w-4 h-4" />
        </button>
        <button 
          @click="addImage" 
          class="p-1.5 rounded hover:bg-accent transition-colors" title="Resim Ekle">
          <ImageIcon class="w-4 h-4" />
        </button>
        <button 
          @click="addYoutube" 
          class="p-1.5 rounded hover:bg-accent transition-colors" title="Youtube Videosu">
          <Youtube class="w-4 h-4" />
        </button>
        <button 
          @click="editor.chain().focus().undo().run()" 
          :disabled="!editor.can().chain().focus().undo().run()"
          class="p-1.5 rounded hover:bg-accent transition-colors disabled:opacity-30">
          <Undo class="w-4 h-4" />
        </button>
        <button 
          @click="editor.chain().focus().redo().run()" 
          :disabled="!editor.can().chain().focus().redo().run()"
          class="p-1.5 rounded hover:bg-accent transition-colors disabled:opacity-30">
          <Redo class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Bubble Menu -->
    <bubble-menu :editor="editor" :tippy-options="{ duration: 100 }" v-if="editor" class="flex items-center gap-1 p-1 rounded-md border border-input bg-popover shadow-md">
      <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'bg-accent': editor.isActive('bold') }" class="p-1 rounded hover:bg-accent"><Bold class="w-4 h-4" /></button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'bg-accent': editor.isActive('italic') }" class="p-1 rounded hover:bg-accent"><Italic class="w-4 h-4" /></button>
      <button @click="setLink" :class="{ 'bg-accent': editor.isActive('link') }" class="p-1 rounded hover:bg-accent"><LinkIcon class="w-4 h-4" /></button>
    </bubble-menu>

    <!-- Floating Menu -->
    <floating-menu :editor="editor" :tippy-options="{ duration: 100 }" v-if="editor" class="flex items-center gap-1 p-1 rounded-md border border-input bg-popover shadow-md">
      <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'bg-accent': editor.isActive('heading', { level: 1 }) }" class="p-1 rounded hover:bg-accent text-[10px] font-bold">H1</button>
      <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'bg-accent': editor.isActive('heading', { level: 2 }) }" class="p-1 rounded hover:bg-accent text-[10px] font-bold">H2</button>
      <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'bg-accent': editor.isActive('bulletList') }" class="p-1 rounded hover:bg-accent"><List class="w-4 h-4" /></button>
      <button @click="addImage" class="p-1 rounded hover:bg-accent"><ImageIcon class="w-4 h-4" /></button>
    </floating-menu>

    <!-- Editor Content -->
    <editor-content :editor="editor" class="flex-1 p-4 prose prose-sm max-w-none focus:outline-none dark:prose-invert overflow-y-auto max-h-[500px]" />

    <!-- Footer / Stats -->
    <div class="flex justify-between items-center px-4 py-1 text-[10px] text-muted-foreground border-t border-input bg-muted/20">
      <div class="flex gap-4">
        <span>{{ editor.storage.characterCount.words() }} kelime</span>
        <span>{{ editor.storage.characterCount.characters() }} karakter</span>
      </div>
      <div class="flex items-center gap-2">
        <span>Tiptap Editor</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import { FloatingMenu } from '@tiptap/vue-3/menus'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import Highlight from '@tiptap/extension-highlight'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import Typography from '@tiptap/extension-typography'
import CharacterCount from '@tiptap/extension-character-count'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'

import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, CheckSquare, 
  Table as TableIcon, Trash2, 
  Link as LinkIcon, Image as ImageIcon, Youtube as YoutubeIcon,
  Undo, Redo, Highlighter
} from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Bir şeyler yazın...'
  }
})

const emit = defineEmits(['update:modelValue'])

const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
        renderHTML: attributes => {
          if (!attributes.fontSize) {
            return {}
          }
          return {
            style: `font-size: ${attributes.fontSize}`,
          }
        },
      },
    }
  },
  addCommands() {
    return {
      ...this.parent?.(),
      setFontSize: fontSize => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run()
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run()
      },
    }
  },
})

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-primary underline cursor-pointer',
      },
    }),
    Image.configure({
      HTMLAttributes: {
        class: 'rounded-lg max-w-full h-auto mx-auto border border-border shadow-sm my-4',
      },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    TextStyle,
    FontSize,
    Color,
    FontFamily,
    Highlight.configure({ multicolor: true }),
    Subscript,
    Superscript,
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    Typography,
    CharacterCount,
    Youtube.configure({
      width: 480,
      height: 320,
    }),
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
    BubbleMenu,
    FloatingMenu,
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

watch(() => props.modelValue, (value) => {
  const isSame = editor.value.getHTML() === value
  if (isSame) return
  editor.value.commands.setContent(value, false)
})

const setLink = () => {
  const previousUrl = editor.value.getAttributes('link').href
  const url = window.prompt('URL:', previousUrl)
  
  if (url === null) return
  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  
  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

const addImage = () => {
  const url = window.prompt('Resim URL:')
  if (url) {
    editor.value.chain().focus().setImage({ src: url }).run()
  }
}

const addYoutube = () => {
  const url = window.prompt('Youtube URL:')
  if (url) {
    editor.value.chain().focus().setYoutubeVideo({ src: url }).run()
  }
}

onBeforeUnmount(() => {
  editor.value.destroy()
})
</script>

<style>
/* Tiptap Editor Basic Styles */
.tiptap p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.tiptap {
  outline: none !important;
}

.tiptap table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  margin: 0;
  overflow: hidden;
}

.tiptap table td,
.tiptap table th {
  min-width: 1em;
  border: 2px solid #ced4da;
  padding: 3px 5px;
  vertical-align: top;
  box-sizing: border-box;
  position: relative;
}

.tiptap table th {
  font-weight: bold;
  text-align: left;
  background-color: #f1f3f5;
}

.dark .tiptap table td,
.dark .tiptap table th {
  border-color: #495057;
}

.dark .tiptap table th {
  background-color: #212529;
}

.tiptap ul[data-type="taskList"] {
  list-style: none;
  padding: 0;
}

.tiptap ul[data-type="taskList"] li {
  display: flex;
  align-items: center;
}

.tiptap ul[data-type="taskList"] li > label {
  flex: 0 0 auto;
  margin-right: 0.5rem;
  user-select: none;
}

.tiptap ul[data-type="taskList"] li > div {
  flex: 1 1 auto;
}
</style>
