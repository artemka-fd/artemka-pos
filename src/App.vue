<template>
  <main class="mx-auto min-h-screen max-w-[828px] bg-white font-sans text-slate-900">
    <CategoriesView v-if="nav.view === 'categories'" />
    <CategoryView v-else-if="nav.view === 'category'" />
    <SearchView v-else-if="nav.view === 'search'" />
    <CartView v-else-if="nav.view === 'cart'" />
    <SuccessView v-else-if="nav.view === 'success'" />
    <ErrorView v-else-if="nav.view === 'error'" />

    <StickyCartBar
      v-if="showCartBar"
      @open-cart="nav.goToCart()"
    />
  </main>
</template>

<script setup>
import { computed } from 'vue'
import StickyCartBar from './components/StickyCartBar.vue'
import CategoriesView from './views/CategoriesView.vue'
import CategoryView from './views/CategoryView.vue'
import SearchView from './views/SearchView.vue'
import CartView from './views/CartView.vue'
import SuccessView from './views/SuccessView.vue'
import ErrorView from './views/ErrorView.vue'
import { useNavigationStore } from './stores/navigation'
import { useCartStore } from './stores/cart'

const nav = useNavigationStore()
const cartStore = useCartStore()

const showCartBar = computed(() => {
  const hiddenViews = ['cart', 'success', 'error']
  return !hiddenViews.includes(nav.view) && cartStore.totalCount > 0
})
</script>
