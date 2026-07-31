import { connectToDatabase } from '@/lib/db';
import { StoreSettings as StoreSettingsModel } from '@/models/StoreSettings';
import type { StoreSettings } from '@/types';
import { storeSettingsSchema, type StoreSettingsInput } from '@/lib/validations/settings';

function mapDocToStoreSettings(doc: Record<string, unknown>): StoreSettings {
  const gen = (doc.general as Record<string, unknown>) || {};
  const addr = (doc.address as Record<string, unknown>) || {};
  const soc = (doc.social as Record<string, unknown>) || {};
  const del = (doc.delivery as Record<string, unknown>) || {};
  const pay = (doc.payment as Record<string, unknown>) || {};
  const seo = (doc.seo as Record<string, unknown>) || {};
  const hp = (doc.homepage as Record<string, unknown>) || {};
  const main = (doc.maintenance as Record<string, unknown>) || {};

  return {
    general: {
      store_name: (gen.store_name as string) || 'Nobab Lungi',
      store_logo: (gen.store_logo as string) ?? null,
      store_favicon: (gen.store_favicon as string) ?? null,
      store_description:
        (gen.store_description as string) ||
        'Premium Handloom Lungi Collection in Bangladesh. Royal comfort, authentic weave.',
      store_email: (gen.store_email as string) || 'support@nobablungi.com',
      store_phone: (gen.store_phone as string) || '+880 1712-345678',
      whatsapp_number: (gen.whatsapp_number as string) || '+880 1712-345678',
    },
    address: {
      store_address: (addr.store_address as string) || 'House 42, Road 11, Banani',
      city: (addr.city as string) || 'Dhaka',
      district: (addr.district as string) || 'Dhaka',
      postal_code: (addr.postal_code as string) || '1213',
      country: (addr.country as string) || 'Bangladesh',
    },
    social: {
      facebook_url: (soc.facebook_url as string) || 'https://facebook.com/nobablungi',
      instagram_url: (soc.instagram_url as string) || 'https://instagram.com/nobablungi',
      youtube_url: (soc.youtube_url as string) ?? null,
      tiktok_url: (soc.tiktok_url as string) ?? null,
    },
    delivery: {
      inside_dhaka_charge: (del.inside_dhaka_charge as number) ?? 70,
      outside_dhaka_charge: (del.outside_dhaka_charge as number) ?? 130,
      free_delivery_min_amount: (del.free_delivery_min_amount as number) ?? null,
      estimated_delivery_time:
        (del.estimated_delivery_time as string) ||
        '2-3 business days in Dhaka, 3-5 days outside Dhaka',
    },
    payment: {
      cod_enabled: (pay.cod_enabled as boolean) ?? true,
      bkash_enabled: (pay.bkash_enabled as boolean) ?? true,
      bkash_merchant_number: (pay.bkash_merchant_number as string) || '01700000000',
      nagad_enabled: (pay.nagad_enabled as boolean) ?? true,
      nagad_merchant_number: (pay.nagad_merchant_number as string) || '01700000000',
      bank_transfer_enabled: (pay.bank_transfer_enabled as boolean) ?? false,
    },
    seo: {
      default_meta_title:
        (seo.default_meta_title as string) ||
        'Nobab Lungi — Premium Handloom Lungi Collection in Bangladesh',
      default_meta_description:
        (seo.default_meta_description as string) ||
        'Shop authentic 100% organic cotton handloom lungis from Bangladesh. Royal comfort, premium weave, fast home delivery.',
      default_og_image: (seo.default_og_image as string) ?? null,
    },
    homepage: {
      products_per_page: (hp.products_per_page as number) ?? 12,
      featured_products_limit: (hp.featured_products_limit as number) ?? 8,
      new_arrivals_limit: (hp.new_arrivals_limit as number) ?? 8,
      best_sellers_limit: (hp.best_sellers_limit as number) ?? 8,
    },
    maintenance: {
      maintenance_mode: (main.maintenance_mode as boolean) ?? false,
      maintenance_message:
        (main.maintenance_message as string) ||
        'We are performing scheduled maintenance. Please check back soon.',
    },
    created_at: doc.created_at ? new Date(doc.created_at as Date).toISOString() : undefined,
    updated_at: doc.updated_at ? new Date(doc.updated_at as Date).toISOString() : undefined,
  };
}

export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    await connectToDatabase();
    let doc = await StoreSettingsModel.findOne().lean();

    if (!doc) {
      const created = await StoreSettingsModel.create({});
      doc = created.toObject();
    }

    return mapDocToStoreSettings(doc as unknown as Record<string, unknown>);
  } catch (error) {
    console.error('Error fetching store settings:', error);
    // Return fallback defaults if DB query fails
    return mapDocToStoreSettings({});
  }
}

export async function updateStoreSettings(
  input: StoreSettingsInput
): Promise<{ success: boolean; error?: string }> {
  try {
    await connectToDatabase();

    const parsed = storeSettingsSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const data = parsed.data;
    const settingsDoc = await StoreSettingsModel.findOne();

    const cleanPayload = {
      general: {
        store_name: data.general.store_name,
        store_logo: data.general.store_logo ?? null,
        store_favicon: data.general.store_favicon ?? null,
        store_description: data.general.store_description ?? null,
        store_email: data.general.store_email,
        store_phone: data.general.store_phone,
        whatsapp_number: data.general.whatsapp_number,
      },
      address: data.address,
      social: {
        facebook_url: data.social.facebook_url ?? null,
        instagram_url: data.social.instagram_url ?? null,
        youtube_url: data.social.youtube_url ?? null,
        tiktok_url: data.social.tiktok_url ?? null,
      },
      delivery: {
        inside_dhaka_charge: data.delivery.inside_dhaka_charge,
        outside_dhaka_charge: data.delivery.outside_dhaka_charge,
        free_delivery_min_amount: data.delivery.free_delivery_min_amount ?? null,
        estimated_delivery_time: data.delivery.estimated_delivery_time,
      },
      payment: {
        cod_enabled: data.payment.cod_enabled,
        bkash_enabled: data.payment.bkash_enabled,
        bkash_merchant_number: data.payment.bkash_merchant_number ?? null,
        nagad_enabled: data.payment.nagad_enabled,
        nagad_merchant_number: data.payment.nagad_merchant_number ?? null,
        bank_transfer_enabled: data.payment.bank_transfer_enabled,
      },
      seo: {
        default_meta_title: data.seo.default_meta_title,
        default_meta_description: data.seo.default_meta_description,
        default_og_image: data.seo.default_og_image ?? null,
      },
      homepage: data.homepage,
      maintenance: data.maintenance,
    };

    if (!settingsDoc) {
      await StoreSettingsModel.create(cleanPayload);
    } else {
      settingsDoc.general = cleanPayload.general;
      settingsDoc.address = cleanPayload.address;
      settingsDoc.social = cleanPayload.social;
      settingsDoc.delivery = cleanPayload.delivery;
      settingsDoc.payment = cleanPayload.payment;
      settingsDoc.seo = cleanPayload.seo;
      settingsDoc.homepage = cleanPayload.homepage;
      settingsDoc.maintenance = cleanPayload.maintenance;
      await settingsDoc.save();
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update store settings.';
    return { success: false, error: message };
  }
}
