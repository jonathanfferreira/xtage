-- Enums para controle de estado
CREATE TYPE user_role AS ENUM ('admin', 'organizer', 'school_director', 'dancer', 'judge');
CREATE TYPE inscription_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE festival_dancer_status AS ENUM ('registered', 'blocked_from_lineup');
CREATE TYPE invoice_status AS ENUM ('pending', 'paid', 'canceled', 'overdue');

-- 1. Profiles (Estende auth.users do Supabase)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role user_role NOT NULL DEFAULT 'dancer',
    full_name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Schools (Escolas de Dança)
CREATE TABLE schools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    director_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    city TEXT,
    state TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Festivals (Eventos criados pelos organizadores)
CREATE TABLE festivals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organizer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_deadline TIMESTAMPTZ NOT NULL,
    payment_cutoff_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela auxiliar: Categories (Categorias do festival ex: Jazz Duo, Ballet Solo)
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    festival_id UUID REFERENCES festivals(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    max_duration_seconds INTEGER NOT NULL,
    base_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Choreographies (Coreografias cadastradas pelas escolas para um festival)
CREATE TABLE choreographies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    audio_url TEXT,
    audio_duration_seconds INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Inscriptions (Vínculo do bailarino com a coreografia e a escola)
CREATE TABLE inscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    choreography_id UUID REFERENCES choreographies(id) ON DELETE CASCADE NOT NULL,
    dancer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    school_status inscription_status DEFAULT 'pending', -- Diretor da escola precisa aprovar
    festival_status festival_dancer_status DEFAULT 'registered', -- Pode ser bloqueado por falta de pagamento
    costume_measurements JSONB, -- Medidas do figurino
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(choreography_id, dancer_id)
);

-- 6. Invoices (Fatura Única / Carrinho)
CREATE TABLE invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    dancer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    festival_id UUID REFERENCES festivals(id) ON DELETE CASCADE NOT NULL,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
    status invoice_status DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    stripe_payment_id TEXT,
    due_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Invoice Items (Taxa Festival, Hotel, Ônibus, Figurino)
CREATE TABLE invoice_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    item_type TEXT NOT NULL, -- 'festival_fee', 'hotel', 'bus', 'costume', 'other'
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE festivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE choreographies ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);

-- SCHOOLS
CREATE POLICY "Schools are viewable by everyone" ON schools FOR SELECT USING (true);
CREATE POLICY "Directors can update own school" ON schools FOR UPDATE USING (auth.uid() = director_id);
CREATE POLICY "Directors can insert school" ON schools FOR INSERT WITH CHECK (auth.uid() = director_id);

-- FESTIVALS
CREATE POLICY "Festivals are viewable by everyone" ON festivals FOR SELECT USING (true);
CREATE POLICY "Organizers can manage own festivals" ON festivals FOR ALL USING (auth.uid() = organizer_id);

-- CATEGORIES
CREATE POLICY "Categories viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Organizers can manage categories" ON categories FOR ALL USING (
    festival_id IN (SELECT id FROM festivals WHERE organizer_id = auth.uid())
);

-- CHOREOGRAPHIES
CREATE POLICY "Directors can manage their choreographies" ON choreographies FOR ALL USING (
    school_id IN (SELECT id FROM schools WHERE director_id = auth.uid())
);
CREATE POLICY "Dancers can view their choreographies" ON choreographies FOR SELECT USING (
    id IN (SELECT choreography_id FROM inscriptions WHERE dancer_id = auth.uid() AND school_status = 'approved')
);

-- INSCRIPTIONS
CREATE POLICY "Dancers can manage own inscriptions" ON inscriptions FOR ALL USING (dancer_id = auth.uid());
CREATE POLICY "Directors can manage school inscriptions" ON inscriptions FOR ALL USING (
    choreography_id IN (SELECT id FROM choreographies WHERE school_id IN (SELECT id FROM schools WHERE director_id = auth.uid()))
);

-- INVOICES
CREATE POLICY "Dancers can view own invoices" ON invoices FOR SELECT USING (dancer_id = auth.uid());
CREATE POLICY "Organizers can view their festival invoices" ON invoices FOR SELECT USING (
    festival_id IN (SELECT id FROM festivals WHERE organizer_id = auth.uid())
);
CREATE POLICY "Directors can view their school invoices" ON invoices FOR SELECT USING (
    school_id IN (SELECT id FROM schools WHERE director_id = auth.uid())
);

-- INVOICE ITEMS
CREATE POLICY "Dancers can view own invoice items" ON invoice_items FOR SELECT USING (
    invoice_id IN (SELECT id FROM invoices WHERE dancer_id = auth.uid())
);
CREATE POLICY "Organizers can view their festival invoice items" ON invoice_items FOR SELECT USING (
    invoice_id IN (SELECT id FROM invoices WHERE festival_id IN (SELECT id FROM festivals WHERE organizer_id = auth.uid()))
);
CREATE POLICY "Directors can view their school invoice items" ON invoice_items FOR SELECT USING (
    invoice_id IN (SELECT id FROM invoices WHERE school_id IN (SELECT id FROM schools WHERE director_id = auth.uid()))
);
