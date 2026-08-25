<template>
  <div class="flex min-h-[calc(100vh-80px)] flex-col px-2 pb-6 pt-2">
    <button
      type="button"
      class="mb-8 flex size-8 items-center justify-center p-1"
      @click="nav.goToCart()"
    >
      <img src="/assets/icon-arrow-left.svg" alt="Назад" class="size-6" />
    </button>

    <div class="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <span class="text-[64px] leading-[1.2]">☹️</span>
      <div class="text-[28px] font-bold leading-[1.3] text-black">
        <p>Щось не так</p>
        <p class="text-xl font-normal text-black/70">спробуй ще раз, будь ласочка</p>
      </div>
    </div>

    <div class="space-y-3">
      <button
        type="button"
        class="w-full rounded-[24px] border border-black/[0.06] bg-[#34C759] py-3 text-base font-bold text-white shadow-[0_4px_8px_rgba(0,0,0,0.06)] transition active:scale-[0.99]"
        @click="nav.goToCart()"
      >
        Спробувати ще раз
      </button>
      <button
        type="button"
        class="w-full rounded-[24px] border border-black/[0.06] bg-white py-3 text-base font-bold text-black shadow-[0_4px_8px_rgba(88,92,95,0.06)] transition active:scale-[0.99]"
        @click="nav.goToCart()"
      >
        Повернутись до корзини
      </button>
    </div>
  </div>
</template>

<script setup>
import { useNavigationStore } from '../stores/navigation'

const nav = useNavigationStore()
</script>
