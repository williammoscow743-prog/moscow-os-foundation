ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);