'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AccountSidebar } from '@/components/shared/account-sidebar';
import { DELIVERY_CHARGES } from '@/constants/delivery';
import { MapPin, Plus, Trash2 } from 'lucide-react';

interface Address {
  id: string;
  name: string;
  phone: string;
  area: string;
  fullAddress: string;
  isDefault: boolean;
}

const INITIAL_ADDRESSES: Address[] = [
  {
    id: '1',
    name: 'Rafiqul Islam',
    phone: '01712345678',
    area: 'Inside Dhaka',
    fullAddress: 'House 42, Road 11, Banani, Dhaka-1213',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Rafiqul Islam (Office)',
    phone: '01812345678',
    area: 'Outside Dhaka',
    fullAddress: 'Holding 88, Station Road, Pabna Sadar, Pabna',
    isDefault: false,
  },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newAddressName, setNewAddressName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newArea, setNewArea] = useState('Inside Dhaka');
  const [newFullAddress, setNewFullAddress] = useState('');

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressName || !newFullAddress) return;

    const newEntry: Address = {
      id: Date.now().toString(),
      name: newAddressName,
      phone: newPhone || '01712345678',
      area: newArea,
      fullAddress: newFullAddress,
      isDefault: addresses.length === 0,
    };

    setAddresses([...addresses, newEntry]);
    setShowAddForm(false);
    setNewAddressName('');
    setNewFullAddress('');
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  return (
    <Section variant="default" className="py-12 lg:py-16">
      <Container>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[#1b1c1c] sm:text-4xl mb-8">
          My Account
        </h1>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <AccountSidebar />

          <div className="flex-1 bg-white border border-[#e3e2e2] p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#e3e2e2] pb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#1b1c1c]">
                  Saved Shipping Addresses
                </h2>
                <p className="text-xs font-light text-[#5e5e5b] mt-1">
                  Manage your delivery addresses for seamless checkout.
                </p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                className="gap-1.5"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <Plus className="h-3.5 w-3.5" />
                Add New Address
              </Button>
            </div>

            {showAddForm && (
              <form
                onSubmit={handleAddAddress}
                className="border border-[#1b1c1c] p-5 space-y-4 bg-[#fbf9f8]"
              >
                <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-[#1b1c1c]">
                  Add New Delivery Address
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1b1c1c]">
                      Address Label / Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddressName}
                      onChange={(e) => setNewAddressName(e.target.value)}
                      placeholder="e.g. Home, Office"
                      className="w-full bg-white border border-[#e3e2e2] px-3 py-2 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1b1c1c]">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full bg-white border border-[#e3e2e2] px-3 py-2 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1b1c1c]">
                      Delivery Area *
                    </label>
                    <select
                      value={newArea}
                      onChange={(e) => setNewArea(e.target.value)}
                      className="w-full bg-white border border-[#e3e2e2] px-3 py-2 text-xs font-medium text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    >
                      <option value="Inside Dhaka">Inside Dhaka (৳{DELIVERY_CHARGES.INSIDE_DHAKA})</option>
                      <option value="Outside Dhaka">Outside Dhaka (৳{DELIVERY_CHARGES.OUTSIDE_DHAKA})</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1b1c1c]">
                    Full Delivery Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={newFullAddress}
                    onChange={(e) => setNewFullAddress(e.target.value)}
                    placeholder="House / Flat no, Road name, Area, Thana..."
                    className="w-full bg-white border border-[#e3e2e2] px-3 py-2 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" variant="primary" size="sm">
                    Save Address
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="border border-[#e3e2e2] p-5 space-y-3 bg-[#fbf9f8]/60 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#1b1c1c] stroke-[1.5]" />
                        <h3 className="font-display text-sm font-semibold text-[#1b1c1c]">
                          {address.name}
                        </h3>
                      </div>
                      {address.isDefault && (
                        <Badge variant="pill">Default</Badge>
                      )}
                    </div>

                    <p className="text-xs font-light leading-relaxed text-[#5e5e5b]">
                      {address.fullAddress}
                    </p>
                    <span className="block text-[11px] font-medium text-[#1b1c1c]">
                      {address.area} • {address.phone}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-[#e3e2e2] flex items-center justify-end">
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="text-xs text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
