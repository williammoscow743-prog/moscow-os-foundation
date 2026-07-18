
-- TASKS
CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  milestone_id uuid REFERENCES public.milestones(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo',
  priority text NOT NULL DEFAULT 'medium',
  estimated_hours numeric,
  actual_hours numeric,
  progress integer NOT NULL DEFAULT 0,
  start_date date,
  due_date date,
  completed_at timestamptz,
  assigned_to uuid,
  labels text[] NOT NULL DEFAULT '{}',
  archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own tasks all" ON public.tasks FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX tasks_user_idx ON public.tasks(user_id);
CREATE INDEX tasks_project_idx ON public.tasks(project_id);
CREATE INDEX tasks_milestone_idx ON public.tasks(milestone_id);
CREATE INDEX tasks_due_idx ON public.tasks(due_date);
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SUBTASKS (nestable)
CREATE TABLE public.subtasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.subtasks(id) ON DELETE CASCADE,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'todo',
  priority text NOT NULL DEFAULT 'medium',
  due_date date,
  completed boolean NOT NULL DEFAULT false,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subtasks TO authenticated;
GRANT ALL ON public.subtasks TO service_role;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own subtasks all" ON public.subtasks FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX subtasks_task_idx ON public.subtasks(task_id);
CREATE INDEX subtasks_parent_idx ON public.subtasks(parent_id);
CREATE TRIGGER update_subtasks_updated_at BEFORE UPDATE ON public.subtasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- COMMENTS
CREATE TABLE public.task_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.task_comments(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.task_comments TO authenticated;
GRANT ALL ON public.task_comments TO service_role;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own task_comments all" ON public.task_comments FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX task_comments_task_idx ON public.task_comments(task_id);
CREATE TRIGGER update_task_comments_updated_at BEFORE UPDATE ON public.task_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ACTIVITY LOG
CREATE TABLE public.task_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  action text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.task_activity TO authenticated;
GRANT ALL ON public.task_activity TO service_role;
ALTER TABLE public.task_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own task_activity all" ON public.task_activity FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX task_activity_task_idx ON public.task_activity(task_id);
