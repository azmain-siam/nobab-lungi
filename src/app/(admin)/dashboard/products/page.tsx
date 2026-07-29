'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, X, Upload } from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  collection: string;
  price: string;
  stock: number;
  status: 'Active' | 'Draft' | 'Out of Stock';
  image: string;
}

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: '1',
    name: 'Midnight Indigo Lungi',
    sku: 'NL-LUN-001',
    category: 'Premium Cotton',
    collection: 'Heritage Collection',
    price: '৳2,450',
    stock: 24,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Charcoal Silk Weave Lungi',
    sku: 'NL-LUN-002',
    category: 'Silk Blend',
    collection: 'Executive Series',
    price: '৳4,800',
    stock: 8,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Earth Tone Essential Lungi',
    sku: 'NL-LUN-003',
    category: 'Handloom',
    collection: 'Luxury Cotton',
    price: '৳1,850',
    stock: 2,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '4',
    name: 'Traditional Jamdani Saree',
    sku: 'NL-SAR-001',
    category: 'Jamdani',
    collection: 'Artisanal Saree Series',
    price: '৳4,500',
    stock: 0,
    status: 'Out of Stock',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Premium Cotton');
  const [collection, setCollection] = useState('Heritage Collection');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [imageUrl, setImageUrl] = useState('');

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const newEntry: ProductItem = {
      id: Date.now().toString(),
      name,
      sku: sku || `NL-PRD-${Math.floor(100 + Math.random() * 900)}`,
      category,
      collection,
      price: price.startsWith('৳') ? price : `৳${price}`,
      stock: parseInt(stock, 10) || 0,
      status: parseInt(stock, 10) > 0 ? 'Active' : 'Out of Stock',
      image:
        imageUrl ||
        'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600&auto=format&fit=crop',
    };

    setProducts([newEntry, ...products]);
    setShowAddModal(false);
    setName('');
    setSku('');
    setPrice('');
    setImageUrl('');
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <>
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#e3e2e2] pb-5">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl">
              Product Management
            </h1>
            <p className="text-xs text-[#5e5e5b] mt-1">
              Manage your lungi &amp; saree catalog, pricing, and stock levels.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            className="gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-4 w-4" />
            Add New Product
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-[#e3e2e2] p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5e5e5b]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by title or SKU..."
              className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 pl-9 pr-3 text-xs text-[#1b1c1c] focus:border-[#1b1c1c] focus:outline-none"
            />
          </div>
          <span className="text-xs text-[#5e5e5b]">
            Showing <strong>{filteredProducts.length}</strong> Products
          </span>
        </div>

        {/* Products Table */}
        <div className="bg-white border border-[#e3e2e2] overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e3e2e2] bg-[#fbf9f8] text-[#5e5e5b] uppercase tracking-wider">
                <th className="p-3 font-semibold">Product</th>
                <th className="p-3 font-semibold">SKU</th>
                <th className="p-3 font-semibold">Category</th>
                <th className="p-3 font-semibold">Price</th>
                <th className="p-3 font-semibold">Stock</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e2e2]">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-[#fbf9f8]">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="relative aspect-[3/4] w-10 shrink-0 overflow-hidden bg-[#efeded]">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <div className="font-display font-semibold text-[#1b1c1c]">
                          {product.name}
                        </div>
                        <div className="text-[10px] text-[#5e5e5b]">
                          {product.collection}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-[11px] text-[#5e5e5b]">
                    {product.sku}
                  </td>
                  <td className="p-3 text-[#1b1c1c] font-medium">{product.category}</td>
                  <td className="p-3 font-display font-semibold text-[#1b1c1c]">
                    {product.price}
                  </td>
                  <td className="p-3">
                    <span
                      className={`font-semibold ${
                        product.stock <= 3 ? 'text-amber-600' : 'text-[#1b1c1c]'
                      }`}
                    >
                      {product.stock} units
                    </span>
                  </td>
                  <td className="p-3">
                    {product.status === 'Active' ? (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 border border-rose-200">
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => alert(`Edit ${product.name}`)}
                        className="p-1 text-[#5e5e5b] hover:text-[#1b1c1c] transition"
                      >
                        <Edit className="h-4 w-4 stroke-[1.5]" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1 text-[#5e5e5b] hover:text-red-600 transition"
                      >
                        <Trash2 className="h-4 w-4 stroke-[1.5]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />
            <div className="relative z-10 w-full max-w-lg bg-white border border-[#e3e2e2] p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#e3e2e2] pb-3">
                <h2 className="font-display text-base font-semibold text-[#1b1c1c]">
                  Add New Product
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-[#5e5e5b] hover:text-[#1b1c1c]"
                >
                  <X className="h-5 w-5 stroke-[1.5]" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1b1c1c]">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Royal Blue Fine Cotton Lungi"
                    className="w-full border border-[#e3e2e2] px-3 py-2 text-xs rounded-none focus:border-[#1b1c1c] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#1b1c1c]">SKU</label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="NL-LUN-005"
                      className="w-full border border-[#e3e2e2] px-3 py-2 text-xs rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#1b1c1c]">Price (BDT) *</label>
                    <input
                      type="text"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="2450"
                      className="w-full border border-[#e3e2e2] px-3 py-2 text-xs rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#1b1c1c]">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full border border-[#e3e2e2] px-3 py-2 text-xs font-medium rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    >
                      <option value="Premium Cotton">Premium Cotton</option>
                      <option value="Silk Blend">Silk Blend</option>
                      <option value="Handloom">Handloom</option>
                      <option value="Jamdani">Jamdani</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#1b1c1c]">Stock Count</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full border border-[#e3e2e2] px-3 py-2 text-xs rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1b1c1c]">Product Image URL / Cloudinary</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full border border-[#e3e2e2] px-3 py-2 text-xs rounded-none focus:border-[#1b1c1c] focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex gap-3">
                  <Button type="submit" variant="primary" size="md" className="flex-1">
                    Save Product
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
    </>
  );
}
