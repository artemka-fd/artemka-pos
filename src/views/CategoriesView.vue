<template>
  <div class="flex flex-col gap-6 pb-28">
    <SearchBar
      v-model="searchInput"
      @search="handleSearch"
      @clear="searchInput = ''"
    />
    <div class="px-2">
      <h1 class="mb-4 text-[28px] font-bold leading-[1.2] text-black/80">Категорії</h1>

      <p v-if="catalog.isLoading" class="text-sm text-black/50">Завантаження...</p>
      <p v-else-if="catalog.error" class="text-sm text-red-600">{{ catalog.error }}</p>

      <div v-else class="grid grid-cols-2 gap-4">
        <CategoryCard
          v-for="category in catalog.categories"
          :key="category.slug"
          :category="category"
          @select="nav.goToCategory"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import CategoryCard from '@/components/CategoryCard.vue'
import { useCatalogStore } from '@/stores/catalog'
import { useNavigationStore } from '@/stores/navigation'

const catalog = useCatalogStore()
const nav = useNavigationStore()
const searchInput = ref('')

function handleSearch(query) {
  const q = query.trim()
  if (q) nav.goToSearch(q)
}
</script>
