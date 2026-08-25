<template>
  <div class="flex flex-col gap-6 pb-28">
    <SearchBar
      v-model="searchInput"
      @search="handleSearch"
      @clear="handleClear"
    />

    <div class="flex flex-1 flex-col px-2">
      <h1 class="mb-4 text-[28px] font-bold text-black">🔎 Результати пошуку</h1>

      <div v-if="results.length" class="grid grid-cols-2 gap-2">
        <ProductCard
          v-for="product in results"
          :key="product.id"
          :product="product"
          :quantity="cartStore.getQuantity(product.id)"
          :in-cart="cartStore.getQuantity(product.id) > 0"
          @add="cartStore.addItem"
          @remove="cartStore.removeItem(product.id)"
        />
      </div>

      <div v-else class="flex flex-1 flex-col items-center justify-center gap-1 py-16 text-center">
        <span class="text-[64px] leading-[1.2]">☹️</span>
        <div class="text-[28px] font-bold leading-[1.3] text-black">
          <p>По ТАКОМУ запиту</p>
          <p>нічого не знайдено</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import SearchBar from '../components/SearchBar.vue'
import ProductCard from '../components/ProductCard.vue'
import { useCatalogStore } from '../stores/catalog'
import { useCartStore } from '../stores/cart'
import { useNavigationStore } from '../stores/navigation'

const catalog = useCatalogStore()
const cartStore = useCartStore()
const nav = useNavigationStore()

// Текст в інпуті (для візуалу)
const searchInput = ref(nav.searchQuery)

// Синхронізуємо інпут, якщо nav.searchQuery змінився ззовні
watch(() => nav.searchQuery, (q) => { 
  searchInput.value = q 
})

// 💥 ФІКС: Шукаємо від nav.searchQuery І ТІЛЬКИ якщо довжина > 2 символів!
const results = computed(() => {
  const query = nav.searchQuery.trim()
  
  return catalog.searchProducts(query)
})

function handleSearch(query) {
  const q = query.trim()
  nav.searchQuery = q
}

function handleClear() {
  nav.searchQuery = ''
  nav.goToCategories()
}
</script>