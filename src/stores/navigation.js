import { defineStore } from 'pinia'

export const useNavigationStore = defineStore('navigation', {
  state: () => ({
    view: 'categories',
    selectedCategory: null,
    searchQuery: '',
  }),
  actions: {
    goToCategories() {
      this.view = 'categories'
      this.selectedCategory = null
      this.searchQuery = ''
    },
    goToCategory(slug) {
      this.view = 'category'
      this.selectedCategory = slug
      this.searchQuery = ''
    },
    goToSearch(query) {
      this.view = 'search'
      this.searchQuery = query
      this.selectedCategory = null
    },
    goToCart() {
      this.view = 'cart'
    },
    goToSuccess() {
      this.view = 'success'
    },
    goToError() {
      this.view = 'error'
    },
    goBack() {
      if (this.view === 'cart') {
        this.goToCategories()
      } else if (this.view === 'category' || this.view === 'search') {
        this.goToCategories()
      } else if (this.view === 'success' || this.view === 'error') {
        this.goToCategories()
      }
    },
  },
})
