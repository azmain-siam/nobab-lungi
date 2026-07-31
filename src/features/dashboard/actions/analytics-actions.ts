'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDashboardMetrics } from '@/services/analytics-service';

async function verifyAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as { role?: string }).role !== 'admin') {
    throw new Error('Unauthorized access. Admin privileges required.');
  }
  return session;
}

export async function fetchDashboardOverviewAction() {
  await verifyAdminSession();
  return getDashboardMetrics();
}
