import { create } from "zustand";

interface OrderItemExtra {
  optionItemId: number;
  selected: boolean;
}

interface OrderItem {
  shopId: number;
  quantity: number;
  totalPrice: number;
  specialInstructions?: string;
  menuId: number;
  orderItemExtras: OrderItemExtra[];
  picture: string;
  name: string;
  orderId: string;
}

interface Order {
  canteenId: number;
  addressId: number;
  orderItems: OrderItem[];
  totalPrice: number;
  shippingFee: number;
  amount: number;
  transactionType: string;
  transactionDate: string;
}

interface OrderStore {
  order: Order;
  addOrderItem: (orderItem: OrderItem) => void;
  removeOrderItem: (orderId: string) => void;
  clearOrder: () => void;
  updateOrderDetails: (details: Partial<Order>) => void;
  sendOrderPayload: () => Order;
}

const useOrderStore = create<OrderStore>((set) => ({
  // Initialize with a default order structure
  order: {
    canteenId: 0,
    addressId: 0,
    orderItems: [],
    totalPrice: 0,
    shippingFee: 0,
    amount: 0,
    transactionType: "",
    transactionDate: new Date().toISOString(),
  },

  // Add a new order item
  addOrderItem: (orderItem) =>
    set((state) => ({
      order: {
        ...state.order,
        orderItems: [...state.order.orderItems, orderItem],
      },
    })),

  // Remove an order item by menuId
  removeOrderItem: (orderId) =>
    set((state) => ({
      order: {
        ...state.order,
        orderItems: state.order.orderItems.filter(
          (item) => item.orderId !== orderId
        ),
      },
    })),

  // Clear the entire order
  clearOrder: () =>
    set(() => ({
      order: {
        canteenId: 0,
        addressId: 0,
        orderItems: [],
        totalPrice: 0,
        shippingFee: 0,
        amount: 0,
        transactionType: "",
        transactionDate: new Date().toISOString(),
      },
    })),

  // Update order details like totalPrice, shippingFee, etc.
  updateOrderDetails: (details) =>
    set((state) => ({
      order: {
        ...state.order,
        ...details,
      },
    })),

  sendOrderPayload: () => {
    const { order } = useOrderStore.getState();
    const payload = {
      canteenId: order.canteenId,
      addressId: order.addressId,
      totalPrice: order.totalPrice,
      shippingFee: order.shippingFee,
      amount: order.amount,
      transactionType: order.transactionType,
      transactionDate: order.transactionDate,
      orderItems: order.orderItems.map(
        ({ picture, name, orderId, ...rest }) => ({
          ...rest,
        })
      ),
    };

    return payload;
  },
}));

export default useOrderStore;
