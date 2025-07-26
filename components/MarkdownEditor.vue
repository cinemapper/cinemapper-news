<template>
  <textarea ref="textarea" />
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import SimpleMDE from 'simplemde'
import 'simplemde/dist/simplemde.min.css'

const props = defineProps({
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])
const textarea = ref(null)
let editor = null

onMounted(async () => {
  await nextTick()
  editor = new SimpleMDE({
    element: textarea.value,
    initialValue: props.modelValue,
    spellChecker: false,
    status: false,
    autosave: false,
  })
  // Emit initial value
  emit('update:modelValue', editor.value())
  editor.codemirror.on('change', () => {
    emit('update:modelValue', editor.value())
  })
})

watch(() => props.modelValue, (val) => {
  if (editor && editor.value() !== val) {
    editor.value(val)
  }
})

onBeforeUnmount(() => {
  if (editor) {
    editor.toTextArea()
    editor = null
  }
})
</script> 