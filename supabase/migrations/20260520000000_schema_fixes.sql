-- Tabela Festivals: Adicionando coluna 'status' usada em todo o sistema.
ALTER TABLE festivals ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';

-- Tabela Choreographies: Ajustando para o que a Server Action 'enrollChoreography' de school_id faz.
ALTER TABLE choreographies ADD COLUMN IF NOT EXISTS festival_id UUID REFERENCES festivals(id) ON DELETE CASCADE;
ALTER TABLE choreographies ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE choreographies ADD COLUMN IF NOT EXISTS music_url TEXT;
ALTER TABLE choreographies ADD COLUMN IF NOT EXISTS time_limit_seconds INTEGER;

-- Tabela Inscriptions: Adicionando school_id para consultas diretas e facilitar joins.
ALTER TABLE inscriptions ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;

-- Atualizar Policies se necessário
-- (Como adicionamos school_id em inscriptions, os diretores agora podem usar a Policy original
-- mas também seria bom ter acesso direto, a policy atual do banco já olha a tabela 'choreographies'
-- mas garantimos que a inserção funcionará).
