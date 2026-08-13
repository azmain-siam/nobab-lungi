'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getUserAddresses,
  addUserAddress,
  setDefaultUserAddress,
  deleteUserAddress,
} from '@/services/address-service';
import { revalidatePath } from 'next/cache';

export async function getUserAddressesAction() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { success: false, error: 'Unauthenticated.', addresses: [] };
    }

    const userId = (session.user as { id?: string }).id;
    if (!userId) {
      return { success: false, error: 'User ID missing.', addresses: [] };
    }

    const addresses = await getUserAddresses(userId);
    return { success: true, addresses };
  } catch (error) {
    console.error('getUserAddressesAction Error:', error);
    return { success: false, error: 'Failed to load addresses.', addresses: [] };
  }
}

export async function addUserAddressAction(data: {
  name: string;
  phone: string;
  area: string;
  fullAddress: string;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { success: false, error: 'You must be logged in to save addresses.' };
    }

    const userId = (session.user as { id?: string }).id;
    if (!userId) {
      return { success: false, error: 'User ID missing.' };
    }

    if (!data.name?.trim() || !data.fullAddress?.trim()) {
      return { success: false, error: 'Address name and full address are required.' };
    }

    const res = await addUserAddress(userId, data);
    if (res.success) {
      revalidatePath('/account/addresses');
      revalidatePath('/account');
    }
    return res;
  } catch (error) {
    console.error('addUserAddressAction Error:', error);
    return { success: false, error: 'An error occurred while adding address.' };
  }
}

export async function setDefaultAddressAction(addressId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { success: false, error: 'You must be logged in.' };
    }

    const userId = (session.user as { id?: string }).id;
    if (!userId) {
      return { success: false, error: 'User ID missing.' };
    }

    const res = await setDefaultUserAddress(userId, addressId);
    if (res.success) {
      revalidatePath('/account/addresses');
      revalidatePath('/account');
    }
    return res;
  } catch (error) {
    console.error('setDefaultAddressAction Error:', error);
    return { success: false, error: 'An error occurred while updating default address.' };
  }
}

export async function deleteAddressAction(addressId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { success: false, error: 'You must be logged in.' };
    }

    const userId = (session.user as { id?: string }).id;
    if (!userId) {
      return { success: false, error: 'User ID missing.' };
    }

    const res = await deleteUserAddress(userId, addressId);
    if (res.success) {
      revalidatePath('/account/addresses');
      revalidatePath('/account');
    }
    return res;
  } catch (error) {
    console.error('deleteAddressAction Error:', error);
    return { success: false, error: 'An error occurred while deleting address.' };
  }
}
