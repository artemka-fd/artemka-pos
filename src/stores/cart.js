import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    paymentMethod: 'cash',
    showQr: false,
  }),
  getters: {
    totalCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalSum: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    formattedTotalSum: (state) => {
      const sum = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
      return sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    },
    getQuantity: (state) => (id) => {
      const item = state.items.find((i) => i.id === id)
      return item ? item.quantity : 0
    },
  },
  actions: {
    addItem(product) {
      const existing = this.items.find((i) => i.id === product.id)
      if (existing) {
        existing.quantity++
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          category: product.category,
          quantity: 1,
          image: product.image || '/assets/product-placeholder.png',
        })
      }
    },
    removeItem(id) {
      const index = this.items.findIndex((i) => i.id === id)
      if (index !== -1) {
        if (this.items[index].quantity > 1) {
          this.items[index].quantity--
        } else {
          this.items.splice(index, 1)
        }
      }
    },
    deleteItem(id) {
      const index = this.items.findIndex((i) => i.id === id)
      if (index !== -1) this.items.splice(index, 1)
    },
    updateItemPrice(id, newPrice) {
      const item = items.value.find(i => i.id === id)
      if (item) {
        item.price = Number(newPrice)
      }
    },
    setPaymentMethod(method) {
      this.paymentMethod = method
    },
    toggleShowQr() {
      this.showQr = !this.showQr
    },
    clearCart() {
      this.items = []
      this.showQr = false
    },
  },
})
