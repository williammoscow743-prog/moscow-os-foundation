CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  company_name text,
  client_type text NOT NULL DEFAULT 'individual' CHECK (client_type IN ('individual','business')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','archived')),
  email text,
  phone text,
  alternative_phone text,
  website text,
  address text,
  city text,
  province text,
  postal_code text,
  country text DEFAULT 'South Africa',
  notes text,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own clients select" ON public.clients FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own clients insert" ON public.clients FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own clients update" ON public.clients FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own clients delete" ON public.clients FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_clients_user_status ON public.clients (user_id, status);
CREATE INDEX idx_clients_user_type ON public.clients (user_id, client_type);
CREATE INDEX idx_clients_search ON public.clients (user_id, last_name, first_name);
CREATE INDEX idx_clients_company ON public.clients (user_id, company_name);
CREATE INDEX idx_clients_email ON public.clients (user_id, email);

CREATE TRIGGER trg_clients_updated
BEFORE UPDATE ON public.clients
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();