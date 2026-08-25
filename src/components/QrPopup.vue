<script setup>
defineProps({
  modelValue: { type: Boolean, required: true }
})
console.log('popup')
const emit = defineEmits(['update:modelValue'])

function close() {
  console.log('close')
  emit('update:modelValue', false)
}
</script>

<template>
  <teleport to="body">
    <div v-if="modelValue" class="popup-backdrop" @click.self="close">
      <div class="popup-box">
        <slot></slot>
        <button 
            @click="close"
            class="w-full text-center py-2 rounded-[24px] border border-black/[0.06] py-2 text-base font-bold shadow-[0_4px_8px_rgba(88,92,95,0.06)] transition active:scale-[0.98]"
        >
            Закрити
        </button>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.popup-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 99999999999;
  position: absolute;
}
.popup-box {
  background: white; padding: 20px; border-radius: 8px; min-width: 300px;
}
</style>
