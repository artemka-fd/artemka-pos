<template>
  <div class="px-2 pt-2">
    <div
      class="relative flex items-center gap-2 rounded-[20px] bg-[#fafafa] px-[14px] py-[9px] shadow-[inset_0_2px_8px_rgba(0,0,0,0.13)] transition-shadow"
      :class="{ 'shadow-[inset_0_2px_4px_rgba(0,0,0,0.13)]': modelValue }"
    >
      <div class="size-4 shrink-0 overflow-clip">
        <img
          :src="modelValue ? '/assets/icon-search-active.svg' : '/assets/icon-search.svg'"
          alt=""
          class="size-full"
        />
      </div>

      <input
        :value="modelValue"
        type="search"
        :placeholder="placeholder"
        class="min-w-0 flex-1 bg-transparent text-sm leading-[1.2] text-black/90 outline-none placeholder:text-black/20"
        @input="onInput"
        @keydown.enter="onEnter"
      />

      <button
        v-if="modelValue"
        type="button"
        class="flex size-4 shrink-0 items-center justify-center"
        @click="onClear"
      >
        <div class="-rotate-45">
          <img src="../assets/icon-clear.svg" alt="Очистити" class="size-4" />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useDebounceFn } from '@vueuse/core'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Знайди на поличках Хорива@.' },
})

const emit = defineEmits(['update:modelValue', 'search', 'clear'])

const triggerSearch = useDebounceFn((val) => {
  const q = val.trim()
  if (q.length >= 3 || q.length === 0) {
    emit('search', q)
  }
}, 300)

const onInput = (event) => {
  const val = event.target.value
  emit('update:modelValue', val)
  triggerSearch(val)
}

const onEnter = () => {
  const q = props.modelValue.trim()
  // По ентеру знімаємо всі ліміти — шукаємо миттєво навіть по 1 символу
  emit('search', q)
}

const onClear = () => {
  emit('update:modelValue', '')
  emit('clear')
  emit('search', '')
}
</script>