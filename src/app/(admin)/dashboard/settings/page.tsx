'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useToast } from '@/providers/toast-provider';
import { uploadImageAction } from '@/actions/upload';
import {
  fetchStoreSettingsAction,
  updateStoreSettingsAction,
} from '@/features/dashboard/actions/settings-actions';
import type { StoreSettings } from '@/types';
import {
  Settings,
  Store,
  MapPin,
  Truck,
  CreditCard,
  Share2,
  Globe,
  LayoutGrid,
  AlertOctagon,
  Save,
  RefreshCw,
  Trash2,
  Loader2,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  // Active Settings Tab
  const [activeTab, setActiveTab] = useState<
    | 'general'
    | 'address'
    | 'delivery'
    | 'payment'
    | 'social'
    | 'seo'
    | 'homepage'
    | 'maintenance'
  >('general');

  // Master Settings State
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cloudinary Upload States
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const [isUploadingOgImage, setIsUploadingOgImage] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const refetchSettings = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  // Fetch Settings Effect
  useEffect(() => {
    let isMounted = true;

    fetchStoreSettingsAction()
      .then((data) => {
        if (isMounted) {
          setSettings(data);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching store settings:', error);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  // Handle Logo Upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await uploadImageAction(formData, 'BANNERS');
      if (res.success && res.url) {
        setSettings({
          ...settings,
          general: { ...settings.general, store_logo: res.url },
        });
        toast.success('Store logo uploaded.');
      } else {
        toast.error(res.error || 'Failed to upload logo.');
      }
    } catch {
      toast.error('An error occurred during logo upload.');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Handle Favicon Upload
  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    setIsUploadingFavicon(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await uploadImageAction(formData, 'BANNERS');
      if (res.success && res.url) {
        setSettings({
          ...settings,
          general: { ...settings.general, store_favicon: res.url },
        });
        toast.success('Favicon uploaded.');
      } else {
        toast.error(res.error || 'Failed to upload favicon.');
      }
    } catch {
      toast.error('An error occurred during favicon upload.');
    } finally {
      setIsUploadingFavicon(false);
    }
  };

  // Handle OG Image Upload
  const handleOgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    setIsUploadingOgImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await uploadImageAction(formData, 'BANNERS');
      if (res.success && res.url) {
        setSettings({
          ...settings,
          seo: { ...settings.seo, default_og_image: res.url },
        });
        toast.success('Default OpenGraph image uploaded.');
      } else {
        toast.error(res.error || 'Failed to upload OG image.');
      }
    } catch {
      toast.error('An error occurred during OG image upload.');
    } finally {
      setIsUploadingOgImage(false);
    }
  };

  // Save Settings Submit Handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSubmitting(true);
    try {
      const res = await updateStoreSettingsAction(settings);
      if (res.success) {
        toast.success('Store settings saved successfully across the platform.');
        startTransition(() => refetchSettings());
      } else {
        toast.error(res.error || 'Failed to save store settings.');
      }
    } catch {
      toast.error('An error occurred while saving store settings.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Page Header Bar */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e2] pb-5">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl flex items-center gap-2">
              <Settings className="h-6 w-6 stroke-[1.5] text-amber-800" />
              Centralized Store Settings
            </h1>
            <p className="text-xs text-[#5e5e5b] mt-1">
              Configure general store identity, contact info, delivery fees, payment gateways, social links, and maintenance mode.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => refetchSettings()}
              disabled={isLoading || isPending || isSubmitting}
              className="p-2.5"
              title="Reload Settings"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading || isPending ? 'animate-spin' : ''}`} />
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading || isSubmitting}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Saving Changes...' : 'Save All Settings'}
            </Button>
          </div>
        </div>

        {/* 8 Settings Tabs Navigation */}
        <div className="bg-white border border-[#e3e2e2] overflow-x-auto">
          <nav className="flex whitespace-nowrap border-b border-[#e3e2e2] text-xs font-semibold">
            {[
              { id: 'general', label: 'General Info', icon: Store },
              { id: 'address', label: 'Store Address', icon: MapPin },
              { id: 'delivery', label: 'Delivery Charges', icon: Truck },
              { id: 'payment', label: 'Payment Methods', icon: CreditCard },
              { id: 'social', label: 'Social Media', icon: Share2 },
              { id: 'seo', label: 'SEO Defaults', icon: Globe },
              { id: 'homepage', label: 'Homepage Limits', icon: LayoutGrid },
              { id: 'maintenance', label: 'Maintenance Mode', icon: AlertOctagon },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 py-3 px-4 border-b-2 transition ${
                    isActive
                      ? 'border-[#1b1c1c] text-[#1b1c1c] bg-[#fbf9f8]'
                      : 'border-transparent text-[#5e5e5b] hover:text-[#1b1c1c] hover:bg-[#fbf9f8]'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-[#1b1c1c]' : 'text-[#5e5e5b]'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Tab Contents */}
        <div className="space-y-6">
          {isLoading || !settings ? (
            <div className="bg-white border border-[#e3e2e2] p-8 space-y-4">
              <div className="h-6 bg-[#f5f3f3] w-1/3 animate-pulse" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-[#fbf9f8] border border-[#e3e2e2] animate-pulse" />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* TAB 1: GENERAL INFO */}
              {activeTab === 'general' && (
                <div className="bg-white border border-[#e3e2e2] p-6 space-y-5 max-w-3xl">
                  <div>
                    <h3 className="font-display text-base font-semibold text-[#1b1c1c]">Store Branding & Communication</h3>
                    <p className="text-xs text-[#5e5e5b]">Basic identity details displayed across storefront headers, footers, and invoices.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#e3e2e2] pt-4">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-[#1b1c1c]">Store Name *</label>
                      <input
                        type="text"
                        required
                        value={settings.general.store_name}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            general: { ...settings.general, store_name: e.target.value },
                          })
                        }
                        className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-[#1b1c1c]">Store Description</label>
                      <textarea
                        rows={3}
                        value={settings.general.store_description || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            general: { ...settings.general, store_description: e.target.value },
                          })
                        }
                        className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                      />
                    </div>

                    {/* Store Logo */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#1b1c1c]">Store Logo</label>
                      {settings.general.store_logo ? (
                        <div className="relative h-24 w-full bg-[#fbf9f8] border border-[#e3e2e2] overflow-hidden group">
                          <Image src={settings.general.store_logo} alt="Store Logo" fill className="object-contain p-2" />
                          <button
                            type="button"
                            onClick={() =>
                              setSettings({
                                ...settings,
                                general: { ...settings.general, store_logo: null },
                              })
                            }
                            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white shadow-md hover:bg-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="border border-dashed border-[#e3e2e2] bg-[#fbf9f8] p-4 text-center">
                          {isUploadingLogo ? (
                            <div className="flex items-center justify-center gap-2 text-xs text-[#5e5e5b]">
                              <Loader2 className="h-4 w-4 animate-spin" /> Uploading Logo...
                            </div>
                          ) : (
                            <label className="font-semibold text-xs text-[#1b1c1c] hover:underline cursor-pointer">
                              Upload Logo Photo
                              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                            </label>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Store Favicon */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#1b1c1c]">Store Favicon Icon</label>
                      {settings.general.store_favicon ? (
                        <div className="relative h-24 w-full bg-[#fbf9f8] border border-[#e3e2e2] overflow-hidden group">
                          <Image src={settings.general.store_favicon} alt="Favicon" fill className="object-contain p-2" />
                          <button
                            type="button"
                            onClick={() =>
                              setSettings({
                                ...settings,
                                general: { ...settings.general, store_favicon: null },
                              })
                            }
                            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white shadow-md hover:bg-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="border border-dashed border-[#e3e2e2] bg-[#fbf9f8] p-4 text-center">
                          {isUploadingFavicon ? (
                            <div className="flex items-center justify-center gap-2 text-xs text-[#5e5e5b]">
                              <Loader2 className="h-4 w-4 animate-spin" /> Uploading Favicon...
                            </div>
                          ) : (
                            <label className="font-semibold text-xs text-[#1b1c1c] hover:underline cursor-pointer">
                              Upload Favicon (.png/.ico)
                              <input type="file" accept="image/*" onChange={handleFaviconUpload} className="hidden" />
                            </label>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1b1c1c]">Support Email *</label>
                      <input
                        type="email"
                        required
                        value={settings.general.store_email}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            general: { ...settings.general, store_email: e.target.value },
                          })
                        }
                        className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1b1c1c]">Customer Phone *</label>
                      <input
                        type="text"
                        required
                        value={settings.general.store_phone}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            general: { ...settings.general, store_phone: e.target.value },
                          })
                        }
                        className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-[#1b1c1c]">WhatsApp Business Number *</label>
                      <input
                        type="text"
                        required
                        value={settings.general.whatsapp_number}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            general: { ...settings.general, whatsapp_number: e.target.value },
                          })
                        }
                        placeholder="e.g. +880 1712-345678"
                        className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ADDRESS */}
              {activeTab === 'address' && (
                <div className="bg-white border border-[#e3e2e2] p-6 space-y-5 max-w-2xl">
                  <div>
                    <h3 className="font-display text-base font-semibold text-[#1b1c1c]">Store Location Address</h3>
                    <p className="text-xs text-[#5e5e5b]">Physical office or warehouse address printed on customer receipts.</p>
                  </div>

                  <div className="space-y-4 border-t border-[#e3e2e2] pt-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1b1c1c]">Street Address *</label>
                      <input
                        type="text"
                        required
                        value={settings.address.store_address}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            address: { ...settings.address, store_address: e.target.value },
                          })
                        }
                        className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1b1c1c]">City *</label>
                        <input
                          type="text"
                          required
                          value={settings.address.city}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              address: { ...settings.address, city: e.target.value },
                            })
                          }
                          className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1b1c1c]">District *</label>
                        <input
                          type="text"
                          required
                          value={settings.address.district}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              address: { ...settings.address, district: e.target.value },
                            })
                          }
                          className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1b1c1c]">Postal Code *</label>
                        <input
                          type="text"
                          required
                          value={settings.address.postal_code}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              address: { ...settings.address, postal_code: e.target.value },
                            })
                          }
                          className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1b1c1c]">Country *</label>
                        <input
                          type="text"
                          required
                          value={settings.address.country}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              address: { ...settings.address, country: e.target.value },
                            })
                          }
                          className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DELIVERY */}
              {activeTab === 'delivery' && (
                <div className="bg-white border border-[#e3e2e2] p-6 space-y-5 max-w-2xl">
                  <div>
                    <h3 className="font-display text-base font-semibold text-[#1b1c1c]">Delivery & Shipping Fees</h3>
                    <p className="text-xs text-[#5e5e5b]">Set standard courier fees applied automatically during customer checkout.</p>
                  </div>

                  <div className="space-y-4 border-t border-[#e3e2e2] pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1b1c1c]">Inside Dhaka Charge (৳) *</label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={settings.delivery.inside_dhaka_charge}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              delivery: {
                                ...settings.delivery,
                                inside_dhaka_charge: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1b1c1c]">Outside Dhaka Charge (৳) *</label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={settings.delivery.outside_dhaka_charge}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              delivery: {
                                ...settings.delivery,
                                outside_dhaka_charge: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1b1c1c]">Free Delivery Minimum Subtotal (৳)</label>
                      <input
                        type="number"
                        min={0}
                        value={settings.delivery.free_delivery_min_amount || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            delivery: {
                              ...settings.delivery,
                              free_delivery_min_amount: e.target.value ? Number(e.target.value) : null,
                            },
                          })
                        }
                        placeholder="e.g. 3000 (Leave empty for no free delivery threshold)"
                        className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1b1c1c]">Estimated Delivery Time Text *</label>
                      <input
                        type="text"
                        required
                        value={settings.delivery.estimated_delivery_time}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            delivery: {
                              ...settings.delivery,
                              estimated_delivery_time: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PAYMENTS */}
              {activeTab === 'payment' && (
                <div className="bg-white border border-[#e3e2e2] p-6 space-y-5 max-w-2xl">
                  <div>
                    <h3 className="font-display text-base font-semibold text-[#1b1c1c]">Payment Gateway Configurations</h3>
                    <p className="text-xs text-[#5e5e5b]">Enable or disable payment methods accepted during customer checkout.</p>
                  </div>

                  <div className="space-y-4 border-t border-[#e3e2e2] pt-4">
                    {/* COD */}
                    <div className="p-4 border border-[#e3e2e2] bg-[#fbf9f8] flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-xs text-[#1b1c1c]">Cash on Delivery (COD)</div>
                        <div className="text-[11px] text-[#5e5e5b]">Customer pays cash when courier delivers the package.</div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setSettings({
                            ...settings,
                            payment: { ...settings.payment, cod_enabled: !settings.payment.cod_enabled },
                          })
                        }
                        className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider border transition ${
                          settings.payment.cod_enabled
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-red-50 text-red-800 border-red-300'
                        }`}
                      >
                        {settings.payment.cod_enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>

                    {/* bKash */}
                    <div className="p-4 border border-[#e3e2e2] bg-[#fbf9f8] space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-xs text-[#1b1c1c]">bKash Mobile Payment</div>
                          <div className="text-[11px] text-[#5e5e5b]">Customer sends payment to bKash merchant number.</div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setSettings({
                              ...settings,
                              payment: { ...settings.payment, bkash_enabled: !settings.payment.bkash_enabled },
                            })
                          }
                          className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider border transition ${
                            settings.payment.bkash_enabled
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-red-50 text-red-800 border-red-300'
                          }`}
                        >
                          {settings.payment.bkash_enabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>

                      {settings.payment.bkash_enabled && (
                        <div className="space-y-1 pt-2 border-t border-[#e3e2e2]">
                          <label className="text-xs font-semibold text-[#1b1c1c]">bKash Merchant Number</label>
                          <input
                            type="text"
                            value={settings.payment.bkash_merchant_number || ''}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                payment: { ...settings.payment, bkash_merchant_number: e.target.value },
                              })
                            }
                            placeholder="e.g. 01700000000"
                            className="w-full bg-white border border-[#e3e2e2] py-1.5 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c]"
                          />
                        </div>
                      )}
                    </div>

                    {/* Nagad */}
                    <div className="p-4 border border-[#e3e2e2] bg-[#fbf9f8] space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-xs text-[#1b1c1c]">Nagad Mobile Payment</div>
                          <div className="text-[11px] text-[#5e5e5b]">Customer sends payment to Nagad merchant number.</div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setSettings({
                              ...settings,
                              payment: { ...settings.payment, nagad_enabled: !settings.payment.nagad_enabled },
                            })
                          }
                          className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider border transition ${
                            settings.payment.nagad_enabled
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-red-50 text-red-800 border-red-300'
                          }`}
                        >
                          {settings.payment.nagad_enabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>

                      {settings.payment.nagad_enabled && (
                        <div className="space-y-1 pt-2 border-t border-[#e3e2e2]">
                          <label className="text-xs font-semibold text-[#1b1c1c]">Nagad Merchant Number</label>
                          <input
                            type="text"
                            value={settings.payment.nagad_merchant_number || ''}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                payment: { ...settings.payment, nagad_merchant_number: e.target.value },
                              })
                            }
                            placeholder="e.g. 01700000000"
                            className="w-full bg-white border border-[#e3e2e2] py-1.5 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c]"
                          />
                        </div>
                      )}
                    </div>

                    {/* Bank Transfer */}
                    <div className="p-4 border border-[#e3e2e2] bg-[#fbf9f8] flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-xs text-[#1b1c1c]">Direct Bank Wire Transfer</div>
                        <div className="text-[11px] text-[#5e5e5b]">Accept direct bank wire payments.</div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setSettings({
                            ...settings,
                            payment: {
                              ...settings.payment,
                              bank_transfer_enabled: !settings.payment.bank_transfer_enabled,
                            },
                          })
                        }
                        className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider border transition ${
                          settings.payment.bank_transfer_enabled
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-red-50 text-red-800 border-red-300'
                        }`}
                      >
                        {settings.payment.bank_transfer_enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SOCIAL */}
              {activeTab === 'social' && (
                <div className="bg-white border border-[#e3e2e2] p-6 space-y-5 max-w-2xl">
                  <div>
                    <h3 className="font-display text-base font-semibold text-[#1b1c1c]">Social Media Channels</h3>
                    <p className="text-xs text-[#5e5e5b]">Links rendered in the storefront footer and contact sections.</p>
                  </div>

                  <div className="space-y-4 border-t border-[#e3e2e2] pt-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1b1c1c]">Facebook Page URL</label>
                      <input
                        type="text"
                        value={settings.social.facebook_url || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            social: { ...settings.social, facebook_url: e.target.value },
                          })
                        }
                        placeholder="https://facebook.com/nobablungi"
                        className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1b1c1c]">Instagram Profile URL</label>
                      <input
                        type="text"
                        value={settings.social.instagram_url || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            social: { ...settings.social, instagram_url: e.target.value },
                          })
                        }
                        placeholder="https://instagram.com/nobablungi"
                        className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1b1c1c]">YouTube Channel URL</label>
                      <input
                        type="text"
                        value={settings.social.youtube_url || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            social: { ...settings.social, youtube_url: e.target.value },
                          })
                        }
                        placeholder="https://youtube.com/@nobablungi"
                        className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1b1c1c]">TikTok Profile URL</label>
                      <input
                        type="text"
                        value={settings.social.tiktok_url || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            social: { ...settings.social, tiktok_url: e.target.value },
                          })
                        }
                        placeholder="https://tiktok.com/@nobablungi"
                        className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: SEO */}
              {activeTab === 'seo' && (
                <div className="bg-white border border-[#e3e2e2] p-6 space-y-5 max-w-2xl">
                  <div>
                    <h3 className="font-display text-base font-semibold text-[#1b1c1c]">Search Engine Metadata</h3>
                    <p className="text-xs text-[#5e5e5b]">Default meta tags used for Google search indexing and social link sharing.</p>
                  </div>

                  <div className="space-y-4 border-t border-[#e3e2e2] pt-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1b1c1c]">Default Meta Title *</label>
                      <input
                        type="text"
                        required
                        value={settings.seo.default_meta_title}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            seo: { ...settings.seo, default_meta_title: e.target.value },
                          })
                        }
                        className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1b1c1c]">Default Meta Description *</label>
                      <textarea
                        rows={3}
                        required
                        value={settings.seo.default_meta_description}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            seo: { ...settings.seo, default_meta_description: e.target.value },
                          })
                        }
                        className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                      />
                    </div>

                    {/* OG Image */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#1b1c1c]">Default OpenGraph Share Image</label>
                      {settings.seo.default_og_image ? (
                        <div className="relative h-32 w-full bg-[#fbf9f8] border border-[#e3e2e2] overflow-hidden group">
                          <Image src={settings.seo.default_og_image} alt="OG Banner" fill className="object-cover" />
                          <button
                            type="button"
                            onClick={() =>
                              setSettings({
                                ...settings,
                                seo: { ...settings.seo, default_og_image: null },
                              })
                            }
                            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white shadow-md hover:bg-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="border border-dashed border-[#e3e2e2] bg-[#fbf9f8] p-4 text-center">
                          {isUploadingOgImage ? (
                            <div className="flex items-center justify-center gap-2 text-xs text-[#5e5e5b]">
                              <Loader2 className="h-4 w-4 animate-spin" /> Uploading Share Image...
                            </div>
                          ) : (
                            <label className="font-semibold text-xs text-[#1b1c1c] hover:underline cursor-pointer">
                              Upload OG Share Image (1200×630)
                              <input type="file" accept="image/*" onChange={handleOgImageUpload} className="hidden" />
                            </label>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: HOMEPAGE */}
              {activeTab === 'homepage' && (
                <div className="bg-white border border-[#e3e2e2] p-6 space-y-5 max-w-2xl">
                  <div>
                    <h3 className="font-display text-base font-semibold text-[#1b1c1c]">Display & Pagination Limits</h3>
                    <p className="text-xs text-[#5e5e5b]">Control product grid counts on shop pages and homepage carousels.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-[#e3e2e2] pt-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1b1c1c]">Products Per Page *</label>
                      <input
                        type="number"
                        required
                        min={4}
                        max={48}
                        value={settings.homepage.products_per_page}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            homepage: { ...settings.homepage, products_per_page: Number(e.target.value) },
                          })
                        }
                        className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1b1c1c]">Featured Products Limit *</label>
                      <input
                        type="number"
                        required
                        min={2}
                        max={24}
                        value={settings.homepage.featured_products_limit}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            homepage: { ...settings.homepage, featured_products_limit: Number(e.target.value) },
                          })
                        }
                        className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1b1c1c]">New Arrivals Limit *</label>
                      <input
                        type="number"
                        required
                        min={2}
                        max={24}
                        value={settings.homepage.new_arrivals_limit}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            homepage: { ...settings.homepage, new_arrivals_limit: Number(e.target.value) },
                          })
                        }
                        className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1b1c1c]">Best Sellers Limit *</label>
                      <input
                        type="number"
                        required
                        min={2}
                        max={24}
                        value={settings.homepage.best_sellers_limit}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            homepage: { ...settings.homepage, best_sellers_limit: Number(e.target.value) },
                          })
                        }
                        className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: MAINTENANCE */}
              {activeTab === 'maintenance' && (
                <div className="bg-white border border-[#e3e2e2] p-6 space-y-5 max-w-2xl">
                  <div>
                    <h3 className="font-display text-base font-semibold text-[#1b1c1c]">Maintenance Mode Controls</h3>
                    <p className="text-xs text-[#5e5e5b]">Temporarily pause customer purchasing during inventory updates or system upgrades.</p>
                  </div>

                  <div className="space-y-4 border-t border-[#e3e2e2] pt-4">
                    <div className="p-4 border border-[#e3e2e2] bg-[#fbf9f8] flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-xs text-[#1b1c1c]">Enable Maintenance Mode</div>
                        <div className="text-[11px] text-[#5e5e5b]">Displays maintenance announcement banner to visiting customers.</div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setSettings({
                            ...settings,
                            maintenance: {
                              ...settings.maintenance,
                              maintenance_mode: !settings.maintenance.maintenance_mode,
                            },
                          })
                        }
                        className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider border transition ${
                          settings.maintenance.maintenance_mode
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-[#f5f3f3] text-[#5e5e5b] border-[#e3e2e2]'
                        }`}
                      >
                        {settings.maintenance.maintenance_mode ? 'Maintenance ON' : 'Normal Operations'}
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1b1c1c]">Maintenance Banner Announcement Message *</label>
                      <textarea
                        rows={3}
                        required
                        value={settings.maintenance.maintenance_message}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            maintenance: {
                              ...settings.maintenance,
                              maintenance_message: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </form>
    </>
  );
}
