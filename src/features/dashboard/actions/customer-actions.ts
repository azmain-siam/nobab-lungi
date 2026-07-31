'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAdminCustomers, getCustomerDetails } from '@/services/customer-service';

async function verifyAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as { role?: string }).role !== 'admin') {
    throw new Error('Unauthorized access. Admin privileges required.');
  }
  return session;
}

export async function fetchAdminCustomersAction(options?: {
  search?: string;
  filter?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  await verifyAdminSession();
  return getAdminCustomers(options);
}

export async function fetchCustomerDetailsAction(customerId: string) {
  await verifyAdminSession();
  return getCustomerDetails(customerId);
}
