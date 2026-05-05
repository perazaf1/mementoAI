-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'isep')),
  sessions_today INTEGER NOT NULL DEFAULT 0,
  last_reset_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.recitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('course', 'code')),
  course_text TEXT,
  transcript TEXT NOT NULL,
  feedback TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "recitations_select_own" ON public.recitations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "recitations_insert_own" ON public.recitations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- TRIGGER : create user profile on signup
-- Détecte automatiquement les emails ISEP (@eleve.isep.fr)
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_plan TEXT := 'free';
BEGIN
  IF NEW.email ILIKE '%@eleve.isep.fr' THEN
    user_plan := 'isep';
  END IF;

  INSERT INTO public.users (id, email, plan)
  VALUES (NEW.id, NEW.email, user_plan);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- HELPER : upgrade un user en pro (à exécuter manuellement)
-- Usage : SELECT upgrade_to_pro('email@exemple.com');
-- ============================================================

CREATE OR REPLACE FUNCTION public.upgrade_to_pro(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users SET plan = 'pro' WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
