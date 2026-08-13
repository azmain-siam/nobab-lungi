import { redirect } from 'next/navigation';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await searchParams;
  const queryString = new URLSearchParams();

  if (resolvedParams) {
    Object.entries(resolvedParams).forEach(([key, val]) => {
      if (typeof val === 'string') {
        queryString.set(key, val);
      } else if (Array.isArray(val)) {
        val.forEach((v) => queryString.append(key, v));
      }
    });
  }

  const query = queryString.toString();
  const target = query ? `/products?${query}` : '/products';

  redirect(target);
}
