'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/providers/toast-provider';
import { User, Store, Shield, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'store' | 'security'>('profile');

  // Form states
  const [storeName, setStoreName] = useState('Nabab Lungi');
  const [supportEmail, setSupportEmail] = useState('support@nobablungi.com');
  const [supportPhone, setSupportPhone] = useState('01712345678');
  const [dhakaCharge, setDhakaCharge] = useState('70');
  const [outsideDhakaCharge, setOutsideDhakaCharge] = useState('130');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Store settings saved successfully.');
    }, 600);
  };

  return (
    <>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e2] pb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl">
            Store & Merchant Settings
          </h1>
          <p className="text-xs text-[#5e5e5b] mt-1">
            Configure delivery fees, merchant details, and store profile parameters.
          </p>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e3e2e2]">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition border-b-2 -mb-px ${
            activeTab === 'profile'
              ? 'border-[#1b1c1c] text-[#1b1c1c]'
              : 'border-transparent text-[#5e5e5b] hover:text-[#1b1c1c]'
          }`}
        >
          <User className="h-4 w-4 stroke-[1.5]" />
          Admin Profile
        </button>
        <button
          onClick={() => setActiveTab('store')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition border-b-2 -mb-px ${
            activeTab === 'store'
              ? 'border-[#1b1c1c] text-[#1b1c1c]'
              : 'border-transparent text-[#5e5e5b] hover:text-[#1b1c1c]'
          }`}
        >
          <Store className="h-4 w-4 stroke-[1.5]" />
          Store & Delivery
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition border-b-2 -mb-px ${
            activeTab === 'security'
              ? 'border-[#1b1c1c] text-[#1b1c1c]'
              : 'border-transparent text-[#5e5e5b] hover:text-[#1b1c1c]'
          }`}
        >
          <Shield className="h-4 w-4 stroke-[1.5]" />
          Security
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-white border border-[#e3e2e2] p-6 max-w-3xl">
        <form onSubmit={handleSave} className="space-y-6">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <h2 className="font-display text-base font-semibold text-[#1b1c1c] border-b border-[#e3e2e2] pb-3">
                Merchant Profile Information
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1b1c1c]">Full Name</label>
                  <input
                    type="text"
                    defaultValue="Nobab Admin"
                    className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1b1c1c]">Admin Email</label>
                  <input
                    type="email"
                    defaultValue="admin@nobablungi.com"
                    disabled
                    className="w-full bg-[#efeded] border border-[#e3e2e2] py-2 px-3 text-xs text-[#5e5e5b] rounded-none cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'store' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="font-display text-base font-semibold text-[#1b1c1c] border-b border-[#e3e2e2] pb-3">
                  Store Identity & Contact
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1b1c1c]">Store Brand Name</label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1b1c1c]">Support Email</label>
                    <input
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-semibold text-[#1b1c1c]">Customer Support Phone</label>
                    <input
                      type="tel"
                      value={supportPhone}
                      onChange={(e) => setSupportPhone(e.target.value)}
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h2 className="font-display text-base font-semibold text-[#1b1c1c] border-b border-[#e3e2e2] pb-3">
                  Default Delivery Fees (BDT)
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1b1c1c]">Inside Dhaka Fee (৳)</label>
                    <input
                      type="number"
                      value={dhakaCharge}
                      onChange={(e) => setDhakaCharge(e.target.value)}
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1b1c1c]">Outside Dhaka Fee (৳)</label>
                    <input
                      type="number"
                      value={outsideDhakaCharge}
                      onChange={(e) => setOutsideDhakaCharge(e.target.value)}
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <h2 className="font-display text-base font-semibold text-[#1b1c1c] border-b border-[#e3e2e2] pb-3">
                Security & Authentication
              </h2>

              <p className="text-xs text-[#5e5e5b] leading-relaxed">
                Merchant sessions are secured via NextAuth JWT authentication. Password changes can be performed directly through your account security panel.
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-[#e3e2e2]">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSaving}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving Changes...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
