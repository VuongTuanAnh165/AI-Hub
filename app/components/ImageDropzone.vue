<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const errorMsg = ref('')

function triggerFileSelect() {
  fileInput.value?.click()
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) handleFile(file)
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) handleFile(file)
}

async function handleFile(file: File) {
  errorMsg.value = ''

  // 1. Validate MIME
  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    errorMsg.value = 'Chỉ chấp nhận file ảnh (JPEG, PNG, WebP).'
    return
  }

  // 2. Validate Size (Max 15MB)
  if (file.size > 15 * 1024 * 1024) {
    errorMsg.value = 'Dung lượng ảnh tối đa 15MB. Vui lòng chọn ảnh nhẹ hơn!'
    return
  }

  // 3. Client-side Compression
  try {
    const base64 = await compressImage(file, 800, 0.8)
    emit('update:modelValue', base64)
  } catch (err) {
    errorMsg.value = 'Không thể xử lý ảnh, vui lòng thử lại!'
    console.error(err)
  }
}

function compressImage(file: File, maxSize: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        let width = img.width
        let height = img.height

        // Tính tỷ lệ
        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width)
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height)
            height = maxSize
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          // Ép nén sang JPEG 80%
          resolve(canvas.toDataURL('image/jpeg', quality))
        } else {
          reject(new Error('Canvas ctx is null'))
        }
      }
      img.onerror = reject
    }
    reader.onerror = reject
  })
}

function removeImage() {
  emit('update:modelValue', '')
  if (fileInput.value) fileInput.value.value = ''
  errorMsg.value = ''
}
</script>

<template>
  <div class="w-full">
    <div
      v-if="!modelValue"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
      @click="triggerFileSelect"
      :class="[
        'w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors duration-200',
        isDragging ? 'border-primary bg-primary/10' : 'border-white/20 hover:border-primary/50 hover:bg-white/5'
      ]"
    >
      <UIcon name="i-lucide-image-plus" class="size-10 text-muted mb-2" />
      <p class="text-sm text-dimmed font-medium text-center px-4">
        Nhấn để tải lên hoặc kéo thả ảnh vào đây<br/>
        <span class="text-xs opacity-70">(JPEG, PNG, WebP - Tối đa 15MB)</span>
      </p>
    </div>

    <!-- Preview -->
    <div v-else class="relative w-full h-48 rounded-xl overflow-hidden group">
      <img :src="modelValue" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <UButton
          color="error"
          variant="solid"
          icon="i-lucide-trash-2"
          label="Xoá Ảnh"
          @click="removeImage"
        />
      </div>
    </div>

    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg, image/png, image/webp"
      class="hidden"
      @change="onFileChange"
    />

    <UAlert
      v-if="errorMsg"
      :title="errorMsg"
      color="error"
      variant="soft"
      class="mt-2"
      size="sm"
    />
  </div>
</template>
