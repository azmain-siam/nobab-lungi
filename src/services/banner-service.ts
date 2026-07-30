import { connectToDatabase } from '@/lib/db';
import { Banner as BannerModel } from '@/models/Banner';
import type { Banner } from '@/types';

function mapDocToBanner(doc: Record<string, unknown>): Banner {
  return {
    id: (doc.id || doc._id) as number,
    title: doc.title as string,
    subtitle: (doc.subtitle as string) ?? null,
    image_url: doc.image_url as string,
    link: (doc.link as string) ?? null,
    sort_order: (doc.sort_order as number) ?? 0,
    is_active: (doc.is_active as boolean) ?? true,
    created_at: doc.created_at ? (doc.created_at as Date).toISOString() : new Date().toISOString(),
    updated_at: doc.updated_at ? (doc.updated_at as Date).toISOString() : new Date().toISOString(),
  };
}

export async function getActiveBanners(): Promise<Banner[]> {
  try {
    await connectToDatabase();
    const banners = await BannerModel.find({ is_active: true })
      .sort({ sort_order: 1 })
      .lean();

    return banners.map((b) => mapDocToBanner(b as unknown as Record<string, unknown>));
  } catch (error) {
    console.error('Error fetching active banners:', error);
    return [];
  }
}
