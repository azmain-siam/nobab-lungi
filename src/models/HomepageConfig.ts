import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHomepageSection {
  key: string;
  name: string;
  is_visible: boolean;
  sort_order: number;
}

export interface IWhyChooseUsCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  sort_order: number;
}

export interface IHomepageConfig extends Document {
  sections: IHomepageSection[];
  featured_category_ids: number[];
  featured_collection_ids: number[];
  featured_product_ids: string[];
  best_seller_product_ids: string[];
  new_arrivals_config: {
    limit: number;
    is_active: boolean;
  };
  brand_story: {
    title: string;
    description: string;
    image_url?: string | null;
    button_text?: string | null;
    button_url?: string | null;
    is_active: boolean;
  };
  why_choose_us: IWhyChooseUsCard[];
  newsletter: {
    heading: string;
    description: string;
    is_enabled: boolean;
  };
  created_at: Date;
  updated_at: Date;
}

const HomepageSectionSchema = new Schema<IHomepageSection>(
  {
    key: { type: String, required: true },
    name: { type: String, required: true },
    is_visible: { type: Boolean, default: true },
    sort_order: { type: Number, default: 0 },
  },
  { _id: false }
);

const WhyChooseUsCardSchema = new Schema<IWhyChooseUsCard>(
  {
    id: { type: String, required: true },
    icon: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    sort_order: { type: Number, default: 0 },
  },
  { _id: false }
);

const HomepageConfigSchema = new Schema<IHomepageConfig>(
  {
    sections: {
      type: [HomepageSectionSchema],
      default: [
        { key: 'hero', name: 'Hero Banner Carousel', is_visible: true, sort_order: 1 },
        { key: 'featured_categories', name: 'Featured Categories', is_visible: true, sort_order: 2 },
        { key: 'featured_collections', name: 'Featured Collections', is_visible: true, sort_order: 3 },
        { key: 'new_arrivals', name: 'New Arrivals Showcase', is_visible: true, sort_order: 4 },
        { key: 'best_sellers', name: 'Best Sellers Showcase', is_visible: true, sort_order: 5 },
        { key: 'brand_story', name: 'Heritage Brand Story', is_visible: true, sort_order: 6 },
        { key: 'why_choose_us', name: 'Why Choose Nobab Lungi', is_visible: true, sort_order: 7 },
        { key: 'testimonials', name: 'Customer Reviews', is_visible: true, sort_order: 8 },
        { key: 'instagram_gallery', name: 'Social Instagram Feed', is_visible: false, sort_order: 9 },
        { key: 'newsletter', name: 'Newsletter Subscription', is_visible: true, sort_order: 10 },
      ],
    },
    featured_category_ids: { type: [Number], default: [] },
    featured_collection_ids: { type: [Number], default: [] },
    featured_product_ids: { type: [String], default: [] },
    best_seller_product_ids: { type: [String], default: [] },
    new_arrivals_config: {
      limit: { type: Number, default: 8 },
      is_active: { type: Boolean, default: true },
    },
    brand_story: {
      title: { type: String, default: 'The Legacy of Nobab Heritage Lungi' },
      description: {
        type: String,
        default:
          'Woven by master artisans of Bangladesh using 100% organic cotton threads and century-old loom techniques.',
      },
      image_url: { type: String, default: null },
      button_text: { type: String, default: 'Explore Craftsmanship' },
      button_url: { type: String, default: '/about' },
      is_active: { type: Boolean, default: true },
    },
    why_choose_us: {
      type: [WhyChooseUsCardSchema],
      default: [
        {
          id: 'card-1',
          icon: 'Sparkles',
          title: '100% Organic Cotton',
          description: 'Ultra-breathable handloom weave crafted for ultimate comfort.',
          sort_order: 1,
        },
        {
          id: 'card-2',
          icon: 'ShieldCheck',
          title: 'Authentic Heritage',
          description: 'Preserving Bangladesh traditional loom artistry since generations.',
          sort_order: 2,
        },
        {
          id: 'card-3',
          icon: 'Truck',
          title: 'Fast Nationwide Delivery',
          description: 'Direct cash-on-delivery shipping across all districts.',
          sort_order: 3,
        },
        {
          id: 'card-4',
          icon: 'RefreshCw',
          title: 'Easy Replacement Guarantee',
          description: 'Hassle-free 7-day return & exchange policy.',
          sort_order: 4,
        },
      ],
    },
    newsletter: {
      heading: { type: String, default: 'Join Nobab Heritage Circle' },
      description: { type: String, default: 'Subscribe to receive exclusive drops, Eid special collections, and VIP offers.' },
      is_enabled: { type: Boolean, default: true },
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

if (process.env.NODE_ENV !== 'production') {
  delete (mongoose.models as Record<string, unknown>).HomepageConfig;
}

export const HomepageConfig: Model<IHomepageConfig> =
  (mongoose.models.HomepageConfig as Model<IHomepageConfig>) ||
  mongoose.model<IHomepageConfig>('HomepageConfig', HomepageConfigSchema);
