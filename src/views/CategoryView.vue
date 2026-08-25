<template>
  <div class="flex flex-col gap-6 pb-28">
    <SearchBar
      v-model="searchInput"
      @search="handleSearch"
      @clear="searchInput = ''"
    />

    <div class="px-2">
      <span class="flex gap-2">
        <button
          type="button"
          class="mb-4 flex size-8 items-center justify-center p-1"
          @click="nav.goBack"
        >
        <img src="../assets/icon-arrow-left.svg" alt="Назад" class="size-6" />
        </button>
        <h1 class="mb-4 text-[28px] font-bold leading-[1.2] text-black">
          {{ category?.emoji }} {{ category?.label }}
        </h1>
      </span>
      
      <div
        v-if="products.length > 1" 
        class="grid grid-cols-2 gap-2"
      >
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          :quantity="cartStore.getQuantity(product.id)"
          :in-cart="cartStore.getQuantity(product.id) > 0"
          @add="cartStore.addItem"
          @remove="cartStore.removeItem(product.id)"
        />
      </div>
      <div v-else class="flex flex-1 flex-col items-center justify-center gap-1 py-16 text-center mx-auto">
        <span class="text-[64px] leading-[1.2]">☹️</span>
        <div class="text-[28px] font-bold leading-[1.3] text-black">
          <p>Поки що в категорії немає товарів :(</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import ProductCard from '@/components/ProductCard.vue'
import { useCatalogStore } from '@/stores/catalog'
import { useCartStore } from '@/stores/cart'
import { useNavigationStore } from '@/stores/navigation'

const catalog = useCatalogStore()
const cartStore = useCartStore()
const nav = useNavigationStore()
const searchInput = ref('')

const category = computed(() => catalog.getCategory(nav.selectedCategory))
const products = computed(() => catalog.productsByCategory(nav.selectedCategory))

function handleSearch(query) {
  const q = query.trim()
  if (q) nav.goToSearch(q)
}
</script>
