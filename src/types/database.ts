// ============================================================
// Supabase Database Types
// These mirror the database schema exactly.
// Generated manually; update if schema changes.
// For production, generate with: npx supabase gen types typescript
// ============================================================

export type UserRole     = 'admin' | 'customer';
export type OrderStatus  = 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
export type PaymentStatus = 'unpaid' | 'pending_verification' | 'paid' | 'refunded';

export interface TimelineEvent {
  status:     string;
  message:    string;
  timestamp:  string;
  updated_by?: string;
}
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
  id:              number;
  name:            string;
  slug:            string;
  description:     string | null;
  cover_image:     string | null;
  banner_url:      string | null;
  is_featured:     boolean;
  sort_order:      number;
  is_active?:      boolean;
  seo_title?:      string | null;
  seo_description?: string | null;
  product_count?:  number;
  created_at:      string;
  updated_at:      string;
}

export interface Product {
  id:                string;
  name:              string;
  slug:              string;
  sku:               string | null;
  short_description?: string | null;
  description:       string | null;
  price:             number;    // whole BDT
  discount_price:    number | null;
  stock:             number;
  category_id:       number | null;
  collection_ids?:   number[];
  fabric?:           string | null;
  pattern?:          string | null;
  color?:            string | null;
  weight?:           string | null;
  country_of_origin?: string;
  status?:           'published' | 'draft';
  is_featured:       boolean;
  is_best_seller:    boolean;
  is_new_arrival:    boolean;
  is_active:         boolean;
  seo_title:         string | null;
  seo_description:   string | null;
  created_at:        string;
  updated_at:        string;
}

export interface ProductImage {
  id:         string;
  product_id: string;
  url:        string;
  alt_text:   string | null;
  sort_order: number;
  is_cover?:  boolean;
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
  courier?:         string | null;
  tracking_number?: string | null;
  delivery_status?: string | null;
  notes:            string | null;
  admin_notes?:     string | null;
  timeline?:        TimelineEvent[];
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
  collections:    Collection[];
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export interface CustomerListItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: string;
  total_orders: number;
  total_spent: number;
  last_order_date: string | null;
  account_status: 'Active' | 'Blocked';
  created_at: string;
}

export interface CustomerAddressItem {
  id: string;
  name: string;
  phone: string;
  district: string;
  address: string;
  is_default: boolean;
}

export interface CustomerDetails {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  stats: {
    total_orders: number;
    total_spent: number;
    avg_order_value: number;
    last_order_date: string | null;
  };
  addresses: CustomerAddressItem[];
  recent_orders: OrderWithItems[];
}

export interface StoreSettings {
  general: {
    store_name: string;
    store_logo: string | null;
    store_favicon: string | null;
    store_description: string | null;
    store_email: string;
    store_phone: string;
    whatsapp_number: string;
  };
  address: {
    store_address: string;
    city: string;
    district: string;
    postal_code: string;
    country: string;
  };
  social: {
    facebook_url: string | null;
    instagram_url: string | null;
    youtube_url: string | null;
    tiktok_url: string | null;
  };
  delivery: {
    inside_dhaka_charge: number;
    outside_dhaka_charge: number;
    free_delivery_min_amount: number | null;
    estimated_delivery_time: string;
  };
  payment: {
    cod_enabled: boolean;
    bkash_enabled: boolean;
    bkash_merchant_number: string | null;
    nagad_enabled: boolean;
    nagad_merchant_number: string | null;
    bank_transfer_enabled: boolean;
  };
  seo: {
    default_meta_title: string;
    default_meta_description: string;
    default_og_image: string | null;
  };
  homepage: {
    products_per_page: number;
    featured_products_limit: number;
    new_arrivals_limit: number;
    best_sellers_limit: number;
  };
  maintenance: {
    maintenance_mode: boolean;
    maintenance_message: string;
  };
  created_at?: string;
  updated_at?: string;
}
