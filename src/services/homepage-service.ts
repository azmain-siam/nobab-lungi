import { connectToDatabase } from '@/lib/db';
import { Banner as BannerModel } from '@/models/Banner';
import { HomepageConfig as HomepageConfigModel } from '@/models/HomepageConfig';
import type { Banner, HomepageConfig } from '@/types';

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
