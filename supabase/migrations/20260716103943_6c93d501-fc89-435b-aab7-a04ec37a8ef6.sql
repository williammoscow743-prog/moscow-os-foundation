
CREATE TABLE public.milestones (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending',
  progress integer NOT NULL DEFAULT 0,
  due_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX milestones_project_id_idx ON public.milestones(project_id);
CREATE INDEX milestones_user_id_idx ON public.milestones(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.milestones TO authenticated;
GRANT ALL ON public.milestones TO service_role;

ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own milestones all" ON public.milestones
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_milestones_updated_at
  BEFORE UPDATE ON public.milestones
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
