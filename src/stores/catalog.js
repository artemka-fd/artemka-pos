import { defineStore } from 'pinia'

const BRANDS_URL = import.meta.env.VITE_BRANDS_URL
const CATEGORIES_URL = import.meta.env.VITE_CATEGORIES_URL
const PLACEHOLDER_IMAGE = '/assets/product-placeholder.png'

function mapCategory(row) {
  return {
    slug: row.slug?.trim() || '',
    emoji: row.emoji || '',
    label: row.label || '',
    sortOrder: Number(row.sort_order) || 0,
  }
}

function isActive(row) {
  return String(row.is_active).trim().toUpperCase() === 'TRUE'
}

function mapProduct(row) {
  return {
    id: Number(row.id) || 0,
    brand: row.brand || '',
    price: Number(row.price) || 0,
    name: row.name || '',
    category: row.category || '',
    image: row.image || PLACEHOLDER_IMAGE,
    is_active: true,
  }
}

export const useCatalogStore = defineStore('catalog', {
  state: () => ({
    categories: [],
    products: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    getCategory: (state) => (slug) =>
      state.categories.find((c) => c.slug === slug),

    productsByCategory: (state) => (slug) =>
      state.products.filter((p) => p.category === slug),

    searchProducts: (state) => (query) => {
      const q = query?.trim().toLowerCase()
      if (!q) return []

      const categoryLabels = Object.fromEntries(
        state.categories.map((c) => [c.slug, c.label.toLowerCase()])
      )

      return state.products.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(q)
        const brandMatch = p.brand.toLowerCase().includes(q)
        const categoryMatch = p.category.toLowerCase().includes(q)
        const labelMatch = categoryLabels[p.category]?.includes(q) ?? false

        return nameMatch || brandMatch || categoryMatch || labelMatch
      })
    },
  },

  actions: {
    async fetchCatalog() {
      this.isLoading = true
      this.error = null

      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch(CATEGORIES_URL),
          fetch(BRANDS_URL),
        ])

        if (!categoriesRes.ok) throw new Error(`Categories: HTTP ${categoriesRes.status}`)
        if (!productsRes.ok) throw new Error(`Products: HTTP ${productsRes.status}`)

        const [categoriesRaw, productsRaw] = await Promise.all([
          categoriesRes.json(),
          productsRes.json(),
        ])

        this.categories = categoriesRaw
          .map(mapCategory)
          .sort((a, b) => a.sortOrder - b.sortOrder)

        this.products = productsRaw
          .filter(isActive)
          .map(mapProduct)
      } catch (e) {
        console.error('Помилка завантаження каталогу:', e)
        this.error = e.message || 'Не вдалося завантажити каталог'
      } finally {
        this.isLoading = false
      }
    },
  },
})