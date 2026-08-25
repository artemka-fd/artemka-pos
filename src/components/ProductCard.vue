<template>
  <div class="relative flex h-[200px] flex-col items-center justify-end gap-3 overflow-hidden rounded-[24px] p-3 drop-shadow-[0_1px_1px_rgba(27,28,29,0.04)]">
    <div aria-hidden class="pointer-events-none absolute inset-0">
      <img
        :src="product.image"
        alt=""
        class="absolute size-full max-w-none rounded-[24px] object-cover"
      />
      <div
        class="absolute inset-0 rounded-[24px] bg-gradient-to-b from-transparent to-black"
      />
    </div>

    <div class="relative z-10 w-full">
      <div class="flex items-center gap-2">
        <p class="text-xs font-medium leading-[1.1] text-white/80">{{ product.brand }}</p>
        <p class="text-sm font-semibold text-white">{{ product.price }} грн</p>
      </div>
      <p class="text-lg font-bold text-white">{{ product.name }}</p>
    </div>

    <div v-if="!inCart" class="relative z-10 w-full">
      <button
        type="button"
        class="flex w-full items-center justify-center rounded-xl border border-black/[0.06] bg-white/50 font-mono text-2xl font-bold text-white transition active:bg-white/70"
        @click="$emit('add', product)"
      >
        +
      </button>
    </div>

    <div v-else class="relative z-10 flex w-full items-center justify-center gap-3">
      <button
        type="button"
        class="flex w-full items-center justify-center rounded-xl border border-black/[0.06] bg-white/50 font-mono text-2xl font-bold text-white transition active:bg-white/70"
        @click="$emit('remove', product)"
      >
        -
      </button>
      <span class="min-w-[32px] text-center text-2xl font-bold text-white">{{ quantity }}</span>
      <button
        type="button"
        class="flex w-full items-center justify-center rounded-xl border border-black/[0.06] bg-white/50 font-mono text-2xl font-bold text-white transition active:bg-white/70"
        @click="$emit('add', product)"
      >
        +
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

const props = defineProps({
  product: { type: Object, required: true },
  quantity: { type: Number, default: 0 },
  inCart: { type: Boolean, default: false },
})
onMounted(() => {
  console.log('product', props.product)
})
defineEmits(['add', 'remove'])
</script>
