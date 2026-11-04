import {
  Product,
  CartItem,
  User,
  Order,
  Coupon,
  AdminStats,
  FilterState,
  ProductVariant,
  UserAddress,
  OrderStatus,
  PaymentMethodType,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  DEFAULT_USER,
  ADMIN_USER,
  INITIAL_ORDERS,
} from '../data/mockData';

const STORAGE_KEYS = {
  PRODUCTS: 'nexora_products_v1',
  CART: 'nexora_cart_v1',
  WISHLIST: 'nexora_wishlist_v1',
  USER: 'nexora_user_v1',
  ORDERS: 'nexora_orders_v1',
  COUPONS: 'nexora_coupons_v1',
};

// Local storage helper
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export class NexoraAPIService {
  // PRODUCTS
  static getProducts(): Product[] {
    return getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }

  static getProductById(id: string): Product | undefined {
    const products = this.getProducts();
    return products.find((p) => p.id === id);
  }

  static saveProduct(product: Product): Product {
    const products = this.getProducts();
    const existingIndex = products.findIndex((p) => p.id === product.id);
    if (existingIndex >= 0) {
      products[existingIndex] = product;
    } else {
      products.unshift(product);
    }
    setStored(STORAGE_KEYS.PRODUCTS, products);
    return product;
  }

  static deleteProduct(id: string): boolean {
    const products = this.getProducts().filter((p) => p.id !== id);
    setStored(STORAGE_KEYS.PRODUCTS, products);
    return true;
  }

  static filterProducts(products: Product[], filters: FilterState): Product[] {
    return products.filter((p) => {
      // Category filter
      if (filters.category !== 'All' && p.category !== filters.category) return false;

      // Brand filter
      if (filters.brand && p.brand !== filters.brand) return false;

      // Price filter
      if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;

      // Rating filter
      if (p.rating < filters.minRating) return false;

      // In stock
      if (filters.inStockOnly && p.stock <= 0) return false;

      // Search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesTag = p.tagline.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        const matchesBrand = p.brand.toLowerCase().includes(query);
        if (!matchesName && !matchesTag && !matchesCategory && !matchesBrand) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });
  }

  // CART
  static getCart(): CartItem[] {
    return getStored<CartItem[]>(STORAGE_KEYS.CART, []);
  }

  static addToCart(product: Product, variant: ProductVariant, quantity: number = 1): CartItem[] {
    const cart = this.getCart();
    const itemId = `${product.id}-${variant.id}`;
    const existingIndex = cart.findIndex((item) => item.id === itemId);

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: itemId,
        product,
        variant,
        quantity,
      });
    }

    setStored(STORAGE_KEYS.CART, cart);
    return cart;
  }

  static updateCartQuantity(itemId: string, quantity: number): CartItem[] {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter((item) => item.id !== itemId);
    } else {
      const match = cart.find((item) => item.id === itemId);
      if (match) match.quantity = quantity;
    }
    setStored(STORAGE_KEYS.CART, cart);
    return cart;
  }

  static removeFromCart(itemId: string): CartItem[] {
    const cart = this.getCart().filter((item) => item.id !== itemId);
    setStored(STORAGE_KEYS.CART, cart);
    return cart;
  }

  static clearCart(): void {
    setStored(STORAGE_KEYS.CART, []);
  }

  // WISHLIST
  static getWishlist(): string[] {
    return getStored<string[]>(STORAGE_KEYS.WISHLIST, ['nx-prod-1', 'nx-prod-3']);
  }

  static toggleWishlist(productId: string): string[] {
    let wishlist = this.getWishlist();
    if (wishlist.includes(productId)) {
      wishlist = wishlist.filter((id) => id !== productId);
    } else {
      wishlist.push(productId);
    }
    setStored(STORAGE_KEYS.WISHLIST, wishlist);
    return wishlist;
  }

  // USER & AUTH
  static getCurrentUser(): User {
    return getStored<User>(STORAGE_KEYS.USER, DEFAULT_USER);
  }

  static setCurrentUser(user: User): void {
    setStored(STORAGE_KEYS.USER, user);
  }

  static login(email: string, role: 'customer' | 'admin' = 'customer'): User {
    if (role === 'admin' || email.includes('admin')) {
      this.setCurrentUser(ADMIN_USER);
      return ADMIN_USER;
    }
    const user = { ...DEFAULT_USER, email, name: email.split('@')[0] };
    this.setCurrentUser(user);
    return user;
  }

  static addAddress(address: UserAddress): User {
    const user = this.getCurrentUser();
    if (address.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }
    user.addresses.push(address);
    this.setCurrentUser(user);
    return user;
  }

  // ORDERS
  static getOrders(): Order[] {
    return getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  }

  static createOrder(params: {
    items: CartItem[];
    shippingAddress: UserAddress;
    paymentMethod: PaymentMethodType;
    couponCode?: string;
    discount?: number;
  }): Order {
    const subtotal = params.items.reduce(
      (sum, item) => sum + (item.product.price + item.variant.priceAdjustment) * item.quantity,
      0
    );
    const discount = params.discount || 0;
    const discountedSubtotal = Math.max(0, subtotal - discount);
    const tax = Math.round(discountedSubtotal * 0.08 * 100) / 100;
    const shippingCost = subtotal > 150 ? 0 : 15.00;
    const total = Math.round((discountedSubtotal + tax + shippingCost) * 100) / 100;

    const orderId = `NX-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingNumber = `NXR-TRACK-${Math.floor(100000 + Math.random() * 900000)}`;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);

    const newOrder: Order = {
      id: orderId,
      userId: this.getCurrentUser().id,
      items: params.items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        variantName: i.variant.name,
        variantColorHex: i.variant.colorHex,
        modelType: i.product.modelType,
        price: i.product.price + i.variant.priceAdjustment,
        quantity: i.quantity,
      })),
      subtotal,
      tax,
      shippingCost,
      discount,
      couponCode: params.couponCode,
      total,
      status: 'Processing',
      shippingAddress: params.shippingAddress,
      paymentMethod: params.paymentMethod,
      paymentStatus: 'Paid',
      createdAt: new Date().toISOString(),
      trackingNumber,
      estimatedDelivery: deliveryDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    // Deduct stock
    const products = this.getProducts();
    params.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.product.id);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
        const variant = prod.variants.find((v) => v.id === item.variant.id);
        if (variant) variant.stock = Math.max(0, variant.stock - item.quantity);
      }
    });
    setStored(STORAGE_KEYS.PRODUCTS, products);

    // Save order
    const orders = this.getOrders();
    orders.unshift(newOrder);
    setStored(STORAGE_KEYS.ORDERS, orders);

    // Clear cart
    this.clearCart();

    return newOrder;
  }

  static updateOrderStatus(orderId: string, status: OrderStatus): Order | undefined {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      setStored(STORAGE_KEYS.ORDERS, orders);
    }
    return order;
  }

  // COUPONS
  static getCoupons(): Coupon[] {
    return getStored<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  }

  static validateCoupon(code: string, subtotal: number): { valid: boolean; coupon?: Coupon; error?: string } {
    const coupons = this.getCoupons();
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) {
      return { valid: false, error: 'Invalid coupon code' };
    }
    if (subtotal < coupon.minSpend) {
      return {
        valid: false,
        error: `Minimum order spend of $${coupon.minSpend} required for this coupon`,
      };
    }
    return { valid: true, coupon };
  }

  static saveCoupon(coupon: Coupon): Coupon {
    const coupons = this.getCoupons();
    coupons.push(coupon);
    setStored(STORAGE_KEYS.COUPONS, coupons);
    return coupon;
  }

  // REVIEWS
  static addReview(productId: string, review: { rating: number; title: string; comment: string }): Product | undefined {
    const products = this.getProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) return undefined;

    const user = this.getCurrentUser();
    const newReview = {
      id: `rev-${Date.now()}`,
      userName: user.name,
      rating: review.rating,
      date: 'Just now',
      title: review.title,
      comment: review.comment,
      verified: true,
      helpfulCount: 0,
    };

    product.reviews.unshift(newReview);
    // Recalculate rating
    const totalRating = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    product.rating = Math.round((totalRating / product.reviews.length) * 10) / 10;
    product.reviewCount = product.reviews.length;

    setStored(STORAGE_KEYS.PRODUCTS, products);
    return product;
  }

  // ADMIN ANALYTICS
  static getAdminStats(): AdminStats {
    const orders = this.getOrders();
    const products = this.getProducts();

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const productsSold = orders.reduce(
      (sum, o) => sum + o.items.reduce((iSum, i) => iSum + i.quantity, 0),
      0
    );
    const lowStockCount = products.filter((p) => p.stock <= 5).length;

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders: orders.length,
      totalCustomers: 892 + orders.length,
      productsSold,
      conversionRate: 3.8,
      lowStockCount,
      monthlyRevenue: [
        { month: 'Jun', amount: 34200 },
        { month: 'Jul', amount: 48900 },
        { month: 'Aug', amount: 56100 },
        { month: 'Sep', amount: 62400 },
        { month: 'Oct', amount: 78900 },
        { month: 'Nov', amount: 89400 },
      ],
      categorySales: [
        { category: 'Electronics', count: 42, percentage: 38 },
        { category: 'Watches', count: 28, percentage: 26 },
        { category: 'Sneakers', count: 22, percentage: 20 },
        { category: 'Smartphones', count: 18, percentage: 16 },
      ],
    };
  }
}
