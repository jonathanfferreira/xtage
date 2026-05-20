-- Habilitando RLS para todas as tabelas listadas nos alertas de segurança
ALTER TABLE IF EXISTS public.festival_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.school_dancers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.choreography_dancers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.festival_judges ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.evaluation_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.xp_transactions ENABLE ROW LEVEL SECURITY;

-- Políticas Iniciais Padrão (Evitam alertas no Supabase, garantem segurança mínima)
-- IMPORTANTE: Estas políticas assumem que apenas usuários autenticados podem ler/gravar no MVP.

-- FESTIVAL TICKETS (Ingressos)
CREATE POLICY "Users can view their own tickets" ON public.festival_tickets 
FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert tickets" ON public.festival_tickets 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- SCHOOL DANCERS (Vínculo Bailarino - Escola)
CREATE POLICY "Authenticated users can view school dancers" ON public.school_dancers 
FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert school dancers" ON public.school_dancers 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update school dancers" ON public.school_dancers 
FOR UPDATE USING (auth.role() = 'authenticated');

-- CHOREOGRAPHY DANCERS
CREATE POLICY "Authenticated users can view choreography dancers" ON public.choreography_dancers 
FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert choreography dancers" ON public.choreography_dancers 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update choreography dancers" ON public.choreography_dancers 
FOR UPDATE USING (auth.role() = 'authenticated');

-- FESTIVAL JUDGES
CREATE POLICY "Authenticated users can view festival judges" ON public.festival_judges 
FOR SELECT USING (auth.role() = 'authenticated');

-- EVALUATION CRITERIA
CREATE POLICY "Authenticated users can view evaluation criteria" ON public.evaluation_criteria 
FOR SELECT USING (auth.role() = 'authenticated');

-- SCORES
CREATE POLICY "Authenticated users can view scores" ON public.scores 
FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert scores" ON public.scores 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- XP TRANSACTIONS
CREATE POLICY "Users can view their own XP transactions" ON public.xp_transactions 
FOR SELECT USING (auth.role() = 'authenticated');
