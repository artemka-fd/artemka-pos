<template>
  <div class="flex min-h-[calc(100vh-80px)] flex-col justify-between px-2 pb-6 pt-2">
    <div>
      <button
        type="button"
        class="mb-4 flex size-8 items-center justify-center p-1"
        @click="nav.goBack"
      >
        <img src="../assets/icon-arrow-left.svg" alt="Назад" class="size-6" />
      </button>

      <h1 class="mb-4 text-[28px] font-bold text-black">🛒 Корзина</h1>

      <div class="space-y-4">
        <CartItem
          v-for="item in cartStore.items"
          :key="item.id"
          :item="item"
          @increment="(id) => cartStore.addItem(cartStore.items.find((i) => i.id === id))"
          @decrement="cartStore.removeItem"
          @delete="cartStore.deleteItem"
        />
      </div>
    </div>

    <div class="mt-8 space-y-4">
      <div>
        <p class="mb-4 text-xl font-bold text-black">Тип оплати:</p>
        <div class="flex gap-3">
          <button
            type="button"
            class="flex flex-1 items-center justify-center rounded-[24px] border border-black/[0.06] py-2 text-base font-bold shadow-[0_4px_8px_rgba(88,92,95,0.06)] transition active:scale-[0.98]"
            :class="cartStore.paymentMethod === 'cash' ? 'bg-[#ebebeb]' : 'bg-[#fafafa]'"
            @click="cartStore.setPaymentMethod('cash')"
          >
            💵 Готівка
          </button>
          <button
            type="button"
            class="flex flex-1 items-center justify-center rounded-[24px] border border-black/[0.06] py-2 text-base font-bold shadow-[0_4px_8px_rgba(88,92,95,0.06)] transition active:scale-[0.98]"
            :class="cartStore.paymentMethod === 'card' ? 'bg-[#ebebeb]' : 'bg-[#fafafa]'"
            @click="cartStore.setPaymentMethod('card')"
          >
            💳 Карта
          </button>
        </div>
      </div>

      <div class="h-0.5 bg-black/10" />

      <div class="flex items-center justify-center gap-2 pb-4 text-center">
        <span class="text-sm text-black/60">Разом до сплати:</span>
        <span class="text-xl font-bold text-black">{{ cartStore.formattedTotalSum }} грн</span>
      </div>

      <button
        type="button"
        class="flex w-full items-center justify-center gap-1.5 rounded-[24px] bg-white py-2 transition active:scale-[0.99]"
        @click="showQr = true"
      >
        <img src="../assets/icon-qr.png" alt="" class="size-6" />
        <span class="text-sm font-bold text-black">
           Показати QR-код
        </span>
      </button>

      <button
        type="button"
        class="flex w-full items-center justify-center gap-1.5 rounded-[24px] border border-black/[0.06] bg-[#34C759] py-2 text-base font-bold text-white shadow-[0_4px_8px_rgba(0,0,0,0.06)] transition active:scale-[0.99] active:bg-[#2fb350]"
        @click="handleConfirm"
      >
        ✅ Підтвердити оплату
      </button>
    </div>
    <QrPopup v-model="showQr">
      <div>
        <img src="../assets/qr.png" alt="Назад" class="" />
      </div>
    </QrPopup>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CartItem from '@/components/CartItem.vue'
import QrPopup from '@/components/QrPopup.vue'
import { useCartStore } from '@/stores/cart'
import { useNavigationStore } from '@/stores/navigation'

const cartStore = useCartStore()
const nav = useNavigationStore()
const showQr = ref(false)

function handleConfirm() {
  // if (cartStore.items.length === 0) return
  // console.log(cartStore.items.map(item => {return {brand: item.brand, name: item.name, quantity: item.quantity, category: item.category, paymentMethod: cartStore.paymentMethod, date: new Date().toLocaleString('uk-UA')}}))
  // Simulate payment — succeeds most of the time
  // if (Math.random() > 0.15) {
  //   cartStore.clearCart()
  //   nav.goToSuccess()
  // } else {
  //   nav.goToError()
  // }
  const submitOrder = async () => {
    const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          // Цей рядок – чит-код, який вимикає жорстку перевірку CORS
          'Content-Type': 'text/plain;charset=utf-8', 
        },
        body: JSON.stringify({ items: cartStore.items, paymentMethod: cartStore.paymentMethod })
      });
      
      // Google повертає статус після успішного запису
      const result = await response.json(); 
      
      if (result.status === 'success') {
        console.log('Оплата успішно записана в таблицю!');
        nav.goToSuccess();
        cartStore.clearCart();
      }
      
    } catch (error) {
      console.error('Помилка запису:', error);
      nav.goToError()
    }
  }
  submitOrder();
}
</script>
