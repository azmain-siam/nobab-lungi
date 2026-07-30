// ============================================================
// Supabase Database Types
// These mirror the database schema exactly.
// Generated manually; update if schema changes.
// For production, generate with: npx supabase gen types typescript
// ============================================================

export type UserRole     = 'admin' | 'customer';
export type OrderStatus  = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type PaymentMethod = 'cod' | 'bkash' | 'nagad';
export type ParentType   = 'lungi' | 'saree';
export type CouponType   = 'percentage' | 'fixed';

// Shipping address snapshot stored in orders.shipping_address (JSONB)
export interface ShippingAddressSnapshot {
  name:        string;
  phone:       string;
  district:    string;
  upazila:     string;
  address:     string;
  postal_code: string | null;
}

// Table row types
export interface Profile {
  id:         string;
  name:       string | null;
  email:      string | null;
  phone:      string | null;
  role:       UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id:          string;
  user_id:     string;
  name:        string;
  phone:       string;
  district:    string;
  upazila:     string;
  address:     string;
  postal_code: string | null;
  is_default:  boolean;
  created_at:  string;
}

export interface Category {
  id:            number;
  name:          string;
  slug:          string;
  description:   string | null;
  image_url:     string | null;
  parent_type:   ParentType;
  sort_order:    number;
  is_active?:    boolean;
  product_count?: number;
  created_at:    string;
}

export interface Collection {
  id:          number;
  name:        string;
  slug:        string;
  description: string | null;
  banner_url:  string | null;
  is_featured: boolean;
  sort_order:  number;
  created_at:  string;
  updated_at:  string;
}

export interface Product {
  id:              string;
  name:            string;
  slug:            string;
  sku:             string | null;
  description:     string | null;
  price:           number;    // whole BDT
  discount_price:  number | null;
  stock:           number;
  category_id:     number | null;
  is_featured:     boolean;
  is_best_seller:  boolean;
  is_new_arrival:  boolean;
  is_active:       boolean;
  seo_title:       string | null;
  seo_description: string | null;
  created_at:      string;
  updated_at:      string;
}

export interface ProductImage {
  id:         string;
  product_id: string;
  url:        string;
  alt_text:   string | null;
  sort_order: number;
}

export interface CollectionProduct {
  collection_id: number;
  product_id:    string;
}

export interface Order {
  id:               string;
  user_id:          string | null;
  order_number:     string;
  status:           OrderStatus;
  subtotal:         number;
  delivery_charge:  number;
  discount:         number;
  total:            number;
  payment_method:   PaymentMethod;
  payment_status:   PaymentStatus;
  shipping_address: ShippingAddressSnapshot;
  transaction_id:   string | null;
  coupon_code:      string | null;
  notes:            string | null;
  created_at:       string;
  updated_at:       string;
}

export interface OrderItem {
  id:            string;
  order_id:      string;
  product_id:    string | null;
  product_name:  string;
  product_image: string | null;
  price:         number;   // whole BDT, at time of order
  quantity:      number;
}

export interface Coupon {
  id:                  number;
  code:                string;
  type:                CouponType;
  value:               number;
  minimum_amount:      number;
  max_discount_amount: number | null;
  usage_limit:         number | null;
  used_count:          number;
  start_date:          string | null;
  end_date:            string | null;
  is_active:           boolean;
  created_at:          string;
}

export interface Review {
  id:         string;
  user_id:    string;
  product_id: string;
  rating:     number;
  comment:    string | null;
  created_at: string;
}

export interface Wishlist {
  id:         string;
  user_id:    string;
  product_id: string;
  created_at: string;
}

export interface Banner {
  id:         number;
  title:      string;
  subtitle:   string | null;
  image_url:  string;
  link:       string | null;
  sort_order: number;
  is_active:  boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id:         string;
  name:       string;
  email:      string | null;
  phone:      string | null;
  message:    string;
  is_read:    boolean;
  created_at: string;
}

// ============================================================
// Enriched / joined types used in the application
// ============================================================

export interface ProductWithImages extends Product {
  product_images: ProductImage[];
}

export interface ProductWithCategory extends Product {
  categories: Category | null;
}

export interface ProductFull extends Product {
  product_images: ProductImage[];
  categories:     Category | null;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}
