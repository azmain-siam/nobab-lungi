'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { Banner } from '@/models/Banner';
import { HomepageConfig } from '@/models/HomepageConfig';
import { bannerSchema, type BannerInput } from '@/lib/validations/homepage';
import { getAdminBanners, getHomepageConfig } from '@/services/homepage-service';
import { getAdminCategories } from '@/services/category-service';
import { getAdminCollections } from '@/services/collection-service';
import { getAdminProducts } from '@/services/product-service';

export interface HomepageActionResult {
  success?: boolean;
  error?: string;
}

async function verifyAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as { role?: string }).role !== 'admin') {
    throw new Error('Unauthorized access. Admin privileges required.');
  }
  return session;
}

export async function fetchHomepageDataAction() {
  await verifyAdminSession();

  const [banners, config, categoriesRes, collectionsRes, productsRes] = await Promise.all([
    getAdminBanners(),
    getHomepageConfig(),
    getAdminCategories({ limit: 100 }),
    getAdminCollections({ limit: 100 }),
    getAdminProducts({ limit: 100 }),
  ]);

  return {
    banners,
    config,
    categories: categoriesRes.categories,
    collections: collectionsRes.collections,
    products: productsRes.products,
  };
}

// Module 1: Hero Banners
export async function createBannerAction(input: BannerInput): Promise<HomepageActionResult> {
  try {
    await verifyAdminSession();

    const parsed = bannerSchema.safeParse(input);
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const data = parsed.data;
    await connectToDatabase();

    // If marked as primary, unmark existing primary banners
    if (data.is_primary) {
      await Banner.updateMany({ is_primary: true }, { $set: { is_primary: false } });
    }

    const lastBanner = await Banner.findOne().sort({ id: -1 }).lean();
    const nextId = lastBanner && lastBanner.id ? lastBanner.id + 1 : 1;

    await Banner.create({
      id: nextId,
      title: data.title.trim(),
      subtitle: data.subtitle?.trim() || null,
      description: data.description?.trim() || null,
      desktop_image: data.desktop_image,
      mobile_image: data.mobile_image || null,
      primary_btn_text: data.primary_btn_text?.trim() || null,
      primary_btn_url: data.primary_btn_url?.trim() || null,
      secondary_btn_text: data.secondary_btn_text?.trim() || null,
      secondary_btn_url: data.secondary_btn_url?.trim() || null,
      is_active: data.is_active ?? true,
      is_primary: data.is_primary ?? false,
      sort_order: data.sort_order ?? 0,
      start_date: data.start_date ? new Date(data.start_date) : null,
      end_date: data.end_date ? new Date(data.end_date) : null,
    });

    revalidatePath('/dashboard/homepage');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create hero banner.';
    return { error: message };
  }
}

export async function updateBannerAction(id: number, input: BannerInput): Promise<HomepageActionResult> {
  try {
    await verifyAdminSession();

    const parsed = bannerSchema.safeParse(input);
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const data = parsed.data;
    await connectToDatabase();

    if (data.is_primary) {
      await Banner.updateMany({ id: { $ne: id }, is_primary: true }, { $set: { is_primary: false } });
    }

    await Banner.findOneAndUpdate(
      { id },
      {
        $set: {
          title: data.title.trim(),
          subtitle: data.subtitle?.trim() || null,
          description: data.description?.trim() || null,
          desktop_image: data.desktop_image,
          mobile_image: data.mobile_image || null,
          primary_btn_text: data.primary_btn_text?.trim() || null,
          primary_btn_url: data.primary_btn_url?.trim() || null,
          secondary_btn_text: data.secondary_btn_text?.trim() || null,
          secondary_btn_url: data.secondary_btn_url?.trim() || null,
          is_active: data.is_active ?? true,
          is_primary: data.is_primary ?? false,
          sort_order: data.sort_order ?? 0,
          start_date: data.start_date ? new Date(data.start_date) : null,
          end_date: data.end_date ? new Date(data.end_date) : null,
        },
      }
    );

    revalidatePath('/dashboard/homepage');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update hero banner.';
    return { error: message };
  }
}

export async function deleteBannerAction(id: number): Promise<HomepageActionResult> {
  try {
    await verifyAdminSession();
    await connectToDatabase();

    await Banner.findOneAndDelete({ id });

    revalidatePath('/dashboard/homepage');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete hero banner.';
    return { error: message };
  }
}

// Module 2: Homepage Sections Layout & Visibility
export async function updateHomepageSectionsAction(
  sections: { key: string; name: string; is_visible: boolean; sort_order: number }[]
): Promise<HomepageActionResult> {
  try {
    await verifyAdminSession();
    await connectToDatabase();

    await HomepageConfig.findOneAndUpdate({}, { $set: { sections } }, { upsert: true });

    revalidatePath('/dashboard/homepage');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update section layout.';
    return { error: message };
  }
}

// Module 3: Featured Categories
export async function updateFeaturedCategoriesAction(categoryIds: number[]): Promise<HomepageActionResult> {
  try {
    await verifyAdminSession();
    await connectToDatabase();

    await HomepageConfig.findOneAndUpdate(
      {},
      { $set: { featured_category_ids: categoryIds } },
      { upsert: true }
    );

    revalidatePath('/dashboard/homepage');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update featured categories.';
    return { error: message };
  }
}

// Module 4: Featured Collections
export async function updateFeaturedCollectionsAction(collectionIds: number[]): Promise<HomepageActionResult> {
  try {
    await verifyAdminSession();
    await connectToDatabase();

    await HomepageConfig.findOneAndUpdate(
      {},
      { $set: { featured_collection_ids: collectionIds } },
      { upsert: true }
    );

    revalidatePath('/dashboard/homepage');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update featured collections.';
    return { error: message };
  }
}

// Module 5: Featured Products
export async function updateFeaturedProductsAction(productIds: string[]): Promise<HomepageActionResult> {
  try {
    await verifyAdminSession();
    await connectToDatabase();

    await HomepageConfig.findOneAndUpdate(
      {},
      { $set: { featured_product_ids: productIds } },
      { upsert: true }
    );

    revalidatePath('/dashboard/homepage');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update featured products.';
    return { error: message };
  }
}

// Module 6: Best Sellers
export async function updateBestSellersAction(productIds: string[]): Promise<HomepageActionResult> {
  try {
    await verifyAdminSession();
    await connectToDatabase();

    await HomepageConfig.findOneAndUpdate(
      {},
      { $set: { best_seller_product_ids: productIds } },
      { upsert: true }
    );

    revalidatePath('/dashboard/homepage');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update best sellers.';
    return { error: message };
  }
}

// Module 7: New Arrivals Settings
export async function updateNewArrivalsConfigAction(
  limit: number,
  isActive: boolean
): Promise<HomepageActionResult> {
  try {
    await verifyAdminSession();
    await connectToDatabase();

    await HomepageConfig.findOneAndUpdate(
      {},
      { $set: { new_arrivals_config: { limit: Number(limit), is_active: isActive } } },
      { upsert: true }
    );

    revalidatePath('/dashboard/homepage');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update new arrivals settings.';
    return { error: message };
  }
}

// Module 8: Brand Story
export async function updateBrandStoryAction(data: {
  title: string;
  description: string;
  image_url?: string | null;
  button_text?: string | null;
  button_url?: string | null;
  is_active: boolean;
}): Promise<HomepageActionResult> {
  try {
    await verifyAdminSession();
    await connectToDatabase();

    await HomepageConfig.findOneAndUpdate({}, { $set: { brand_story: data } }, { upsert: true });

    revalidatePath('/dashboard/homepage');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update brand story.';
    return { error: message };
  }
}

// Module 9: Why Choose Us
export async function saveWhyChooseUsCardAction(card: {
  id: string;
  icon: string;
  title: string;
  description: string;
  sort_order: number;
}): Promise<HomepageActionResult> {
  try {
    await verifyAdminSession();
    await connectToDatabase();

    const config = await HomepageConfig.findOne();
    const existingCards = config?.why_choose_us || [];

    const index = existingCards.findIndex((c) => c.id === card.id);
    const updatedCards = [...existingCards];

    if (index >= 0) {
      updatedCards[index] = card;
    } else {
      updatedCards.push(card);
    }

    await HomepageConfig.findOneAndUpdate(
      {},
      { $set: { why_choose_us: updatedCards } },
      { upsert: true }
    );

    revalidatePath('/dashboard/homepage');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save feature card.';
    return { error: message };
  }
}

export async function deleteWhyChooseUsCardAction(cardId: string): Promise<HomepageActionResult> {
  try {
    await verifyAdminSession();
    await connectToDatabase();

    const config = await HomepageConfig.findOne();
    const updatedCards = (config?.why_choose_us || []).filter((c) => c.id !== cardId);

    await HomepageConfig.findOneAndUpdate(
      {},
      { $set: { why_choose_us: updatedCards } },
      { upsert: true }
    );

    revalidatePath('/dashboard/homepage');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete feature card.';
    return { error: message };
  }
}

// Module 10: Newsletter
export async function updateNewsletterConfigAction(data: {
  heading: string;
  description: string;
  is_enabled: boolean;
}): Promise<HomepageActionResult> {
  try {
    await verifyAdminSession();
    await connectToDatabase();

    await HomepageConfig.findOneAndUpdate({}, { $set: { newsletter: data } }, { upsert: true });

    revalidatePath('/dashboard/homepage');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update newsletter settings.';
    return { error: message };
  }
}
