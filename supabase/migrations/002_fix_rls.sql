-- ============================================================
-- Fix RLS : empêche les users de modifier leur propre plan
-- ============================================================

-- Supprimer l'ancienne policy trop permissive
DROP POLICY IF EXISTS "users_update_own" ON public.users;

-- Nouvelle policy : le user peut uniquement mettre à jour
-- sessions_today et last_reset_date — jamais son plan
CREATE POLICY "users_update_sessions_only" ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND plan = (SELECT plan FROM public.users WHERE id = auth.uid())
  );
