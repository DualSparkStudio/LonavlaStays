import React, { useState } from 'react';
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import PublicLayout from '../components/layout/PublicLayout';
import AnimatedSection from '../components/ui/AnimatedSection';
import Button from '../components/ui/Button';
import {
  RESORT_ADDRESS,
  RESORT_EMAIL,
  RESORT_NAME,
  RESORT_PHONE,
} from '../data/resort';

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Villa enquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PublicLayout currentPage="contact">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <AnimatedSection>
            <h1 className="font-heading text-4xl md:text-5xl text-gray-900 mb-3">Contact us</h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Questions about a specific villa, availability, or directions? Our reservations team manages every property in our collection.
            </p>
          </AnimatedSection>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <AnimatedSection className="lg:col-span-1 space-y-6">
            {[
              { icon: MapPinIcon, label: 'Reservations office', value: RESORT_ADDRESS },
              { icon: PhoneIcon, label: 'Phone', value: RESORT_PHONE },
              { icon: EnvelopeIcon, label: 'Email', value: RESORT_EMAIL },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex gap-4"
              >
                <item.icon className="h-8 w-8 text-airbnb-red shrink-0" />
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">{item.label}</p>
                  <p className="text-base font-medium text-gray-900 mt-1">{item.value}</p>
                </div>
              </div>
            ))}
            <div className="rounded-xl overflow-hidden h-48 shadow-sm border border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
                alt="Lonavala hills"
                className="w-full h-full object-cover"
              />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={150} className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <p className="text-2xl font-bold text-gray-900 mb-2">Thank you!</p>
                  <p className="text-lg text-gray-600">
                    We received your message and will reply within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-1">Name</label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-airbnb-red/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-airbnb-red/30"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-1">Phone</label>
                      <input
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-airbnb-red/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-1">Subject</label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-airbnb-red/30"
                      >
                        <option>Villa enquiry</option>
                        <option>Facilities & events</option>
                        <option>Group booking</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-airbnb-red/30"
                      placeholder="Tell us your dates, number of guests, or any questions..."
                    />
                  </div>
                  <Button type="submit" size="lg" fullWidth className="rounded-full btn-primary-motion">
                    Send message
                  </Button>
                </form>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ContactPage;
