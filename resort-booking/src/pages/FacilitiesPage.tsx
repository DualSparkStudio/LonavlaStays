import React from 'react';
import { Link } from 'react-router-dom';
import { ClockIcon } from '@heroicons/react/24/outline';
import PublicLayout from '../components/layout/PublicLayout';
import AnimatedSection from '../components/ui/AnimatedSection';
import Button from '../components/ui/Button';
import { resortFacilities } from '../data/resort';

const FacilitiesPage: React.FC = () => (
  <PublicLayout currentPage="facilities">
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AnimatedSection>
          <h1 className="font-heading text-4xl md:text-5xl text-gray-900 mb-3">Our facilities</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Experiences and amenities across our villa collection. What is included depends on the villa you book—see each listing for details.
          </p>
        </AnimatedSection>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resortFacilities.map((facility, index) => (
          <AnimatedSection key={facility.id} delay={index * 80} variant="fade-up">
            <article className="room-card bg-white rounded-xl overflow-hidden border border-gray-100 shadow-md h-full flex flex-col">
              <div className="overflow-hidden">
                <img
                  src={facility.image}
                  alt={facility.name}
                  className="room-card-image w-full h-52 object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h2 className="font-heading text-xl text-gray-900 mb-2 uppercase tracking-wide">{facility.name}</h2>
                <p className="text-base text-gray-600 mb-4 flex-1">{facility.description}</p>
                <p className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <ClockIcon className="h-5 w-5 text-airbnb-red" />
                  {facility.hours}
                </p>
              </div>
            </article>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection delay={200} className="mt-14 text-center bg-white rounded-2xl border border-gray-100 p-10 shadow-sm">
        <h2 className="font-heading text-3xl text-gray-900 mb-3">Ready to book your villa?</h2>
        <p className="text-lg text-gray-600 mb-6">Pair your favourite facilities with the perfect villa for your dates.</p>
        <Link to="/villas">
          <Button size="lg" className="btn-primary-motion rounded-full">
            Browse villas
          </Button>
        </Link>
      </AnimatedSection>
    </div>
  </PublicLayout>
);

export default FacilitiesPage;
