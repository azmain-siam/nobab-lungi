'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DELIVERY_CHARGES } from '@/constants/delivery';
import { useToast } from '@/providers/toast-provider';
import {
  getUserAddressesAction,
  addUserAddressAction,
  setDefaultAddressAction,
  deleteAddressAction,
} from '@/actions/address';
import { MapPin, Plus, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface Address {
  id: string;
  name: string;
  phone: string;
  area: string;
  fullAddress: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const toast = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newAddressName, setNewAddressName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newArea, setNewArea] = useState('Inside Dhaka');
  const [newFullAddress, setNewFullAddress] = useState('');

  useEffect(() => {
    let isMounted = true;
    getUserAddressesAction()
      .then((res) => {
        if (isMounted && res.success && res.addresses) {
          setAddresses(res.addresses);
        }
      })
      .catch((err) => console.error('Error loading addresses:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressName.trim() || !newFullAddress.trim()) {
      toast.error('Please enter address label and full address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addUserAddressAction({
        name: newAddressName,
        phone: newPhone,
        area: newArea,
        fullAddress: newFullAddress,
      });

      if (res.success && res.addresses) {
        setAddresses(res.addresses);
        setShowAddForm(false);
        setNewAddressName('');
        setNewPhone('');
        setNewFullAddress('');
        toast.success('Address saved successfully.');
      } else {
        toast.error(res.error || 'Failed to save address.');
      }
    } catch (err) {
      console.error('Error adding address:', err);
      toast.error('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    const previous = [...addresses];
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );

    const res = await setDefaultAddressAction(id);
    if (res.success && res.addresses) {
      setAddresses(res.addresses);
      toast.success('Default shipping address updated.');
    } else {
      setAddresses(previous);
      toast.error(res.error || 'Failed to update default address.');
    }
  };

  const handleDelete = async (id: string) => {
    const previous = [...addresses];
    setAddresses((prev) => prev.filter((a) => a.id !== id));

    const res = await deleteAddressAction(id);
    if (res.success && res.addresses) {
      setAddresses(res.addresses);
      toast.success('Address deleted successfully.');
    } else {
      setAddresses(previous);
      toast.error(res.error || 'Failed to delete address.');
    }
  };

  return (
    <div className="bg-white border border-[#e3e2e2] p-6 sm:p-8 space-y-6">
      <div className="border-b border-[#e3e2e2] pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-lg sm:text-xl font-semibold text-[#1b1c1c]">
            Saved Addresses
          </h1>
          <p className="text-xs font-light text-[#5e5e5b] mt-1">
            Manage your saved delivery addresses for quick and seamless checkout.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="gap-1.5 cursor-pointer"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="h-3.5 w-3.5" />
          Add Address
        </Button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddAddress}
          className="border border-[#1b1c1c] p-5 space-y-4 bg-[#fbf9f8]"
        >
          <h2 className="font-display text-xs font-semibold uppercase tracking-wider text-[#1b1c1c]">
            Add New Delivery Address
          </h2>

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
                className="w-full bg-white border border-[#e3e2e2] px-3 py-2 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1b1c1c]">
                Delivery Area *
              </label>
              <select
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                className="w-full bg-white border border-[#e3e2e2] px-3 py-2 text-xs font-medium text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer"
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
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Address'
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowAddForm(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-6 w-6 animate-spin text-[#1b1c1c]" />
          <p className="text-xs text-[#5e5e5b]">Loading saved addresses...</p>
        </div>
      ) : addresses.length > 0 ? (
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
                  {address.isDefault && <Badge variant="pill">Default</Badge>}
                </div>

                <p className="text-xs font-light leading-relaxed text-[#5e5e5b]">
                  {address.fullAddress}
                </p>
                <span className="block text-[11px] font-medium text-[#1b1c1c]">
                  {address.area} • {address.phone}
                </span>
              </div>

              <div className="pt-3 border-t border-[#e3e2e2] flex items-center justify-between text-xs">
                {!address.isDefault ? (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(address.id)}
                    className="text-[11px] text-[#5e5e5b] hover:text-[#1b1c1c] hover:underline font-medium cursor-pointer"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Default Address
                  </span>
                )}

                <button
                  type="button"
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
      ) : (
        <div className="p-12 text-center space-y-3 bg-[#fbf9f8]/40 border border-dashed border-[#e3e2e2]">
          <div className="p-3 bg-white border border-[#e3e2e2] w-fit mx-auto text-[#5e5e5b]">
            <AlertCircle className="h-6 w-6 stroke-[1.5]" />
          </div>
          <h2 className="font-display text-base font-semibold text-[#1b1c1c]">No Saved Addresses Yet</h2>
          <p className="text-xs text-[#5e5e5b] max-w-sm mx-auto">
            Add your primary delivery address for faster single-click checkouts.
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              className="gap-1.5 cursor-pointer"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Address
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
