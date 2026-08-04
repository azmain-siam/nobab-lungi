'use server';

import { getStoreSettings } from '@/services/settings-service';

export async function getCheckoutSettingsAction() {
  const settings = await getStoreSettings();
  return {
    insideDhakaCharge: settings.delivery.inside_dhaka_charge,
    outsideDhakaCharge: settings.delivery.outside_dhaka_charge,
    bkashMerchantNumber: settings.payment.bkash_merchant_number || '01700000000',
    nagadMerchantNumber: settings.payment.nagad_merchant_number || '01700000000',
    bkashEnabled: settings.payment.bkash_enabled,
    nagadEnabled: settings.payment.nagad_enabled,
    codEnabled: settings.payment.cod_enabled,
  };
}
