'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Send, CheckCircle } from 'lucide-react';
import { useToast } from '@/providers/toast-provider';

export function ContactForm() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      toast.error('Please fill in your Name, Phone Number, and Message.');
      return;
    }

    setLoading(true);
    // Simulate form submission delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Thank you! Your message has been sent successfully.');
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="bg-[#f5f3f3] rounded-xl p-8 text-center space-y-4 my-6">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h3 className="font-display text-2xl font-semibold text-[#1b1c1c]">Message Sent!</h3>
        <p className="font-sans text-xs text-[#5e5e5b] max-w-md mx-auto font-light leading-relaxed">
          Thank you for contacting Nabab Lungi. Our team has received your message and will reach out to you shortly via phone or email.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-4 text-xs font-sans uppercase tracking-widest"
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
          }}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs uppercase tracking-wider text-[#1b1c1c]">Full Name *</Label>
          <Input
            id="name"
            placeholder="e.g. Tanvir Hossain"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-[#fbf9f8]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-xs uppercase tracking-wider text-[#1b1c1c]">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="01712345678"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="bg-[#fbf9f8]"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs uppercase tracking-wider text-[#1b1c1c]">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="tanvir@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-[#fbf9f8]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject" className="text-xs uppercase tracking-wider text-[#1b1c1c]">Subject</Label>
          <Input
            id="subject"
            placeholder="Order Inquiry / Custom Request"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="bg-[#fbf9f8]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-xs uppercase tracking-wider text-[#1b1c1c]">Your Message *</Label>
        <Textarea
          id="message"
          rows={5}
          placeholder="How can we help you?"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="bg-[#fbf9f8]"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto bg-[#1b1c1c] text-white hover:bg-black px-8 py-3 text-xs uppercase font-sans tracking-widest font-semibold"
      >
        {loading ? (
          'Sending Message...'
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>Send Message</span>
            <Send className="w-4 h-4" />
          </span>
        )}
      </Button>
    </form>
  );
}
