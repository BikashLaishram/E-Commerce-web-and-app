export type CategoryType = 
  | 'All'
  | 'Electronics'
  | 'Smartphones'
  | 'Laptops'
  | 'Fashion'
  | 'Sneakers'
  | 'Watches'
  | 'Accessories'
  | 'Gaming'
  | 'Home & Living'
  | 'Beauty & Lifestyle';

export type Model3DType = 'headphone' | 'sneaker' | 'watch' | 'drone' | 'phone';

export interface ProductVariant {
  id: string;
  name: string;
  colorName: string;
  colorHex: string;
  priceAdjustment: number;
  stock: number;
  badge?: string;
}

export interface ProductSpec {
  name: string;
  value: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  category: CategoryType;
  brand: string;
  rating: number;
  reviewCount: number;
  stock: number;
  modelType: Model3DType;
  images: string[];
  variants: ProductVariant[];
  specs: ProductSpec[];
  featured?: boolean;
  trending?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  limitedDeal?: boolean;
  dealEndsAt?: string;
  reviews: ProductReview[];
  warranty: string;
  shippingInfo: string;
}

export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface UserAddress {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatar?: string;
  phone?: string;
  addresses: UserAddress[];
  joinedDate: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantName: string;
  variantColorHex: string;
  modelType: Model3DType;
  price: number;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type PaymentMethodType = 'stripe' | 'razorpay' | 'card' | 'upi' | 'netbanking' | 'cod';

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: OrderStatus;
  shippingAddress: UserAddress;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  createdAt: string;
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  description: string;
  expiresAt: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  productsSold: number;
  conversionRate: number;
  lowStockCount: number;
  monthlyRevenue: { month: string; amount: number }[];
  categorySales: { category: string; count: number; percentage: number }[];
}

export interface FilterState {
  category: CategoryType;
  brand: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
  searchQuery: string;
}
