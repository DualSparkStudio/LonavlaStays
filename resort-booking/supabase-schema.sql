-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Room Types table
CREATE TABLE IF NOT EXISTS public.room_types (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    capacity INTEGER NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    amenities TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    size INTEGER NOT NULL, -- square feet
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rooms table
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_type_id UUID REFERENCES public.room_types(id) ON DELETE CASCADE,
    room_number TEXT NOT NULL UNIQUE,
    floor INTEGER NOT NULL,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance', 'out_of_order')),
    last_cleaned TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    room_type_id UUID REFERENCES public.room_types(id) ON DELETE CASCADE,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    adults INTEGER NOT NULL DEFAULT 1,
    children INTEGER NOT NULL DEFAULT 0,
    infants INTEGER NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    base_amount DECIMAL(10,2) NOT NULL,
    taxes DECIMAL(10,2) NOT NULL DEFAULT 0,
    service_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    cleaning_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'refunded')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_intent TEXT,
    special_requests TEXT,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (check_out > check_in),
    CONSTRAINT valid_guests CHECK (adults >= 1)
);

-- Facilities table
CREATE TABLE IF NOT EXISTS public.facilities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('pool', 'spa', 'restaurant', 'bar', 'gym', 'business', 'recreation', 'other')),
    hours_open TIME,
    hours_close TIME,
    hours_days TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true
);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    room_type_id UUID REFERENCES public.room_types(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    cleanliness INTEGER NOT NULL CHECK (cleanliness >= 1 AND cleanliness <= 5),
    accuracy INTEGER NOT NULL CHECK (accuracy >= 1 AND accuracy <= 5),
    check_in INTEGER NOT NULL CHECK (check_in >= 1 AND check_in <= 5),
    communication INTEGER NOT NULL CHECK (communication >= 1 AND communication <= 5),
    location INTEGER NOT NULL CHECK (location >= 1 AND location <= 5),
    value INTEGER NOT NULL CHECK (value >= 1 AND value <= 5),
    is_verified BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(booking_id) -- One review per booking
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resort closures table (for maintenance periods)
CREATE TABLE IF NOT EXISTS public.resort_closures (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    affects_room_type_id UUID REFERENCES public.room_types(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_closure_dates CHECK (end_date >= start_date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON public.bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_room_types_active ON public.room_types(is_active);
CREATE INDEX IF NOT EXISTS idx_rooms_type ON public.rooms(room_type_id);
CREATE INDEX IF NOT EXISTS idx_reviews_room_type ON public.reviews(room_type_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_updated_at_users
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_room_types
    BEFORE UPDATE ON public.room_types
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_bookings
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Row Level Security Policies

-- Users can read their own data, admins can read all
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own data" ON public.users
    FOR SELECT USING (auth.uid() = id OR 
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Room types are publicly readable
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Room types are publicly readable" ON public.room_types
    FOR SELECT USING (is_active = true OR 
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Rooms are publicly readable
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Rooms are publicly readable" ON public.rooms
    FOR SELECT USING (true);

-- Bookings - users can see their own, admins can see all
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = user_id OR 
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON public.bookings
    FOR UPDATE USING (auth.uid() = user_id OR 
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Facilities are publicly readable
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Facilities are publicly readable" ON public.facilities
    FOR SELECT USING (is_active = true OR 
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Reviews are publicly readable, users can create their own
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are publicly readable" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their bookings" ON public.reviews
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND 
        EXISTS (
            SELECT 1 FROM public.bookings 
            WHERE id = booking_id AND user_id = auth.uid() AND status = 'checked_out'
        )
    );

-- Contact messages - users can create, admins can read all
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create contact messages" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read contact messages" ON public.contact_messages
    FOR SELECT USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Resort closures - publicly readable, admins can manage
ALTER TABLE public.resort_closures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Resort closures are publicly readable" ON public.resort_closures
    FOR SELECT USING (true);

-- Insert some sample data
INSERT INTO public.room_types (name, description, price_per_night, capacity, bedrooms, bathrooms, size, amenities, features, images) VALUES
('Ocean View Suite', 'Luxurious suite with panoramic ocean views and premium amenities', 450.00, 4, 2, 2, 1200, 
 ARRAY['WiFi', 'Air Conditioning', 'Balcony', 'Mini Bar', 'Room Service', 'Ocean View'], 
 ARRAY['King Bed', 'Sofa Bed', 'Work Desk', 'Safe', 'Coffee Machine'],
 ARRAY['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800']),

('Garden Villa', 'Private villa surrounded by tropical gardens with pool access', 320.00, 6, 3, 2, 1800,
 ARRAY['WiFi', 'Air Conditioning', 'Private Pool', 'Garden View', 'BBQ Area', 'Parking'],
 ARRAY['Queen Beds', 'Living Area', 'Kitchen', 'Dining Area', 'Outdoor Seating'],
 ARRAY['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800']),

('Deluxe Room', 'Comfortable room with modern amenities and garden views', 180.00, 2, 1, 1, 600,
 ARRAY['WiFi', 'Air Conditioning', 'Garden View', 'Mini Fridge', 'Room Service'],
 ARRAY['Queen Bed', 'Work Desk', 'Wardrobe', 'En-suite Bathroom'],
 ARRAY['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800']);

INSERT INTO public.facilities (name, description, category, hours_open, hours_close, hours_days, images) VALUES
('Infinity Pool', 'Stunning infinity pool overlooking the ocean with pool bar service', 'pool', '06:00', '22:00', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
 ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800']),

('Serenity Spa', 'Full-service spa offering massages, facials, and wellness treatments', 'spa', '08:00', '20:00',
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
 ARRAY['https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800']),

('Ocean Breeze Restaurant', 'Fine dining restaurant featuring local and international cuisine', 'restaurant', '18:00', '23:00',
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
 ARRAY['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800']),

('Sunset Bar', 'Beach bar with tropical cocktails and stunning sunset views', 'bar', '15:00', '01:00',
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
 ARRAY['https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800']);

-- Create some sample rooms
INSERT INTO public.rooms (room_type_id, room_number, floor) 
SELECT id, 'OS' || generate_series(101, 120), 
       CASE WHEN generate_series(101, 120) <= 110 THEN 1 ELSE 2 END
FROM public.room_types WHERE name = 'Ocean View Suite';

INSERT INTO public.rooms (room_type_id, room_number, floor)
SELECT id, 'GV' || generate_series(201, 210), 2
FROM public.room_types WHERE name = 'Garden Villa';

INSERT INTO public.rooms (room_type_id, room_number, floor)
SELECT id, 'DX' || generate_series(301, 340), 
       CASE 
         WHEN generate_series(301, 340) <= 320 THEN 3 
         ELSE 4 
       END
FROM public.room_types WHERE name = 'Deluxe Room'; 