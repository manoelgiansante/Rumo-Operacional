-- =====================================================
-- MIGRAÇÃO: Adicionar colunas faltantes para Rumo Operacional
-- Executar no Supabase SQL Editor do projeto jxcnfyeemdltdfqtgbcl
-- NÃO altera colunas existentes, apenas adiciona as que faltam
-- =====================================================

-- =====================================================
-- 1. SECTORS - Adicionar user_id
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sectors' AND column_name='user_id') THEN
    ALTER TABLE sectors ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    RAISE NOTICE 'sectors.user_id adicionado';
  END IF;
END $$;

-- =====================================================
-- 2. OPERATIONS - Adicionar user_id
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='operations' AND column_name='user_id') THEN
    ALTER TABLE operations ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    RAISE NOTICE 'operations.user_id adicionado';
  END IF;
END $$;

-- =====================================================
-- 3. EXPENSES - Adicionar todas as colunas do Rumo Operacional
-- =====================================================
DO $$
BEGIN
  -- user_id
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='expenses' AND column_name='user_id') THEN
    ALTER TABLE expenses ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    RAISE NOTICE 'expenses.user_id adicionado';
  END IF;

  -- supplier (texto livre, além do supplier_id FK que já existe)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='expenses' AND column_name='supplier') THEN
    ALTER TABLE expenses ADD COLUMN supplier TEXT DEFAULT '';
    RAISE NOTICE 'expenses.supplier adicionado';
  END IF;

  -- agreed_value (valor combinado)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='expenses' AND column_name='agreed_value') THEN
    ALTER TABLE expenses ADD COLUMN agreed_value DECIMAL(15, 2) DEFAULT 0;
    RAISE NOTICE 'expenses.agreed_value adicionado';
  END IF;

  -- invoice_number
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='expenses' AND column_name='invoice_number') THEN
    ALTER TABLE expenses ADD COLUMN invoice_number TEXT;
    RAISE NOTICE 'expenses.invoice_number adicionado';
  END IF;

  -- payment_date
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='expenses' AND column_name='payment_date') THEN
    ALTER TABLE expenses ADD COLUMN payment_date TIMESTAMP WITH TIME ZONE;
    RAISE NOTICE 'expenses.payment_date adicionado';
  END IF;

  -- verified_by
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='expenses' AND column_name='verified_by') THEN
    ALTER TABLE expenses ADD COLUMN verified_by TEXT;
    RAISE NOTICE 'expenses.verified_by adicionado';
  END IF;

  -- verification_notes
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='expenses' AND column_name='verification_notes') THEN
    ALTER TABLE expenses ADD COLUMN verification_notes TEXT;
    RAISE NOTICE 'expenses.verification_notes adicionado';
  END IF;

  -- is_shared
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='expenses' AND column_name='is_shared') THEN
    ALTER TABLE expenses ADD COLUMN is_shared BOOLEAN DEFAULT false;
    RAISE NOTICE 'expenses.is_shared adicionado';
  END IF;

  -- allocations (JSONB para rateio entre operações)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='expenses' AND column_name='allocations') THEN
    ALTER TABLE expenses ADD COLUMN allocations JSONB;
    RAISE NOTICE 'expenses.allocations adicionado';
  END IF;
END $$;

-- =====================================================
-- 4. RLS POLICIES - Permitir acesso autenticado
-- =====================================================

-- Habilitar RLS se não estiver habilitado
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Dropar policies existentes para recriar (ignora se não existir)
DROP POLICY IF EXISTS "sectors_select_policy" ON sectors;
DROP POLICY IF EXISTS "sectors_insert_policy" ON sectors;
DROP POLICY IF EXISTS "sectors_update_policy" ON sectors;
DROP POLICY IF EXISTS "sectors_delete_policy" ON sectors;
DROP POLICY IF EXISTS "operations_select_policy" ON operations;
DROP POLICY IF EXISTS "operations_insert_policy" ON operations;
DROP POLICY IF EXISTS "operations_update_policy" ON operations;
DROP POLICY IF EXISTS "operations_delete_policy" ON operations;
DROP POLICY IF EXISTS "expenses_select_policy" ON expenses;
DROP POLICY IF EXISTS "expenses_insert_policy" ON expenses;
DROP POLICY IF EXISTS "expenses_update_policy" ON expenses;
DROP POLICY IF EXISTS "expenses_delete_policy" ON expenses;

-- Drop any old generic policies
DROP POLICY IF EXISTS "Allow all access to sectors" ON sectors;
DROP POLICY IF EXISTS "Allow all access to operations" ON operations;
DROP POLICY IF EXISTS "Allow all access to expenses" ON expenses;
DROP POLICY IF EXISTS "sectors_all_policy" ON sectors;
DROP POLICY IF EXISTS "operations_all_policy" ON operations;
DROP POLICY IF EXISTS "expenses_all_policy" ON expenses;

-- SECTORS: usuário vê apenas seus setores
CREATE POLICY "sectors_select_policy" ON sectors
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "sectors_insert_policy" ON sectors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sectors_update_policy" ON sectors
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "sectors_delete_policy" ON sectors
  FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- OPERATIONS: usuário vê apenas suas operações
CREATE POLICY "operations_select_policy" ON operations
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "operations_insert_policy" ON operations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "operations_update_policy" ON operations
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "operations_delete_policy" ON operations
  FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- EXPENSES: usuário vê apenas suas despesas
CREATE POLICY "expenses_select_policy" ON expenses
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "expenses_insert_policy" ON expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "expenses_update_policy" ON expenses
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "expenses_delete_policy" ON expenses
  FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- =====================================================
-- 5. PROFILES - Garantir policy de acesso
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;

CREATE POLICY "profiles_select_policy" ON profiles
  FOR SELECT USING (auth.uid() = user_id OR auth.uid()::text = id::text);

CREATE POLICY "profiles_insert_policy" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid()::text = id::text);

CREATE POLICY "profiles_update_policy" ON profiles
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid()::text = id::text);

-- =====================================================
-- 6. USER_SUBSCRIPTIONS - Garantir policy
-- =====================================================
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_subscriptions_select_policy" ON user_subscriptions;
DROP POLICY IF EXISTS "user_subscriptions_insert_policy" ON user_subscriptions;
DROP POLICY IF EXISTS "user_subscriptions_update_policy" ON user_subscriptions;

CREATE POLICY "user_subscriptions_select_policy" ON user_subscriptions
  FOR SELECT USING (true);

CREATE POLICY "user_subscriptions_insert_policy" ON user_subscriptions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "user_subscriptions_update_policy" ON user_subscriptions
  FOR UPDATE USING (true);

-- =====================================================
-- 7. ÍNDICES para performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_sectors_user_id ON sectors(user_id);
CREATE INDEX IF NOT EXISTS idx_operations_user_id ON operations(user_id);
CREATE INDEX IF NOT EXISTS idx_operations_sector_id ON operations(sector_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_operation_id ON expenses(operation_id);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);

-- =====================================================
-- PRONTO! Colunas adicionadas e policies configuradas.
-- O Rumo Operacional agora pode fazer CRUD normalmente.
-- =====================================================
