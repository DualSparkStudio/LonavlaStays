import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDays, format } from 'date-fns';
import AnimatedSection from '../ui/AnimatedSection';
import { demoRooms, RESORT_LOCATION } from '../../data/resort';
import { propertiesForSale } from '../../data/propertiesForSale';
import { cn } from '../../utils/cn';

type HeroMode = 'stay' | 'buy';

const stayAreas = ['All areas', ...Array.from(new Set(demoRooms.map((r) => r.location)))];
const buyAreas = [
  'All areas',
  ...Array.from(new Set(propertiesForSale.map((p) => p.location))),
];

const toDateValue = (date: Date) => format(date, 'yyyy-MM-dd');

const HeroExplorer: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<HeroMode>('stay');

  const [stayArea, setStayArea] = useState('All areas');
  const [checkIn, setCheckIn] = useState(toDateValue(addDays(new Date(), 1)));
  const [checkOut, setCheckOut] = useState(toDateValue(addDays(new Date(), 3)));
  const [guests, setGuests] = useState('2');

  const [buyType, setBuyType] = useState<'all' | 'villa' | 'plot'>('all');
  const [buyArea, setBuyArea] = useState('All areas');

  const maxGuests = useMemo(
    () => Math.max(...demoRooms.map((r) => r.max_guests), 10),
    []
  );

  const handleStaySearch = () => {
    const params = new URLSearchParams();
    if (stayArea !== 'All areas') params.set('area', stayArea);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);
    const q = params.toString();
    navigate(q ? `/villas?${q}` : '/villas');
  };

  const handleBuySearch = () => {
    const params = new URLSearchParams();
    if (buyType !== 'all') params.set('category', buyType);
    if (buyArea !== 'All areas') params.set('area', buyArea);
    const q = params.toString();
    navigate(q ? `/for-sale?${q}` : '/for-sale');
  };

  const fieldClass =
    'flex-1 min-w-0 px-3 py-2 md:px-4 md:py-3 border-b border-gray-100 md:border-b-0';
  const labelClass = 'text-sm font-bold text-gray-900 mb-1';
  const inputClass =
    'w-full text-base font-medium text-gray-700 bg-transparent border-0 focus:outline-none focus:ring-0 p-0';

  return (
    <AnimatedSection variant="scale-in" delay={250} className="max-w-4xl mx-auto w-full">
      <div className="search-bar-shell bg-white rounded-2xl md:rounded-3xl shadow-lg border border-gray-200 p-3 md:p-4 motion-safe:animate-float">
        {/* Mode toggle */}
        <div className="flex justify-center mb-3 md:mb-4">
          <div className="inline-flex rounded-full bg-gray-100 p-1 gap-1">
            <button
              type="button"
              onClick={() => setMode('stay')}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-bold transition-all duration-200',
                mode === 'stay'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Book a villa stay
            </button>
            <button
              type="button"
              onClick={() => setMode('buy')}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-bold transition-all duration-200',
                mode === 'buy'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Buy plot or villa
            </button>
          </div>
        </div>

        {mode === 'stay' ? (
          <>
            <p className="text-center text-sm text-gray-500 mb-3 px-2">
              Nightly villa rentals across {RESORT_LOCATION} — pick dates and browse available stays.
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:divide-x md:divide-gray-300">
              <div className={fieldClass}>
                <div className={labelClass}>Area</div>
                <select
                  value={stayArea}
                  onChange={(e) => setStayArea(e.target.value)}
                  className={cn(inputClass, 'cursor-pointer')}
                >
                  {stayAreas.map((area) => (
                    <option key={area} value={area}>
                      {area === 'All areas' ? `All areas · ${RESORT_LOCATION}` : area}
                    </option>
                  ))}
                </select>
              </div>
              <div className={fieldClass}>
                <div className={labelClass}>Check in</div>
                <input
                  type="date"
                  value={checkIn}
                  min={toDateValue(new Date())}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className={fieldClass}>
                <div className={labelClass}>Check out</div>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || toDateValue(new Date())}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className={cn(fieldClass, 'flex items-end justify-between gap-3 md:min-w-[140px]')}>
                <div className="flex-1 min-w-0">
                  <div className={labelClass}>Guests</div>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className={cn(inputClass, 'cursor-pointer')}
                  >
                    {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={String(n)}>
                        {n} guest{n !== 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleStaySearch}
                  className="bg-airbnb-red hover:bg-airbnb-red-dark text-white p-3 rounded-full shrink-0 btn-primary-motion"
                  aria-label="Search villa stays"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-center text-sm text-gray-500 mb-3 px-2">
              Own a piece of Lonavala — browse NA plots and ready villas with photos, details, and
              direct contact.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-0 sm:divide-x sm:divide-gray-300">
              <div className={fieldClass}>
                <div className={labelClass}>Property type</div>
                <select
                  value={buyType}
                  onChange={(e) => setBuyType(e.target.value as typeof buyType)}
                  className={cn(inputClass, 'cursor-pointer')}
                >
                  <option value="all">Plots &amp; villas</option>
                  <option value="villa">Villas only</option>
                  <option value="plot">Plots only</option>
                </select>
              </div>
              <div className={fieldClass}>
                <div className={labelClass}>Area</div>
                <select
                  value={buyArea}
                  onChange={(e) => setBuyArea(e.target.value)}
                  className={cn(inputClass, 'cursor-pointer')}
                >
                  {buyAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
              <div className={cn(fieldClass, 'sm:border-b-0 flex items-end justify-end pt-2 sm:pt-0')}>
                <button
                  type="button"
                  onClick={handleBuySearch}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-airbnb-red px-6 py-3 text-white font-bold hover:bg-airbnb-red-dark btn-primary-motion"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  View listings
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AnimatedSection>
  );
};

export default HeroExplorer;
