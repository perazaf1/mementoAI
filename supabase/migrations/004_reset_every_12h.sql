-- ============================================================
-- Change session reset from once-per-day to every 12 hours
-- ============================================================
-- 1. Convert last_reset_date from DATE to TIMESTAMPTZ
-- 2. Update try_consume_session to reset if 12h have passed
-- ============================================================

-- Step 1: Alter column type (DATE → TIMESTAMPTZ)
ALTER TABLE public.users
  ALTER COLUMN last_reset_date TYPE TIMESTAMPTZ
  USING last_reset_date::TIMESTAMPTZ;

-- Update default to NOW() instead of CURRENT_DATE
ALTER TABLE public.users
  ALTER COLUMN last_reset_date SET DEFAULT NOW();

-- Step 2: Replace the function with 12h logic
CREATE OR REPLACE FUNCTION try_consume_session(p_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan          TEXT;
  v_sessions      INT;
  v_last_reset    TIMESTAMPTZ;
  v_now           TIMESTAMPTZ := NOW();
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

  -- Reset counter if 12 hours have passed since last reset
  IF v_last_reset IS NULL OR (v_now - v_last_reset) >= INTERVAL '12 hours' THEN
    v_sessions := 0;
    UPDATE public.users
       SET sessions_today = 0, last_reset_date = v_now
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
