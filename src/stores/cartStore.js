import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const SHIPPING_THRESHOLD = 50; // Free shipping above €50
const DEFAULT_SHIPPING_COST = 4.95;

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      // Get cart summary
      getCartSummary: () => {
        const items = get().items;
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shippingCost = subtotal >= SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_COST;
        const total = subtotal + shippingCost;
        
        return {
          itemCount,
          subtotal,
          shippingCost,
          total,
          freeShippingThreshold: SHIPPING_THRESHOLD,
          amountUntilFreeShipping: Math.max(0, SHIPPING_THRESHOLD - subtotal)
        };
      },

      // Add item to cart
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id);
          
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              isOpen: true
            };
          }
          
          return {
            items: [...state.items, {
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              image: product.images?.[0] || null,
              quantity
            }],
            isOpen: true
          };
        });
      },

      // Update item quantity
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          )
        }));
      },

      // Remove item from cart
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId)
        }));
      },

      // Clear cart
      clearCart: () => {
        set({ items: [] });
      },

      // Toggle cart visibility
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      // Open cart
      openCart: () => {
        set({ isOpen: true });
      },

      // Close cart
      closeCart: () => {
        set({ isOpen: false });
      }
    }),
    {
      name: 'bereschoon-cart',
      version: 1
    }
  )
);

export default useCartStore;

