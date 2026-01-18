-- =====================================================
-- SCHEMA RUMO FINANCE - VERSÃO LIMPA
-- SEM REFERÊNCIAS A auth.users (evita erro user_id)
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- PASSO 1: Dropar tabelas existentes (se houver)
DROP TABLE IF EXISTS import_previews CASCADE;
DROP TABLE IF EXISTS excel_imports CASCADE;
DROP TABLE IF EXISTS user_subscriptions CASCADE;
DROP TABLE IF EXISTS asset_depreciations CASCADE;
DROP TABLE IF EXISTS financial_statements CASCADE;
DROP TABLE IF EXISTS forecasts CASCADE;
DROP TABLE IF EXISTS lease_payments CASCADE;
DROP TABLE IF EXISTS lease_contracts CASCADE;
DROP TABLE IF EXISTS barter_contracts CASCADE;
DROP TABLE IF EXISTS season_costs CASCADE;
DROP TABLE IF EXISTS seasons CASCADE;
DROP TABLE IF EXISTS fields CASCADE;
DROP TABLE IF EXISTS month_closings CASCADE;
DROP TABLE IF EXISTS divergences CASCADE;
DROP TABLE IF EXISTS attachments CASCADE;
DROP TABLE IF EXISTS mdfes CASCADE;
DROP TABLE IF EXISTS nfes CASCADE;
DROP TABLE IF EXISTS fiscal_products CASCADE;
DROP TABLE IF EXISTS fiscal_operation_templates CASCADE;
DROP TABLE IF EXISTS fiscal_recipients CASCADE;
DROP TABLE IF EXISTS fiscal_issuers CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS bank_accounts CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS purchase_order_items CASCADE;
DROP TABLE IF EXISTS purchase_orders CASCADE;
DROP TABLE IF EXISTS stock_movements CASCADE;
DROP TABLE IF EXISTS stock_items CASCADE;
DROP TABLE IF EXISTS contracts CASCADE;
DROP TABLE IF EXISTS revenues CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS cost_centers CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS operations CASCADE;
DROP TABLE IF EXISTS sectors CASCADE;
DROP TABLE IF EXISTS farms CASCADE;

-- =====================================================
-- 1. ENABLE UUID EXTENSION
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 2. FARMS (Fazendas)
-- =====================================================
CREATE TABLE farms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cpf_cnpj TEXT,
  state_registration TEXT,
  area DECIMAL(10, 2),
  city TEXT,
  state TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. SECTORS (Setores)
-- =====================================================
CREATE TABLE sectors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  color TEXT NOT NULL DEFAULT '#2E7D32',
  icon TEXT NOT NULL DEFAULT 'Layers',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. OPERATIONS (Operações)
-- =====================================================
CREATE TABLE operations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  sector_id UUID REFERENCES sectors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  type TEXT,
  color TEXT DEFAULT '#1565C0',
  icon TEXT DEFAULT 'Tractor',
  budget DECIMAL(15, 2) DEFAULT 0,
  spent DECIMAL(15, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. SUPPLIERS (Fornecedores)
-- =====================================================
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cpf_cnpj TEXT,
  category TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. CLIENTS (Clientes)
-- =====================================================
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cpf_cnpj TEXT,
  type TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  state_registration TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. CATEGORIES (Categorias)
-- =====================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT,
  color TEXT,
  icon TEXT,
  subcategories TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. COST CENTERS (Centros de Custo)
-- =====================================================
CREATE TABLE cost_centers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  operation_id UUID REFERENCES operations(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES cost_centers(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. EXPENSES (Despesas)
-- =====================================================
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  description TEXT NOT NULL,
  supplier TEXT,
  supplier_id UUID REFERENCES suppliers(id),
  operation_id UUID REFERENCES operations(id),
  cost_center_id UUID REFERENCES cost_centers(id),
  category TEXT,
  subcategory TEXT,
  agreed_value DECIMAL(15, 2),
  negotiated_value DECIMAL(15, 2),
  invoice_value DECIMAL(15, 2),
  actual_value DECIMAL(15, 2),
  invoice_number TEXT,
  date TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  competence TIMESTAMP WITH TIME ZONE,
  payment_date TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  installments INTEGER,
  current_installment INTEGER,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  tags TEXT[],
  service_confirmed BOOLEAN DEFAULT false,
  service_confirmed_by TEXT,
  service_confirmed_at TIMESTAMP WITH TIME ZONE,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_by TEXT,
  verification_notes TEXT,
  approved_by TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  paid_by TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_shared BOOLEAN DEFAULT false,
  allocations JSONB
);

-- =====================================================
-- 10. REVENUES (Receitas)
-- =====================================================
CREATE TABLE revenues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  description TEXT NOT NULL,
  client_id UUID REFERENCES clients(id),
  operation_id UUID REFERENCES operations(id),
  category TEXT,
  value DECIMAL(15, 2),
  invoice_number TEXT,
  date TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  received_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  contract_id UUID,
  notes TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 11. CONTRACTS (Contratos)
-- =====================================================
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT,
  partner_id UUID,
  operation_id UUID REFERENCES operations(id),
  product TEXT,
  quantity DECIMAL(15, 2),
  unit TEXT,
  unit_price DECIMAL(15, 2),
  total_value DECIMAL(15, 2),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  payment_terms TEXT,
  delivery_terms TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 12. STOCK ITEMS (Itens de Estoque)
-- =====================================================
CREATE TABLE stock_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT,
  category TEXT,
  unit TEXT,
  current_stock DECIMAL(15, 2) DEFAULT 0,
  min_stock DECIMAL(15, 2) DEFAULT 0,
  avg_cost DECIMAL(15, 2) DEFAULT 0,
  last_purchase_price DECIMAL(15, 2),
  last_purchase_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 13. STOCK MOVEMENTS (Movimentações de Estoque)
-- =====================================================
CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES stock_items(id) ON DELETE CASCADE,
  type TEXT,
  quantity DECIMAL(15, 2),
  unit_price DECIMAL(15, 2),
  total_value DECIMAL(15, 2),
  operation_id UUID REFERENCES operations(id),
  supplier_id UUID REFERENCES suppliers(id),
  invoice_number TEXT,
  date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 14. PURCHASE ORDERS (Ordens de Compra)
-- =====================================================
CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id),
  operation_id UUID REFERENCES operations(id),
  total_value DECIMAL(15, 2),
  status TEXT DEFAULT 'draft',
  requested_by TEXT,
  approved_by TEXT,
  request_date TIMESTAMP WITH TIME ZONE,
  expected_delivery_date TIMESTAMP WITH TIME ZONE,
  actual_delivery_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 15. PURCHASE ORDER ITEMS
-- =====================================================
CREATE TABLE purchase_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
  item_id UUID REFERENCES stock_items(id),
  quantity DECIMAL(15, 2),
  unit_price DECIMAL(15, 2),
  total_price DECIMAL(15, 2),
  received_quantity DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 16. ASSETS (Patrimônio)
-- =====================================================
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT,
  operation_id UUID REFERENCES operations(id),
  purchase_date TIMESTAMP WITH TIME ZONE,
  purchase_value DECIMAL(15, 2),
  current_value DECIMAL(15, 2),
  depreciation_rate DECIMAL(5, 2),
  brand TEXT,
  model TEXT,
  serial_number TEXT,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 17. BANK ACCOUNTS (Contas Bancárias)
-- =====================================================
CREATE TABLE bank_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  bank TEXT,
  account_number TEXT,
  type TEXT,
  initial_balance DECIMAL(15, 2) DEFAULT 0,
  current_balance DECIMAL(15, 2) DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 18. TEAM MEMBERS (Membros da Equipe)
-- =====================================================
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  cpf TEXT,
  phone TEXT,
  role TEXT,
  permissions JSONB,
  farm_ids UUID[],
  operation_ids UUID[],
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 19. FISCAL ISSUERS (Emitentes Fiscais)
-- =====================================================
CREATE TABLE fiscal_issuers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cpf_cnpj TEXT,
  state_registration TEXT,
  municipal_registration TEXT,
  crt TEXT,
  address TEXT,
  number TEXT,
  complement TEXT,
  district TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  ibge_code TEXT,
  phone TEXT,
  email TEXT,
  certificate_expires_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 20. FISCAL RECIPIENTS (Destinatários Fiscais)
-- =====================================================
CREATE TABLE fiscal_recipients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cpf_cnpj TEXT,
  state_registration TEXT,
  address TEXT,
  number TEXT,
  complement TEXT,
  district TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  ibge_code TEXT,
  phone TEXT,
  email TEXT,
  authorized_third_parties TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 21. FISCAL OPERATION TEMPLATES
-- =====================================================
CREATE TABLE fiscal_operation_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  nature TEXT,
  cfop TEXT,
  type TEXT,
  finalidade TEXT,
  cst_icms_padrao TEXT,
  csosn_padrao TEXT,
  automatic_text TEXT,
  future_exit BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 22. FISCAL PRODUCTS
-- =====================================================
CREATE TABLE fiscal_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  ncm TEXT,
  cest TEXT,
  unit TEXT,
  ean TEXT,
  cfop TEXT,
  cst_icms TEXT,
  csosn TEXT,
  cst_pis TEXT,
  cst_cofins TEXT,
  icms_aliquot DECIMAL(5, 2),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 23. NFe (Notas Fiscais Eletrônicas)
-- =====================================================
CREATE TABLE nfes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number INTEGER,
  series INTEGER,
  issuer_id UUID REFERENCES fiscal_issuers(id),
  recipient_id UUID REFERENCES fiscal_recipients(id),
  operation_template_id UUID REFERENCES fiscal_operation_templates(id),
  nature TEXT,
  cfop TEXT,
  type TEXT,
  issue_date TIMESTAMP WITH TIME ZONE,
  exit_date TIMESTAMP WITH TIME ZONE,
  items JSONB,
  transport JSONB,
  payment JSONB,
  funrural JSONB,
  products_value DECIMAL(15, 2),
  freight_value DECIMAL(15, 2) DEFAULT 0,
  insurance_value DECIMAL(15, 2) DEFAULT 0,
  other_expenses DECIMAL(15, 2) DEFAULT 0,
  discount DECIMAL(15, 2) DEFAULT 0,
  total_value DECIMAL(15, 2),
  icms_base DECIMAL(15, 2) DEFAULT 0,
  icms_value DECIMAL(15, 2) DEFAULT 0,
  additional_info TEXT,
  status TEXT DEFAULT 'draft',
  access_key TEXT,
  protocol TEXT,
  xml_url TEXT,
  danfe_url TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  authorized_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 24. MDFe (Manifesto Eletrônico)
-- =====================================================
CREATE TABLE mdfes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number INTEGER,
  series INTEGER,
  issuer_id UUID REFERENCES fiscal_issuers(id),
  nfe_ids UUID[],
  status TEXT DEFAULT 'draft',
  vehicle_plate TEXT,
  vehicle_state TEXT,
  driver_cpf TEXT,
  driver_name TEXT,
  origin_city TEXT,
  origin_state TEXT,
  destination_city TEXT,
  destination_state TEXT,
  issue_date TIMESTAMP WITH TIME ZONE,
  access_key TEXT,
  protocol TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 25. ATTACHMENTS (Anexos)
-- =====================================================
CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  related_id UUID,
  related_type TEXT,
  type TEXT,
  uri TEXT,
  name TEXT,
  size INTEGER,
  uploaded_by TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 26. DIVERGENCES (Divergências)
-- =====================================================
CREATE TABLE divergences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expense_id UUID REFERENCES expenses(id) ON DELETE CASCADE,
  reason TEXT,
  expected_value DECIMAL(15, 2),
  charged_value DECIMAL(15, 2),
  evidence TEXT,
  responsible TEXT,
  deadline TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 27. MONTH CLOSINGS (Fechamentos Mensais)
-- =====================================================
CREATE TABLE month_closings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month TEXT,
  year INTEGER,
  status TEXT DEFAULT 'open',
  closed_by TEXT,
  closed_at TIMESTAMP WITH TIME ZONE,
  checklist JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 28. FIELDS (Talhões/Campos)
-- =====================================================
CREATE TABLE fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  area DECIMAL(15, 2),
  unit TEXT DEFAULT 'ha',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  soil_type TEXT,
  current_crop TEXT,
  active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 29. SEASONS (Safras/Temporadas)
-- =====================================================
CREATE TABLE seasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  field_id UUID REFERENCES fields(id) ON DELETE CASCADE,
  crop TEXT,
  planting_date TIMESTAMP WITH TIME ZONE,
  expected_harvest_date TIMESTAMP WITH TIME ZONE,
  actual_harvest_date TIMESTAMP WITH TIME ZONE,
  area DECIMAL(15, 2),
  expected_yield DECIMAL(15, 2),
  actual_yield DECIMAL(15, 2),
  yield_unit TEXT,
  budgeted_cost DECIMAL(15, 2) DEFAULT 0,
  actual_cost DECIMAL(15, 2) DEFAULT 0,
  budgeted_revenue DECIMAL(15, 2) DEFAULT 0,
  actual_revenue DECIMAL(15, 2) DEFAULT 0,
  status TEXT DEFAULT 'planning',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 30. SEASON COSTS (Custos por Safra)
-- =====================================================
CREATE TABLE season_costs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID REFERENCES seasons(id) ON DELETE CASCADE,
  category TEXT,
  description TEXT,
  budgeted DECIMAL(15, 2) DEFAULT 0,
  actual DECIMAL(15, 2) DEFAULT 0,
  date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 31. BARTER CONTRACTS (Contratos de Troca)
-- =====================================================
CREATE TABLE barter_contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT,
  supplier_id UUID REFERENCES suppliers(id),
  client_id UUID REFERENCES clients(id),
  operation_id UUID REFERENCES operations(id),
  input_product TEXT,
  input_quantity DECIMAL(15, 2),
  input_unit TEXT,
  input_unit_value DECIMAL(15, 2),
  output_product TEXT,
  output_quantity DECIMAL(15, 2),
  output_unit TEXT,
  output_unit_value DECIMAL(15, 2),
  exchange_rate DECIMAL(15, 6),
  start_date TIMESTAMP WITH TIME ZONE,
  settlement_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  settled_input_quantity DECIMAL(15, 2) DEFAULT 0,
  settled_output_quantity DECIMAL(15, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 32. LEASE CONTRACTS (Contratos de Arrendamento)
-- =====================================================
CREATE TABLE lease_contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lessor_name TEXT,
  lessor_cpf_cnpj TEXT,
  field_id UUID REFERENCES fields(id),
  area DECIMAL(15, 2),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  payment_type TEXT,
  fixed_cash_value DECIMAL(15, 2),
  fixed_product_quantity DECIMAL(15, 2),
  fixed_product_unit TEXT,
  percentage_value DECIMAL(5, 2),
  partnership_share DECIMAL(5, 2),
  payment_frequency TEXT,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 33. LEASE PAYMENTS (Pagamentos de Arrendamento)
-- =====================================================
CREATE TABLE lease_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lease_id UUID REFERENCES lease_contracts(id) ON DELETE CASCADE,
  due_date TIMESTAMP WITH TIME ZONE,
  paid_date TIMESTAMP WITH TIME ZONE,
  value DECIMAL(15, 2),
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 34. FORECASTS (Projeções Financeiras)
-- =====================================================
CREATE TABLE forecasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  type TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  projected_revenue DECIMAL(15, 2) DEFAULT 0,
  projected_expenses DECIMAL(15, 2) DEFAULT 0,
  projected_cash_flow JSONB,
  assumptions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 35. FINANCIAL STATEMENTS (Demonstrativos Financeiros)
-- =====================================================
CREATE TABLE financial_statements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  operation_id UUID REFERENCES operations(id),
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 36. ASSET DEPRECIATIONS (Depreciação de Ativos)
-- =====================================================
CREATE TABLE asset_depreciations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  method TEXT,
  useful_life INTEGER,
  residual_value DECIMAL(15, 2) DEFAULT 0,
  depreciation_rate DECIMAL(5, 2),
  monthly_depreciation DECIMAL(15, 2),
  accumulated_depreciation DECIMAL(15, 2) DEFAULT 0,
  current_book_value DECIMAL(15, 2),
  last_calculation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 37. USER SUBSCRIPTIONS (Assinaturas)
-- =====================================================
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT,
  gestao_rural_plan TEXT DEFAULT 'free',
  custo_operacional_plan TEXT DEFAULT 'free',
  custo_op_bonus BOOLEAN DEFAULT false,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 38. EXCEL IMPORTS (Importações de Excel)
-- =====================================================
CREATE TABLE excel_imports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  file_type TEXT,
  status TEXT DEFAULT 'pending',
  total_rows INTEGER DEFAULT 0,
  imported_rows INTEGER DEFAULT 0,
  failed_rows INTEGER DEFAULT 0,
  target_table TEXT,
  mapping JSONB,
  errors JSONB,
  ai_suggestions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 39. IMPORT PREVIEW (Preview de Importação)
-- =====================================================
CREATE TABLE import_previews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  import_id UUID REFERENCES excel_imports(id) ON DELETE CASCADE,
  row_number INTEGER,
  original_data JSONB,
  mapped_data JSONB,
  validation_errors TEXT[],
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY E POLÍTICAS PÚBLICAS
-- =====================================================
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE fiscal_issuers ENABLE ROW LEVEL SECURITY;
ALTER TABLE fiscal_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE fiscal_operation_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE fiscal_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mdfes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE divergences ENABLE ROW LEVEL SECURITY;
ALTER TABLE month_closings ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE season_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE barter_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lease_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lease_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_depreciations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE excel_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_previews ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público (permite tudo sem login)
CREATE POLICY "public_farms" ON farms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_sectors" ON sectors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_operations" ON operations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_suppliers" ON suppliers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_clients" ON clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_cost_centers" ON cost_centers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_expenses" ON expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_revenues" ON revenues FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_contracts" ON contracts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_stock_items" ON stock_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_stock_movements" ON stock_movements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_purchase_orders" ON purchase_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_purchase_order_items" ON purchase_order_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_assets" ON assets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_bank_accounts" ON bank_accounts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_team_members" ON team_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_fiscal_issuers" ON fiscal_issuers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_fiscal_recipients" ON fiscal_recipients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_fiscal_operation_templates" ON fiscal_operation_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_fiscal_products" ON fiscal_products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_nfes" ON nfes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_mdfes" ON mdfes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_attachments" ON attachments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_divergences" ON divergences FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_month_closings" ON month_closings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_fields" ON fields FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_seasons" ON seasons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_season_costs" ON season_costs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_barter_contracts" ON barter_contracts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_lease_contracts" ON lease_contracts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_lease_payments" ON lease_payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_forecasts" ON forecasts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_financial_statements" ON financial_statements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_asset_depreciations" ON asset_depreciations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_user_subscriptions" ON user_subscriptions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_excel_imports" ON excel_imports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_import_previews" ON import_previews FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- INDEXES PARA PERFORMANCE
-- =====================================================
CREATE INDEX idx_sectors_farm_id ON sectors(farm_id);
CREATE INDEX idx_operations_farm_id ON operations(farm_id);
CREATE INDEX idx_operations_sector_id ON operations(sector_id);
CREATE INDEX idx_expenses_operation_id ON expenses(operation_id);
CREATE INDEX idx_expenses_supplier_id ON expenses(supplier_id);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_due_date ON expenses(due_date);
CREATE INDEX idx_revenues_client_id ON revenues(client_id);
CREATE INDEX idx_revenues_operation_id ON revenues(operation_id);
CREATE INDEX idx_revenues_status ON revenues(status);
CREATE INDEX idx_stock_movements_item_id ON stock_movements(item_id);
CREATE INDEX idx_nfes_issuer_id ON nfes(issuer_id);
CREATE INDEX idx_nfes_status ON nfes(status);
CREATE INDEX idx_attachments_related ON attachments(related_id, related_type);
CREATE INDEX idx_fields_farm_id ON fields(farm_id);
CREATE INDEX idx_seasons_field_id ON seasons(field_id);
CREATE INDEX idx_seasons_status ON seasons(status);
CREATE INDEX idx_season_costs_season_id ON season_costs(season_id);
CREATE INDEX idx_barter_contracts_status ON barter_contracts(status);
CREATE INDEX idx_lease_contracts_field_id ON lease_contracts(field_id);
CREATE INDEX idx_lease_contracts_status ON lease_contracts(status);
CREATE INDEX idx_lease_payments_lease_id ON lease_payments(lease_id);
CREATE INDEX idx_user_subscriptions_email ON user_subscriptions(email);

-- =====================================================
-- FUNÇÃO PARA UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_farms_updated_at BEFORE UPDATE ON farms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sectors_updated_at BEFORE UPDATE ON sectors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_operations_updated_at BEFORE UPDATE ON operations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_revenues_updated_at BEFORE UPDATE ON revenues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stock_items_updated_at BEFORE UPDATE ON stock_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bank_accounts_updated_at BEFORE UPDATE ON bank_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fiscal_issuers_updated_at BEFORE UPDATE ON fiscal_issuers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fiscal_recipients_updated_at BEFORE UPDATE ON fiscal_recipients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fiscal_products_updated_at BEFORE UPDATE ON fiscal_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nfes_updated_at BEFORE UPDATE ON nfes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mdfes_updated_at BEFORE UPDATE ON mdfes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_month_closings_updated_at BEFORE UPDATE ON month_closings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fields_updated_at BEFORE UPDATE ON fields FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seasons_updated_at BEFORE UPDATE ON seasons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_barter_contracts_updated_at BEFORE UPDATE ON barter_contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lease_contracts_updated_at BEFORE UPDATE ON lease_contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forecasts_updated_at BEFORE UPDATE ON forecasts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_asset_depreciations_updated_at BEFORE UPDATE ON asset_depreciations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNÇÃO BÔNUS DE ASSINATURA
-- =====================================================
CREATE OR REPLACE FUNCTION check_subscription_bonus()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.gestao_rural_plan IN ('intermediate', 'premium') THEN
        NEW.custo_op_bonus = true;
        NEW.custo_operacional_plan = 'premium';
    ELSE
        NEW.custo_op_bonus = false;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER check_subscription_bonus_trigger 
  BEFORE INSERT OR UPDATE ON user_subscriptions 
  FOR EACH ROW EXECUTE FUNCTION check_subscription_bonus();

-- =====================================================
-- SCHEMA CRIADO COM SUCESSO!
-- 39 tabelas sem referência a auth.users
-- =====================================================
