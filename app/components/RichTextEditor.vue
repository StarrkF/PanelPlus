<template>
  <div v-if="editor" class="flex flex-col border border-input rounded-md bg-background overflow-hidden min-h-[300px]">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-1 p-1 border-b border-input bg-muted/30">
      <!-- Headings & Font Size -->
      <div class="flex items-center gap-1 pr-2 border-r border-input mr-1">
        <Select @update:modelValue="(value) => value === '0' ? editor.chain().focus().setParagraph().run() : editor.chain().focus().toggleHeading({ level: parseInt(value) }).run()">
          <SelectTrigger class="w-[120px]">
            <SelectValue placeholder="Paragraf"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Paragraf</SelectItem>
            <SelectItem value="1">Başlık 1</SelectItem>
            <SelectItem value="2">Başlık 2</SelectItem>
            <SelectItem value="3">Başlık 3</SelectItem>
          </SelectContent>
        </Select>

        <Select @update:modelValue="(value) => editor.chain().focus().setFontSize(value).run()">
          <SelectTrigger class="w-[100px]">
            <SelectValue placeholder="Boyut"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12px">12px</SelectItem>
            <SelectItem value="14px">14px</SelectItem>
            <SelectItem value="16px">16px</SelectItem>
            <SelectItem value="18px">18px</SelectItem>
            <SelectItem value="20px">20px</SelectItem>
            <SelectItem value="22px">22px</SelectItem>
            <SelectItem value="24px">24px</SelectItem>
            <SelectItem value="26px">26px</SelectItem>
            <SelectItem value="28px">28px</SelectItem>
            <SelectItem value="30px">30px</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Text Styles -->
      <div class="flex items-center gap-1 pr-2 border-r border-input mr-1">
        <Button
            @click="editor.chain().focus().toggleBold().run()"
            :disabled="!editor.can().chain().focus().toggleBold().run()"
            :variant="editor.isActive('bold') ? 'secondary' : 'ghost'"
            size="xs"
            title="Kalın">
          <Bold class="w-4 h-4"/>
        </Button>
        <Button
            @click="editor.chain().focus().toggleItalic().run()"
            :disabled="!editor.can().chain().focus().toggleItalic().run()"
            :variant="editor.isActive('italic') ? 'secondary' : 'ghost'"
            size="xs"
            title="İtalik">
          <Italic class="w-4 h-4"/>
        </Button>
        <Button
            @click="editor.chain().focus().toggleUnderline().run()"
            :variant="editor.isActive('underline') ? 'secondary' : 'ghost'"
            size="xs"
            title="Altı Çizili">
          <UnderlineIcon class="w-4 h-4"/>
        </Button>
        <Button
            @click="editor.chain().focus().toggleStrike().run()"
            :disabled="!editor.can().chain().focus().toggleStrike().run()"
            :variant="editor.isActive('strike') ? 'secondary' : 'ghost'"
            size="xs"
            title="Üstü Çizili">
          <Strikethrough class="w-4 h-4"/>
        </Button>
      </div>

      <!-- Alignment -->
      <div class="flex items-center gap-1 pr-2 border-r border-input mr-1">
        <Button
            @click="editor.chain().focus().setTextAlign('left').run()"
            :variant="editor.isActive({ textAlign: 'left' }) ? 'secondary' : 'ghost'"
            size="xs"
            title="Sola Yasla">
          <AlignLeft class="w-4 h-4"/>
        </Button>
        <Button
            @click="editor.chain().focus().setTextAlign('center').run()"
            :variant="editor.isActive({ textAlign: 'center' }) ? 'secondary' : 'ghost'"
            size="xs"
            title="Ortala">
          <AlignCenter class="w-4 h-4"/>
        </Button>
        <Button
            @click="editor.chain().focus().setTextAlign('right').run()"
            :variant="editor.isActive({ textAlign: 'right' }) ? 'secondary' : 'ghost'"
            size="xs"
            title="Sağa Yasla">
          <AlignRight class="w-4 h-4"/>
        </Button>
        <Button
            @click="editor.chain().focus().setTextAlign('justify').run()"
            :variant="editor.isActive({ textAlign: 'justify' }) ? 'secondary' : 'ghost'"
            size="xs"
            title="İki Yana Yasla">
          <AlignJustify class="w-4 h-4"/>
        </Button>
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
          <Button
              @click="editor.chain().focus().toggleHighlight().run()"
              :variant="editor.isActive('highlight') ? 'secondary' : 'ghost'"
              size="xs"
              title="Vurgu">
            <Highlighter class="w-4 h-4"/>
          </Button>
        </div>
      </div>

      <!-- Lists -->
      <div class="flex items-center gap-1 pr-2 border-r border-input mr-1">
        <Button
            @click="editor.chain().focus().toggleBulletList().run()"
            :variant="editor.isActive('bulletList') ? 'secondary' : 'ghost'"
            size="xs"
            title="Madde İşaretleri">
          <List class="w-4 h-4"/>
        </Button>
        <Button
            @click="editor.chain().focus().toggleOrderedList().run()"
            :variant="editor.isActive('orderedList') ? 'secondary' : 'ghost'"
            size="xs"
            title="Numaralı Liste">
          <ListOrdered class="w-4 h-4"/>
        </Button>
        <Button
            @click="editor.chain().focus().toggleTaskList().run()"
            :variant="editor.isActive('taskList') ? 'secondary' : 'ghost'"
            size="xs"
            title="Görev Listesi">
          <CheckSquare class="w-4 h-4"/>
        </Button>
      </div>

      <!-- Tables -->
      <div class="flex items-center gap-1 pr-2 border-r border-input mr-1">
        <Button
            @click="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()"
            variant="ghost"
            size="xs"
            title="Tablo Ekle">
          <TableIcon class="w-4 h-4"/>
        </Button>
        <template v-if="editor.isActive('table')">
          <Button @click="editor.chain().focus().addColumnBefore().run()"
                  variant="ghost"
                  size="xs"
                  class="text-[10px]" title="Sütun Ekle (Önce)">+C
          </Button>
          <Button @click="editor.chain().focus().deleteTable().run()"
                  variant="ghost"
                  size="xs"
                  class="text-destructive hover:text-destructive hover:bg-destructive/10">
            <Trash2 class="w-3 h-3"/>
          </Button>
        </template>
      </div>

      <!-- Media & Links -->
      <div class="flex items-center gap-1">
        <Button
            @click="setLink"
            :variant="editor.isActive('link') ? 'secondary' : 'ghost'"
            size="xs"
            title="Bağlantı Ekle">
          <LinkIcon class="w-4 h-4"/>
        </Button>
        <Button
            @click="addImage"
            variant="ghost"
            size="xs"
            title="Resim Ekle">
          <ImageIcon class="w-4 h-4"/>
        </Button>
        <Button
            @click="addYoutube"
            variant="ghost"
            size="xs"
            title="Youtube Videosu">
          <Youtube Icon class="w-4 h-4"/>
        </Button>
        <Button
            @click="editor.chain().focus().undo().run()"
            :disabled="!editor.can().chain().focus().undo().run()"
            variant="ghost"
            size="xs"
            class="disabled:opacity-30">
          <Undo class="w-4 h-4"/>
        </Button>
        <Button
            @click="editor.chain().focus().redo().run()"
            :disabled="!editor.can().chain().focus().redo().run()"
            variant="ghost"
            size="xs"
            class="disabled:opacity-30">
          <Redo class="w-4 h-4"/>
        </Button>
      </div>
    </div>

    <!-- Bubble Menu -->
    <bubble-menu :editor="editor" :tippy-options="{ duration: 100 }" v-if="editor"
                 class="flex items-center gap-1 p-1 rounded-md border border-input bg-popover shadow-md">
      <Button @click="editor.chain().focus().toggleBold().run()" 
              :variant="editor.isActive('bold') ? 'secondary' : 'ghost'"
              size="xs">
        <Bold class="w-4 h-4"/>
      </Button>
      <Button @click="editor.chain().focus().toggleItalic().run()" 
              :variant="editor.isActive('italic') ? 'secondary' : 'ghost'"
              size="xs">
        <Italic class="w-4 h-4"/>
      </Button>
      <Button @click="setLink" 
              :variant="editor.isActive('link') ? 'secondary' : 'ghost'" 
              size="xs">
        <LinkIcon class="w-4 h-4"/>
      </Button>
    </bubble-menu>



    <!-- Editor Content -->
    <editor-content :editor="editor" class="flex-1 p-2  max-w-none focus:outline-none overflow-y-auto max-h-[500px]"/>
    <div
        class="flex justify-between items-center px-4 py-1 text-[10px] text-muted-foreground border-t border-input bg-muted/20">
      <div class="flex gap-4">
        <span>{{ editor.storage.characterCount.words() }} kelime</span>
        <span>{{ editor.storage.characterCount.characters() }} karakter</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3/menus'
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
  Link as LinkIcon, Image as ImageIcon,
  Undo, Redo, Highlighter
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
      setFontSize: fontSize => ({chain}) => {
        return chain()
            .setMark('textStyle', {fontSize})
            .run()
      },
      unsetFontSize: () => ({chain}) => {
        return chain()
            .setMark('textStyle', {fontSize: null})
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
    Highlight.configure({multicolor: true}),
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
    BubbleMenu
  ],
  onUpdate: ({editor}) => {
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

  editor.value.chain().focus().extendMarkRange('link').setLink({href: url}).run()
}

const addImage = () => {
  const url = window.prompt('Resim URL:')
  if (url) {
    editor.value.chain().focus().setImage({src: url}).run()
  }
}

const addYoutube = () => {
  const url = window.prompt('Youtube URL:')
  if (url) {
    editor.value.chain().focus().setYoutubeVideo({src: url}).run()
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
