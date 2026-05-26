import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';
import SearchBar from '../components/ui/SearchBar';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  const handleSearch = (filters: any) => {
    console.log('Search filters:', filters);
    // Navigate to rooms page with filters
  };

  const featuredRooms = [
    {
      id: '1',
      name: 'Ocean View Suite',
      price: 450,
      rating: 4.9,
      reviews: 127,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
      location: 'Beachfront',
      amenities: ['Ocean View', 'Balcony', 'King Bed']
    },
    {
      id: '2',
      name: 'Garden Villa',
      price: 320,
      rating: 4.8,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
      location: 'Garden View',
      amenities: ['Private Pool', 'Garden', 'Kitchen']
    },
    {
      id: '3',
      name: 'Deluxe Room',
      price: 180,
      rating: 4.7,
      reviews: 203,
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop',
      location: 'Resort View',
      amenities: ['Garden View', 'Queen Bed', 'Work Desk']
    }
  ];

  const facilities = [
    {
      name: 'Infinity Pool',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
      description: 'Stunning infinity pool with ocean views'
    },
    {
      name: 'Spa & Wellness',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop',
      description: 'Full-service spa with rejuvenating treatments'
    },
    {
      name: 'Fine Dining',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
      description: 'Exquisite cuisine with ocean views'
    },
    {
      name: 'Beach Bar',
      image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop',
      description: 'Tropical cocktails at sunset'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080&fit=crop)'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-6xl font-normal tracking-wide mb-6">
            Experience Paradise at 
            <span className="block text-airbnb-red">ResortStay</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Luxury accommodations with breathtaking ocean views and world-class amenities
          </p>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-8">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4">
              Explore Rooms
            </Button>
            <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
              View Facilities
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-normal tracking-wide text-gray-900 mb-4">
              Featured Accommodations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular rooms and suites, each designed for comfort and luxury
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRooms.map((room) => (
              <Link
                key={room.id}
                to={`/rooms/${room.id}`}
                className="group card overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-medium">{room.rating}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">{room.name}</h3>
                    <p className="text-lg font-bold text-gray-900">
                      ${room.price}<span className="text-sm font-normal text-gray-600">/night</span>
                    </p>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{room.location}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {room.amenities.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-500">{room.reviews} reviews</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/rooms">
              <Button variant="outline" size="lg">
                View All Rooms
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-normal tracking-wide text-gray-900 mb-4">
              World-Class Facilities
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Indulge in our exceptional amenities designed to make your stay unforgettable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((facility) => (
              <div key={facility.name} className="text-center">
                <div className="relative mb-4 overflow-hidden rounded-xl">
                  <img
                    src={facility.image}
                    alt={facility.name}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{facility.name}</h3>
                <p className="text-gray-600 text-sm">{facility.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/facilities">
              <Button variant="outline" size="lg">
                Explore All Facilities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-airbnb">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl md:text-4xl font-normal tracking-wide text-white mb-4">
            Ready for Your Perfect Getaway?
          </h2>
          <p className="text-xl text-white mb-8 opacity-90">
            Book your stay today and experience luxury redefined
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
              Book Now
            </Button>
            <Button variant="ghost" size="lg" className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-airbnb-red">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 