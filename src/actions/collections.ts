'use server';

import { getPublicCollections } from '@/services/collection-service';
import { getStoreSettings } from '@/services/settings-service';
import type { Collection } from '@/types';

export async function getMobileNavDataAction(): Promise<{
  collections: Collection[];
  whatsappNumber: string;
}> {
  try {
    const [collections, settings] = await Promise.all([
      getPublicCollections(),
      getStoreSettings(),
    ]);

    return {
      collections,
      whatsappNumber: settings.general.whatsapp_number || '+880 1712-345678',
    };
  } catch (error) {
    console.error('Error fetching mobile nav data:', error);
    return {
      collections: [],
      whatsappNumber: '+880 1712-345678',
    };
  }
}
