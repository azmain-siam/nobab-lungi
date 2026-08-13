import { connectToDatabase } from '@/lib/db';
import { User, type ISavedAddress } from '@/models/User';

export async function getUserAddresses(userId: string): Promise<ISavedAddress[]> {
  try {
    await connectToDatabase();
    const user = await User.findById(userId).select('addresses').lean();
    return user?.addresses || [];
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    return [];
  }
}

export async function addUserAddress(
  userId: string,
  data: {
    name: string;
    phone: string;
    area: string;
    fullAddress: string;
  }
): Promise<{ success: boolean; addresses?: ISavedAddress[]; error?: string }> {
  try {
    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found.' };
    }

    const currentAddresses = user.addresses || [];
    const isFirstAddress = currentAddresses.length === 0;

    const newAddress: ISavedAddress = {
      id: Date.now().toString(),
      name: data.name.trim(),
      phone: data.phone.trim(),
      area: data.area,
      fullAddress: data.fullAddress.trim(),
      isDefault: isFirstAddress,
    };

    user.addresses = [...currentAddresses, newAddress];
    await user.save();

    return { success: true, addresses: user.addresses };
  } catch (error) {
    console.error('Error adding user address:', error);
    return { success: false, error: 'Failed to save address.' };
  }
}

export async function setDefaultUserAddress(
  userId: string,
  addressId: string
): Promise<{ success: boolean; addresses?: ISavedAddress[]; error?: string }> {
  try {
    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found.' };
    }

    const addresses = user.addresses || [];
    const updated = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === addressId,
    }));

    user.addresses = updated;
    await user.save();

    return { success: true, addresses: user.addresses };
  } catch (error) {
    console.error('Error setting default address:', error);
    return { success: false, error: 'Failed to update default address.' };
  }
}

export async function deleteUserAddress(
  userId: string,
  addressId: string
): Promise<{ success: boolean; addresses?: ISavedAddress[]; error?: string }> {
  try {
    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found.' };
    }

    let addresses = user.addresses || [];
    const targetWasDefault = addresses.find((a) => a.id === addressId)?.isDefault;

    addresses = addresses.filter((a) => a.id !== addressId);

    // If default address was deleted, promote first remaining address to default
    if (targetWasDefault && addresses.length > 0) {
      addresses[0].isDefault = true;
    }

    user.addresses = addresses;
    await user.save();

    return { success: true, addresses: user.addresses };
  } catch (error) {
    console.error('Error deleting address:', error);
    return { success: false, error: 'Failed to delete address.' };
  }
}
