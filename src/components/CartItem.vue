<template>
  <!-- Зовнішній контейнер з фіксованою висотою та прихованим оверфлоу -->
  <div class="relative overflow-hidden rounded-xl bg-white">
    
    <!-- Червона кнопка видалення (підкладка під карткою) -->
    <button
      type="button"
      class="absolute inset-y-0 right-0 flex w-[80px] items-center justify-center bg-red-500 text-white transition-opacity"
      :class="(isSwiping || isOpened) ? 'opacity-100 duration-0' : 'opacity-0 duration-0'"
      @click="$emit('delete', item.id)"
    >
      <img src="../assets/icon-trash.svg" alt="Видалити" class="size-6 brightness-0 invert" />
    </button>

    <!-- Основна картка товару, яка зсувається за пальцем -->
    <div
      ref="el"
      class="relative flex items-center justify-between bg-white p-1 transition-transform duration-200 ease-out touch-pan-y select-none z-50 border-2 border-white ring-8 ring-white"
      :style="itemStyle"
    >
      <div class="flex min-w-0 items-center gap-2">
        <div class="size-[60px] shrink-0 overflow-hidden rounded-xl">
          <img :src="item.image" alt="" class="size-full object-cover" />
        </div>
        <div class="min-w-0">
          <p class="truncate text-[15px] font-semibold text-black">{{ item.name }}</p>
          <p class="text-sm text-black/50">
            {{ item.brand }} • {{ item.price }} грн
          </p>
        </div>
      </div>

      <div class="flex shrink-0 items-center gap-2">
        <p class="text-sm font-bold text-black">{{ formattedLineTotal }} грн</p>
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            class="flex w-11 items-center justify-center rounded-[20px] border border-black/[0.06] bg-[#fafafa] text-2xl font-black leading-[44px] text-black/80 shadow-[0_4px_8px_rgba(88,92,95,0.06)] transition active:scale-95"
            @click="$emit('decrement', item.id)"
          >
            -
          </button>
          <span class="text-center text-sm font-bold">{{ item.quantity }}</span>
          <button
            type="button"
            class="flex w-11 items-center justify-center rounded-[20px] border border-black/[0.06] bg-[#fafafa] text-2xl font-black leading-[44px] text-black/80 shadow-[0_4px_8px_rgba(88,92,95,0.06)] transition active:scale-95"
            @click="$emit('increment', item.id)"
          >
            +
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, ref, watch, useTemplateRef } from 'vue'
import { useSwipe } from '@vueuse/core'

const props = defineProps({
  item: { type: Object, required: true },
})

defineEmits(['increment', 'decrement', 'delete'])

const el = useTemplateRef('el')
const isOpened = ref(false) // Фіксація відкритої кнопки видалення
const maxSwipe = 80 // Ширина кнопки видалення в px

const { isSwiping, lengthX } = useSwipe(el, {
  passive: true,
})

// Автоматичний розрахунок зсуву під час жесту та після нього
const itemStyle = computed(() => {
  if (isSwiping.value) {
    // Якщо свайпаємо ліворуч — вираховуємо реальний зсув з урахуванням вже відкритого стану
    const baseOffset = isOpened.value ? maxSwipe : 0
    const currentOffset = Math.max(0, Math.min(lengthX.value + baseOffset, maxSwipe + 20))
    
    return {
      transform: `translateX(-${currentOffset}px)`,
      transition: 'none' // Вимикаємо анімацію під час ведення пальцем для нативності
    }
  }

  // Стан після того, як палець відпустили
  return {
    transform: isOpened.value ? `translateX(-${maxSwipe}px)` : 'translateX(0px)',
  }
})

// Логіка доводки (Snap-to-position) після завершення свайпу
watch(isSwiping, (swiping) => {
  if (swiping) return

  // Якщо протягнули більше ніж на половину ширини кнопки — відкриваємо, інакше закриваємо
  if (lengthX.value > maxSwipe / 2) {
    isOpened.value = true
  } else if (lengthX.value < -maxSwipe / 2 || lengthX.value < 20) {
    isOpened.value = false
  }
})

const formattedLineTotal = computed(() => {
  const total = props.item.price * props.item.quantity
  return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
})
</script>