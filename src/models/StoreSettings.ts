import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStoreSettings extends Document {
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
  created_at: Date;
  updated_at: Date;
}

const StoreSettingsSchema = new Schema<IStoreSettings>(
  {
    general: {
      store_name: { type: String, default: 'Nobab Lungi' },
      store_logo: { type: String, default: null },
      store_favicon: { type: String, default: null },
      store_description: {
        type: String,
        default: 'Premium Handloom Lungi Collection in Bangladesh. Royal comfort, authentic weave.',
      },
      store_email: { type: String, default: 'support@nobablungi.com' },
      store_phone: { type: String, default: '+880 1712-345678' },
      whatsapp_number: { type: String, default: '+880 1712-345678' },
    },
    address: {
      store_address: { type: String, default: 'House 42, Road 11, Banani' },
      city: { type: String, default: 'Dhaka' },
      district: { type: String, default: 'Dhaka' },
      postal_code: { type: String, default: '1213' },
      country: { type: String, default: 'Bangladesh' },
    },
    social: {
      facebook_url: { type: String, default: 'https://facebook.com/nobablungi' },
      instagram_url: { type: String, default: 'https://instagram.com/nobablungi' },
      youtube_url: { type: String, default: null },
      tiktok_url: { type: String, default: null },
    },
    delivery: {
      inside_dhaka_charge: { type: Number, default: 70 },
      outside_dhaka_charge: { type: Number, default: 130 },
      free_delivery_min_amount: { type: Number, default: null },
      estimated_delivery_time: {
        type: String,
        default: '2-3 business days in Dhaka, 3-5 days outside Dhaka',
      },
    },
    payment: {
      cod_enabled: { type: Boolean, default: true },
      bkash_enabled: { type: Boolean, default: true },
      bkash_merchant_number: { type: String, default: '01700000000' },
      nagad_enabled: { type: Boolean, default: true },
      nagad_merchant_number: { type: String, default: '01700000000' },
      bank_transfer_enabled: { type: Boolean, default: false },
    },
    seo: {
      default_meta_title: {
        type: String,
        default: 'Nobab Lungi — Premium Handloom Lungi Collection in Bangladesh',
      },
      default_meta_description: {
        type: String,
        default:
          'Shop authentic 100% organic cotton handloom lungis from Bangladesh. Royal comfort, premium weave, fast home delivery.',
      },
      default_og_image: { type: String, default: null },
    },
    homepage: {
      products_per_page: { type: Number, default: 12 },
      featured_products_limit: { type: Number, default: 8 },
      new_arrivals_limit: { type: Number, default: 8 },
      best_sellers_limit: { type: Number, default: 8 },
    },
    maintenance: {
      maintenance_mode: { type: Boolean, default: false },
      maintenance_message: {
        type: String,
        default: 'We are performing scheduled maintenance. Please check back soon.',
      },
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

if (process.env.NODE_ENV !== 'production') {
  delete (mongoose.models as Record<string, unknown>).StoreSettings;
}

export const StoreSettings: Model<IStoreSettings> =
  (mongoose.models.StoreSettings as Model<IStoreSettings>) ||
  mongoose.model<IStoreSettings>('StoreSettings', StoreSettingsSchema);
