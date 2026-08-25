<template>
  <div class="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-[124px] bg-gradient-to-t from-[#f7f7f7] to-transparent" />

  <div class="fixed inset-x-0 bottom-0 z-50 px-2 py-3">
    <button
      type="button"
      class="pointer-events-auto flex w-full items-center justify-between rounded-[20px] border border-black/[0.06] bg-[#34C759] px-[18px] py-2 text-white shadow-[0_2px_8px_rgba(0,0,0,0.16)] transition active:scale-[0.99] active:bg-[#2fb350]"
      @click="$emit('open-cart')"
    >
      <div class="flex items-center gap-2">
        <span class="flex size-7 items-center justify-center rounded-full bg-black/10 text-base font-semibold text-white/90">
          {{ cartStore.totalCount }}
        </span>
        <span class="text-base font-medium text-white/90">В корзині</span>
      </div>
      <span class="text-base font-bold text-white/90">{{ cartStore.formattedTotalSum }} грн</span>
    </button>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()

defineEmits(['open-cart'])
</script>
