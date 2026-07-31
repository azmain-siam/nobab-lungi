import { connectToDatabase } from '@/lib/db';
import { Banner as BannerModel } from '@/models/Banner';
import type { Banner } from '@/types';

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
