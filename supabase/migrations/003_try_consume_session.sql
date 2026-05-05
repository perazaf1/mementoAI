-- ============================================================
-- Atomic session consumption — prevents race conditions
-- ============================================================
-- Returns: 'ok' | 'limit_reached' | 'user_not_found'
-- Also resets sessions_today if last_reset_date < today.
-- ============================================================

CREATE OR REPLACE FUNCTION try_consume_session(p_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan          TEXT;
  v_sessions      INT;
  v_last_reset    DATE;
  v_today         DATE := CURRENT_DATE;
  v_limit         INT;
BEGIN
  -- Lock the row to prevent concurrent calls
  SELECT plan, sessions_today, last_reset_date
    INTO v_plan, v_sessions, v_last_reset
    FROM public.users
   WHERE id = p_user_id
     FOR UPDATE;

  IF NOT FOUND THEN
    RETURN 'user_not_found';
  END IF;

  -- Reset counter if it's a new day
  IF v_last_reset IS DISTINCT FROM v_today THEN
    v_sessions := 0;
    UPDATE public.users
       SET sessions_today = 0, last_reset_date = v_today
     WHERE id = p_user_id;
  END IF;

  -- Compute limit based on plan
  v_limit := CASE v_plan
    WHEN 'pro'  THEN 20
    WHEN 'isep' THEN 10
    ELSE 3
  END;

  IF v_sessions >= v_limit THEN
    RETURN 'limit_reached';
  END IF;

  -- Consume one session
  UPDATE public.users
     SET sessions_today = v_sessions + 1
   WHERE id = p_user_id;

  RETURN 'ok';
END;
$$;
