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
      <div class="flex min-w-0 items-center gap-2.5">
        <div class="size-[60px] shrink-0 overflow-hidden rounded-xl">
          <img :src="item.image" alt="" class="size-full object-cover" />
        </div>
        
        <div class="min-w-0 flex flex-col justify-center gap-0.5">
          <p class="truncate text-[15px] font-semibold text-black leading-tight">{{ item.name }}</p>
          
          <div class="flex items-center gap-1.5 text-xs text-black/50">
            <span class="truncate max-w-[90px]">{{ item.brand }}</span>
            <span>•</span>

            <!-- Інтерактивний бейдж редагування ціни -->
            <div class="relative flex items-center">
              <input
                v-if="isEditingPrice"
                ref="priceInput"
                type="text"
                inputmode="decimal"
                v-model="tempPrice"
                @blur="savePrice"
                @keydown.enter="savePrice"
                class="w-16 rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs font-bold text-black border border-black/20 outline-none ring-1 ring-black/20 focus:bg-white"
              />
              <button
                v-else
                type="button"
                @click="startEditPrice"
                class="group flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-bold text-black/80 hover:bg-neutral-200/80 active:scale-95 transition"
                title="Натисніть, щоб змінити ціну"
              >
                <span>{{ currentPrice }} грн</span>
                <span class="text-[10px] text-black/30 group-hover:text-black/60">✎</span>
              </button>
            </div>
          </div>
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
import { computed, ref, watch, useTemplateRef, nextTick } from 'vue'
import { useSwipe } from '@vueuse/core'

const props = defineProps({
  item: { type: Object, required: true },
})

const emit = defineEmits(['increment', 'decrement', 'delete', 'update-price'])

const el = useTemplateRef('el')
const priceInput = useTemplateRef('priceInput')
const isOpened = ref(false)
const maxSwipe = 80

// 1. Локальна змінна для відображення ціни
const currentPrice = ref(Number(props.item.price) || 0)

// Якщо раптом сам пропс змінився ззовні — синхронізуємо
watch(() => props.item.price, (newVal) => {
  currentPrice.value = Number(newVal) || 0
})

// 2. Стейт редагування
const isEditingPrice = ref(false)
const tempPrice = ref(currentPrice.value)

const startEditPrice = async () => {
  tempPrice.value = currentPrice.value
  isEditingPrice.value = true
  await nextTick()
  if (priceInput.value) {
    priceInput.value.focus()
    priceInput.value.select()
  }
}

const savePrice = () => {
  if (!isEditingPrice.value) return
  isEditingPrice.value = false
  
  // Парсимо введення (підтримуємо кому і крапку)
  const parsed = parseFloat(String(tempPrice.value).replace(',', '.'))
  
  if (!isNaN(parsed) && parsed >= 0) {
    // Оновлюємо локальну змінну МИТТЄВО
    currentPrice.value = parsed
    // Також відправляємо нагору в Pinia / батьківський компонент
    emit('update-price', { id: props.item.id, price: parsed })
  } else {
    tempPrice.value = currentPrice.value
  }
}

// 3. Тотал тепер рахується від нашої локальної змінної currentPrice
const formattedLineTotal = computed(() => {
  const total = currentPrice.value * props.item.quantity
  return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
})

// Свайп-логіка
const { isSwiping, lengthX } = useSwipe(el, { passive: true })

const itemStyle = computed(() => {
  if (isSwiping.value) {
    const baseOffset = isOpened.value ? maxSwipe : 0
    const currentOffset = Math.max(0, Math.min(lengthX.value + baseOffset, maxSwipe + 20))
    return {
      transform: `translateX(-${currentOffset}px)`,
      transition: 'none'
    }
  }
  return {
    transform: isOpened.value ? `translateX(-${maxSwipe}px)` : 'translateX(0px)',
  }
})

watch(isSwiping, (swiping) => {
  if (swiping) return
  if (lengthX.value > maxSwipe / 2) {
    isOpened.value = true
  } else if (lengthX.value < -maxSwipe / 2 || lengthX.value < 20) {
    isOpened.value = false
  }
})
</script>