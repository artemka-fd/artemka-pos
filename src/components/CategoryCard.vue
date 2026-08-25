<template>
  <button
    type="button"
    class="flex flex-col items-center justify-center gap-3 rounded-2xl bg-[#fafafa] px-3 py-4 shadow-[0_8px_16px_-6px_rgba(88,92,95,0.1)] transition active:scale-[0.98]"
    @click="$emit('select', category.slug)"
  >
    <span class="text-[30px] leading-10">{{ category.emoji }}</span>
    <span class="max-w-[130px] text-center text-sm font-medium leading-[1.2] text-black/80">
      {{ category.label }}
    </span>
  </button>
</template>

<script setup>
defineProps({
  category: { type: Object, required: true },
})

defineEmits(['select'])
</script>
