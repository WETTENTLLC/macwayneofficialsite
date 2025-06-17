-- Mac Wayne Official Database Schema
-- This file defines the database structure for the Mac Wayne website

-- Users table for authentication and profiles
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_blind BOOLEAN DEFAULT FALSE,
    accessibility_preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Sheriff Thizz Rewards - Loyalty Program
CREATE TABLE loyalty_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    membership_tier VARCHAR(20) DEFAULT 'rookie' CHECK (membership_tier IN ('rookie', 'deputy', 'sheriff', 'legend')),
    points_balance INTEGER DEFAULT 0,
    lifetime_points INTEGER DEFAULT 0,
    points_earned_this_month INTEGER DEFAULT 0,
    tier_benefits JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products for the shop
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('music', 'merch', 'digital')),
    is_featured BOOLEAN DEFAULT FALSE,
    audio_sample_url VARCHAR(500),
    audio_duration VARCHAR(10),
    digital_download_url VARCHAR(500),
    inventory_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders and transactions
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_id VARCHAR(255),
    shipping_address JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Points transactions for loyalty program
CREATE TABLE points_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('earned', 'redeemed', 'bonus', 'expired')),
    points_amount INTEGER NOT NULL,
    description TEXT,
    reference_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Live assistance sessions
CREATE TABLE live_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    volunteer_id UUID REFERENCES users(id),
    session_type VARCHAR(20) DEFAULT 'help' CHECK (session_type IN ('help', 'facetime', 'dj_request')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
    description TEXT,
    tip_amount DECIMAL(10,2) DEFAULT 0,
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documentary interactions and sequel vault
CREATE TABLE documentary_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    interaction_type VARCHAR(30) NOT NULL CHECK (interaction_type IN ('timeline_view', 'vr_tour', 'audio_tour', 'sequel_subscribe')),
    timeline_event VARCHAR(100),
    session_data JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email subscriptions for sequel vault
CREATE TABLE sequel_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    verification_token VARCHAR(255),
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP
);

-- Voice command usage analytics
CREATE TABLE voice_commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    command_text TEXT NOT NULL,
    command_type VARCHAR(50),
    success BOOLEAN DEFAULT TRUE,
    session_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audio content accessibility data
CREATE TABLE audio_transcripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audio_url VARCHAR(500) NOT NULL,
    title VARCHAR(255),
    transcript_text TEXT,
    transcript_timestamps JSONB DEFAULT '[]',
    accessibility_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_loyalty_members_user_id ON loyalty_members(user_id);
CREATE INDEX idx_loyalty_members_tier ON loyalty_members(membership_tier);
CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_points_transactions_user_id ON points_transactions(user_id);
CREATE INDEX idx_live_sessions_user_id ON live_sessions(user_id);
CREATE INDEX idx_live_sessions_status ON live_sessions(status);
CREATE INDEX idx_documentary_interactions_user_id ON documentary_interactions(user_id);
CREATE INDEX idx_sequel_subscriptions_email ON sequel_subscriptions(email);
CREATE INDEX idx_voice_commands_user_id ON voice_commands(user_id);
CREATE INDEX idx_audio_transcripts_url ON audio_transcripts(audio_url);

-- Sample data for development
INSERT INTO products (name, description, price, type, is_featured, audio_sample_url, audio_duration) VALUES
('Blind & Battered - Full Album', 'Complete album with 12 tracks of raw storytelling', 15.99, 'music', true, '/audio/blind-battered-preview.mp3', '3:45'),
('Cell Block Beats Tutorial Pack', 'Production tutorials recorded from behind bars', 49.99, 'digital', true, '/audio/cell-block-beats-intro.mp3', '2:30'),
('Blind & Battered Hoodie', 'Premium hoodie with embossed Braille logo', 34.99, 'merch', false, null, null),
('Street Stories - Single', 'Latest track about life on the streets', 2.99, 'music', false, '/audio/street-stories-preview.mp3', '4:12'),
('Behind Bars Beats Vol. 1', 'Instrumental beats created in prison', 9.99, 'music', false, '/audio/behind-bars-beats-preview.mp3', '2:55');

-- Sample loyalty program data
INSERT INTO loyalty_members (user_id, membership_tier, points_balance, lifetime_points) 
SELECT gen_random_uuid(), 'rookie', 0, 0;

-- Sample accessibility transcripts
INSERT INTO audio_transcripts (audio_url, title, transcript_text) VALUES
('/audio/blind-battered-preview.mp3', 'Blind & Battered Preview', 'From the cell block to the studio, this is my story of finding light in darkness...'),
('/audio/documentary-narration.mp3', 'Documentary Narration - The Beginning', 'My name is Mac Wayne, and this is how I lost my sight but found my vision...');

-- Functions and triggers for loyalty points
CREATE OR REPLACE FUNCTION calculate_loyalty_points(order_total DECIMAL)
RETURNS INTEGER AS $$
BEGIN
    -- 1 point per dollar spent, bonus for larger orders
    RETURN CASE 
        WHEN order_total >= 100 THEN FLOOR(order_total * 1.5)
        WHEN order_total >= 50 THEN FLOOR(order_total * 1.2)
        ELSE FLOOR(order_total)
    END;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_loyalty_tier(user_uuid UUID)
RETURNS VARCHAR AS $$
DECLARE
    lifetime_pts INTEGER;
    new_tier VARCHAR(20);
BEGIN
    SELECT lifetime_points INTO lifetime_pts 
    FROM loyalty_members 
    WHERE user_id = user_uuid;
    
    new_tier := CASE 
        WHEN lifetime_pts >= 5000 THEN 'legend'
        WHEN lifetime_pts >= 1000 THEN 'sheriff'
        WHEN lifetime_pts >= 250 THEN 'deputy'
        ELSE 'rookie'
    END;
    
    UPDATE loyalty_members 
    SET membership_tier = new_tier, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = user_uuid;
    
    RETURN new_tier;
END;
$$ LANGUAGE plpgsql;
