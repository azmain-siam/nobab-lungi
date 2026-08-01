import { connectToDatabase } from '@/lib/db';
import { Banner as BannerModel } from '@/models/Banner';
import { HomepageConfig as HomepageConfigModel } from '@/models/HomepageConfig';
import { Category as CategoryModel } from '@/models/Category';
import { Collection as CollectionModel } from '@/models/Collection';
import { Product as ProductModel } from '@/models/Product';
import { getStoreSettings } from '@/services/settings-service';
import type { Banner, HomepageConfig, StoreSettings, Category, Collection, ProductWithImages } from '@/types';

function mapDocToBanner(doc: Record<string, unknown>): Banner {
  return {
    id: Number(doc.id || doc._id),
    title: doc.title as string,
    subtitle: (doc.subtitle as string) ?? null,
    description: (doc.description as string) ?? null,
    desktop_image: (doc.desktop_image as string) || (doc.image_url as string) || '',
    mobile_image: (doc.mobile_image as string) ?? null,
    primary_btn_text: (doc.primary_btn_text as string) ?? null,
    primary_btn_url: (doc.primary_btn_url as string) || (doc.link as string) || null,
    secondary_btn_text: (doc.secondary_btn_text as string) ?? null,
    secondary_btn_url: (doc.secondary_btn_url as string) ?? null,
    is_active: (doc.is_active as boolean) ?? true,
    is_primary: (doc.is_primary as boolean) ?? false,
    sort_order: (doc.sort_order as number) ?? 0,
    start_date: doc.start_date ? new Date(doc.start_date as Date).toISOString() : null,
    end_date: doc.end_date ? new Date(doc.end_date as Date).toISOString() : null,
    created_at: doc.created_at ? (doc.created_at as Date).toISOString() : new Date().toISOString(),
    updated_at: doc.updated_at ? (doc.updated_at as Date).toISOString() : new Date().toISOString(),
  };
}

export async function getAdminBanners(): Promise<Banner[]> {
  try {
    await connectToDatabase();
    const docs = await BannerModel.find().sort({ sort_order: 1, created_at: -1 }).lean();
    return docs.map((doc) => mapDocToBanner(doc as unknown as Record<string, unknown>));
  } catch (error) {
    console.error('Error fetching admin banners:', error);
    return [];
  }
}

export async function getPublicBanners(): Promise<Banner[]> {
  try {
    await connectToDatabase();
    const now = new Date();

    const docs = await BannerModel.find({
      is_active: true,
      $and: [
        { $or: [{ start_date: null }, { start_date: { $lte: now } }] },
        { $or: [{ end_date: null }, { end_date: { $gte: now } }] },
      ],
    })
      .sort({ is_primary: -1, sort_order: 1 })
      .lean();

    return docs.map((doc) => mapDocToBanner(doc as unknown as Record<string, unknown>));
  } catch (error) {
    console.error('Error fetching public banners:', error);
    return [];
  }
}

export async function getHomepageConfig(): Promise<HomepageConfig> {
  try {
    await connectToDatabase();
    const existingConfig = await HomepageConfigModel.findOne().lean();
    const doc = (existingConfig || (await HomepageConfigModel.create({})).toObject()) as unknown as Record<string, unknown>;

    return {
      sections: (doc.sections as HomepageConfig['sections']) || [],
      featured_category_ids: (doc.featured_category_ids as number[]) || [],
      featured_collection_ids: (doc.featured_collection_ids as number[]) || [],
      featured_product_ids: (doc.featured_product_ids as string[]) || [],
      best_seller_product_ids: (doc.best_seller_product_ids as string[]) || [],
      new_arrivals_config: (doc.new_arrivals_config as HomepageConfig['new_arrivals_config']) || {
        limit: 8,
        is_active: true,
      },
      brand_story: (doc.brand_story as HomepageConfig['brand_story']) || {
        title: 'The Legacy of Nobab Heritage Lungi',
        description:
          'Woven by master artisans of Bangladesh using 100% organic cotton threads and century-old loom techniques.',
        image_url: null,
        button_text: 'Explore Craftsmanship',
        button_url: '/about',
        is_active: true,
      },
      why_choose_us: (doc.why_choose_us as HomepageConfig['why_choose_us']) || [],
      newsletter: (doc.newsletter as HomepageConfig['newsletter']) || {
        heading: 'Join Nobab Heritage Circle',
        description:
          'Subscribe to receive exclusive drops, Eid special collections, and VIP offers.',
        is_enabled: true,
      },
      created_at: doc.created_at ? (doc.created_at as Date).toISOString() : new Date().toISOString(),
      updated_at: doc.updated_at ? (doc.updated_at as Date).toISOString() : new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching homepage config:', error);
    return {
      sections: [],
      featured_category_ids: [],
      featured_collection_ids: [],
      featured_product_ids: [],
      best_seller_product_ids: [],
      new_arrivals_config: { limit: 8, is_active: true },
      brand_story: {
        title: 'The Legacy of Nobab Heritage Lungi',
        description:
          'Woven by master artisans of Bangladesh using 100% organic cotton threads and century-old loom techniques.',
        image_url: null,
        button_text: 'Explore Craftsmanship',
        button_url: '/about',
        is_active: true,
      },
      why_choose_us: [],
      newsletter: {
        heading: 'Join Nobab Heritage Circle',
        description: 'Subscribe to receive exclusive drops.',
        is_enabled: true,
      },
    };
  }
}

export interface PublicHomepageData {
  banners: Banner[];
  config: HomepageConfig;
  storeSettings: StoreSettings;
  categories: Category[];
  collections: Collection[];
  featuredProducts: ProductWithImages[];
  bestSellers: ProductWithImages[];
  newArrivals: ProductWithImages[];
}

export async function getPublicHomepageData(): Promise<PublicHomepageData> {
  try {
    await connectToDatabase();

    const [banners, config, storeSettings] = await Promise.all([
      getPublicBanners(),
      getHomepageConfig(),
      getStoreSettings(),
    ]);

    // Categories fetch
    let categories: Category[] = [];
    try {
      const catQuery: Record<string, unknown> = { is_active: true };
      if (config.featured_category_ids && config.featured_category_ids.length > 0) {
        catQuery.id = { $in: config.featured_category_ids };
      }
      const catDocs = await CategoryModel.find(catQuery).sort({ parent_type: 1, sort_order: 1 }).lean();
      categories = catDocs.map((c) => ({
        id: Number(c.id || c._id),
        name: c.name as string,
        slug: c.slug as string,
        description: (c.description as string) ?? null,
        image_url: (c.image_url as string) ?? null,
        parent_type: c.parent_type as 'lungi' | 'saree',
        sort_order: (c.sort_order as number) ?? 0,
        is_active: (c.is_active as boolean) ?? true,
        product_count: 0,
        created_at: c.created_at ? (c.created_at as Date).toISOString() : new Date().toISOString(),
      }));
    } catch (e) {
      console.error('Error fetching homepage categories:', e);
    }

    // Collections fetch
    let collections: Collection[] = [];
    try {
      const collQuery: Record<string, unknown> = { is_active: true };
      if (config.featured_collection_ids && config.featured_collection_ids.length > 0) {
        collQuery.id = { $in: config.featured_collection_ids };
      }
      const collDocs = await CollectionModel.find(collQuery).sort({ is_featured: -1, sort_order: 1 }).lean();
      collections = collDocs.map((c) => ({
        id: Number(c.id || c._id),
        name: c.name as string,
        slug: c.slug as string,
        description: (c.description as string) ?? null,
        cover_image: (c.cover_image as string) ?? null,
        banner_url: (c.banner_url as string) ?? null,
        is_featured: (c.is_featured as boolean) ?? false,
        sort_order: (c.sort_order as number) ?? 0,
        is_active: (c.is_active as boolean) ?? true,
        seo_title: (c.seo_title as string) ?? null,
        seo_description: (c.seo_description as string) ?? null,
        created_at: c.created_at ? (c.created_at as Date).toISOString() : new Date().toISOString(),
        updated_at: c.updated_at ? (c.updated_at as Date).toISOString() : new Date().toISOString(),
      }));
    } catch (e) {
      console.error('Error fetching homepage collections:', e);
    }

    // Helper mapper for products
    const mapDocToProduct = (doc: Record<string, unknown>): ProductWithImages => {
      const images = (doc.product_images as Record<string, unknown>[]) || [];
      const rawCollectionIds = doc.collection_ids || doc.collections;
      const collection_ids = Array.isArray(rawCollectionIds)
        ? (rawCollectionIds as unknown[]).map((id) => Number(id)).filter((id) => !isNaN(id))
        : [];

      return {
        id: String(doc._id),
        name: doc.name as string,
        slug: doc.slug as string,
        sku: (doc.sku as string) ?? null,
        short_description: (doc.short_description as string) ?? null,
        description: (doc.description as string) ?? null,
        price: doc.price as number,
        discount_price: (doc.discount_price as number) ?? null,
        stock: doc.stock as number,
        category_id: (doc.category_id as number) ?? null,
        collection_ids,
        fabric: (doc.fabric as string) ?? null,
        pattern: (doc.pattern as string) ?? null,
        color: (doc.color as string) ?? null,
        weight: (doc.weight as string) ?? null,
        country_of_origin: (doc.country_of_origin as string) ?? 'Bangladesh',
        status: (doc.status as 'published' | 'draft') ?? 'published',
        is_featured: (doc.is_featured as boolean) ?? false,
        is_best_seller: (doc.is_best_seller as boolean) ?? false,
        is_new_arrival: (doc.is_new_arrival as boolean) ?? false,
        is_active: (doc.is_active as boolean) ?? true,
        seo_title: (doc.seo_title as string) ?? null,
        seo_description: (doc.seo_description as string) ?? null,
        created_at: doc.created_at ? (doc.created_at as Date).toISOString() : new Date().toISOString(),
        updated_at: doc.updated_at ? (doc.updated_at as Date).toISOString() : new Date().toISOString(),
        product_images: images.map((img) => ({
          id: img._id ? String(img._id) : String(doc._id),
          product_id: String(doc._id),
          url: img.url as string,
          alt_text: (img.alt_text as string) ?? null,
          sort_order: (img.sort_order as number) ?? 0,
          is_cover: (img.is_cover as boolean) ?? false,
        })),
      };
    };

    // Featured Products
    let featuredProducts: ProductWithImages[] = [];
    try {
      const featQuery: Record<string, unknown> = { status: 'published', is_active: true };
      if (config.featured_product_ids && config.featured_product_ids.length > 0) {
        featQuery._id = { $in: config.featured_product_ids };
      } else {
        featQuery.is_featured = true;
      }
      const featDocs = await ProductModel.find(featQuery).limit(8).lean();
      featuredProducts = featDocs.map((p) => mapDocToProduct(p as unknown as Record<string, unknown>));
    } catch (e) {
      console.error('Error fetching featured products:', e);
    }

    // Best Sellers
    let bestSellers: ProductWithImages[] = [];
    try {
      const bsQuery: Record<string, unknown> = { status: 'published', is_active: true };
      if (config.best_seller_product_ids && config.best_seller_product_ids.length > 0) {
        bsQuery._id = { $in: config.best_seller_product_ids };
      } else {
        bsQuery.is_best_seller = true;
      }
      const bsDocs = await ProductModel.find(bsQuery).limit(8).lean();
      bestSellers = bsDocs.map((p) => mapDocToProduct(p as unknown as Record<string, unknown>));
    } catch (e) {
      console.error('Error fetching best sellers:', e);
    }

    // New Arrivals
    let newArrivals: ProductWithImages[] = [];
    try {
      const limit = config.new_arrivals_config?.limit || 8;
      const naDocs = await ProductModel.find({ status: 'published', is_active: true, is_new_arrival: true })
        .sort({ created_at: -1 })
        .limit(limit)
        .lean();
      newArrivals = naDocs.map((p) => mapDocToProduct(p as unknown as Record<string, unknown>));
    } catch (e) {
      console.error('Error fetching new arrivals:', e);
    }

    return {
      banners,
      config,
      storeSettings,
      categories,
      collections,
      featuredProducts,
      bestSellers,
      newArrivals,
    };
  } catch (error) {
    console.error('Error fetching public homepage data:', error);
    const fallbackBanners = await getPublicBanners();
    const fallbackConfig = await getHomepageConfig();
    const fallbackSettings = await getStoreSettings();
    return {
      banners: fallbackBanners,
      config: fallbackConfig,
      storeSettings: fallbackSettings,
      categories: [],
      collections: [],
      featuredProducts: [],
      bestSellers: [],
      newArrivals: [],
    };
  }
}
