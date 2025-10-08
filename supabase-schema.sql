-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table
CREATE TABLE companies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    company_id UUID REFERENCES companies(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams table
CREATE TABLE teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company_id UUID REFERENCES companies(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members junction table
CREATE TABLE team_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Meeting rooms table
CREATE TABLE meeting_rooms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    location VARCHAR(255),
    amenities TEXT[],
    company_id UUID REFERENCES companies(id) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_id UUID REFERENCES meeting_rooms(id) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    team_id UUID REFERENCES teams(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
    credits_used INTEGER DEFAULT 0 CHECK (credits_used >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_booking_time CHECK (end_time > start_time)
);

-- Credit allocations table
CREATE TABLE credit_allocations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) NOT NULL,
    team_id UUID REFERENCES teams(id),
    user_id UUID REFERENCES users(id),
    credits_allocated INTEGER NOT NULL CHECK (credits_allocated > 0),
    credits_used INTEGER DEFAULT 0 CHECK (credits_used >= 0),
    allocated_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT credit_target_check CHECK (
        (team_id IS NOT NULL AND user_id IS NULL) OR
        (team_id IS NULL AND user_id IS NOT NULL)
    )
);

-- Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_allocations ENABLE ROW LEVEL SECURITY;

-- Companies policies
CREATE POLICY "Users can view their company" ON companies
    FOR SELECT USING (
        id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admins can update their company" ON companies
    FOR UPDATE USING (
        id IN (
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Users policies
CREATE POLICY "Users can view company users" ON users
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can manage company users" ON users
    FOR ALL USING (
        company_id IN (
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Teams policies
CREATE POLICY "Users can view company teams" ON teams
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage company teams" ON teams
    FOR ALL USING (
        company_id IN (
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Team members policies
CREATE POLICY "Users can view team members" ON team_members
    FOR SELECT USING (
        team_id IN (
            SELECT t.id FROM teams t
            JOIN users u ON t.company_id = u.company_id
            WHERE u.id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage team members" ON team_members
    FOR ALL USING (
        team_id IN (
            SELECT t.id FROM teams t
            JOIN users u ON t.company_id = u.company_id
            WHERE u.id = auth.uid() AND u.role = 'admin'
        )
    );

-- Meeting rooms policies
CREATE POLICY "Users can view company rooms" ON meeting_rooms
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage company rooms" ON meeting_rooms
    FOR ALL USING (
        company_id IN (
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Bookings policies
CREATE POLICY "Users can view company bookings" ON bookings
    FOR SELECT USING (
        room_id IN (
            SELECT mr.id FROM meeting_rooms mr
            JOIN users u ON mr.company_id = u.company_id
            WHERE u.id = auth.uid()
        )
    );

CREATE POLICY "Users can create bookings" ON bookings
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        room_id IN (
            SELECT mr.id FROM meeting_rooms mr
            JOIN users u ON mr.company_id = u.company_id
            WHERE u.id = auth.uid()
        )
    );

CREATE POLICY "Users can update their bookings" ON bookings
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all company bookings" ON bookings
    FOR ALL USING (
        room_id IN (
            SELECT mr.id FROM meeting_rooms mr
            JOIN users u ON mr.company_id = u.company_id
            WHERE u.id = auth.uid() AND u.role = 'admin'
        )
    );

-- Credit allocations policies
CREATE POLICY "Users can view company credit allocations" ON credit_allocations
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage company credits" ON credit_allocations
    FOR ALL USING (
        company_id IN (
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meeting_rooms_updated_at BEFORE UPDATE ON meeting_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_credit_allocations_updated_at BEFORE UPDATE ON credit_allocations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, first_name, last_name, company_id, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE((NEW.raw_user_meta_data->>'company_id')::uuid, '00000000-0000-0000-0000-000000000000'::uuid),
        COALESCE(NEW.raw_user_meta_data->>'role', 'user')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
