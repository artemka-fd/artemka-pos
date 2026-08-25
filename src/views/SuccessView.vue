<template>
  <div class="flex min-h-[calc(100vh-80px)] flex-col px-2 pb-6 pt-2">
    <button
      type="button"
      class="mb-8 flex size-8 items-center justify-center p-1"
      @click="nav.goToCategories()"
    >
      <img src="/assets/icon-arrow-left.svg" alt="Назад" class="size-6" />
    </button>

    <div class="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <span class="text-[64px] leading-[1.2]">🙂</span>
      <p class="text-[28px] font-bold leading-[1.3] text-black">
        Продаж відправлено успішно!
      </p>
    </div>

    <button
      type="button"
      class="w-full rounded-[24px] border border-black/[0.06] bg-white py-3 text-base font-bold text-black shadow-[0_4px_8px_rgba(88,92,95,0.06)] transition active:scale-[0.99]"
      @click="nav.goToCategories()"
    >
      Повернутись до категорій
    </button>
  </div>
</template>

<script setup>
import { useNavigationStore } from '../stores/navigation'

const nav = useNavigationStore()
</script>
