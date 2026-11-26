-- ===========================================================================
-- Academic Interview Pro - Supabase PostgreSQL Row Level Security (RLS) Policies
-- Enforces data isolation, Pakistani aspirant ownership, and administrator oversight
-- ===========================================================================

-- 1. Helper function: check if authenticated user has 'admin' role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()::text
      AND r.name = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Automatically sync auth.users with public.profiles on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    target_commission,
    highest_degree,
    readiness_score,
    streak_days,
    created_at,
    updated_at
  ) VALUES (
    NEW.id::text,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'CS Aspirant'),
    COALESCE(NEW.raw_user_meta_data->>'target_commission', 'PPSC'),
    COALESCE(NEW.raw_user_meta_data->>'highest_degree', 'BS Computer Science'),
    0,
    1,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  -- Default role: 'candidate'
  INSERT INTO public.user_roles (id, user_id, role_id, created_at)
  SELECT 
    gen_random_uuid()::text,
    NEW.id::text,
    r.id,
    NOW()
  FROM public.roles r
  WHERE r.name = 'candidate'
  ON CONFLICT (user_id, role_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===========================================================================
-- 3. ENABLE RLS ON ALL TABLES
-- ===========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ===========================================================================
-- 4. POLICIES: PROFILES
-- ===========================================================================
DROP POLICY IF EXISTS "Users can view own profile or admins view all" ON public.profiles;
CREATE POLICY "Users can view own profile or admins view all"
  ON public.profiles FOR SELECT
  USING (auth.uid()::text = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid()::text = id)
  WITH CHECK (auth.uid()::text = id);

-- ===========================================================================
-- 5. POLICIES: ROLES & USER ROLES
-- ===========================================================================
DROP POLICY IF EXISTS "Users can view own assigned roles" ON public.user_roles;
CREATE POLICY "Users can view own assigned roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid()::text = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
CREATE POLICY "Admins can manage user roles"
  ON public.user_roles FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS "Roles are readable by authenticated users" ON public.roles;
CREATE POLICY "Roles are readable by authenticated users"
  ON public.roles FOR SELECT
  TO authenticated
  USING (true);

-- ===========================================================================
-- 6. POLICIES: PUBLIC / CURRICULUM CATALOG (Subjects, Topics, Materials, Plans)
-- ===========================================================================
DROP POLICY IF EXISTS "Public can read subjects" ON public.subjects;
CREATE POLICY "Public can read subjects"
  ON public.subjects FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can read topics" ON public.topics;
CREATE POLICY "Public can read topics"
  ON public.topics FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can read active curriculum" ON public.curriculum_versions;
CREATE POLICY "Public can read active curriculum"
  ON public.curriculum_versions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can read curriculum mappings" ON public.curriculum_mappings;
CREATE POLICY "Public can read curriculum mappings"
  ON public.curriculum_mappings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can read active plans" ON public.plans;
CREATE POLICY "Public can read active plans"
  ON public.plans FOR SELECT
  USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can read study materials" ON public.study_materials;
CREATE POLICY "Authenticated users can read study materials"
  ON public.study_materials FOR SELECT
  TO authenticated
  USING (true);

-- ===========================================================================
-- 7. POLICIES: QUESTIONS & ANSWERS
-- ===========================================================================
DROP POLICY IF EXISTS "Authenticated users can view active questions" ON public.questions;
CREATE POLICY "Authenticated users can view active questions"
  ON public.questions FOR SELECT
  TO authenticated
  USING (status = 'ACTIVE' OR public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can view question options" ON public.question_options;
CREATE POLICY "Authenticated users can view question options"
  ON public.question_options FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can view explanations" ON public.question_answers;
CREATE POLICY "Authenticated users can view explanations"
  ON public.question_answers FOR SELECT
  TO authenticated
  USING (true);

-- ===========================================================================
-- 8. POLICIES: TEST ATTEMPTS & RESPONSES (Negative Marking Tests)
-- ===========================================================================
DROP POLICY IF EXISTS "Users can view own test attempts" ON public.test_attempts;
CREATE POLICY "Users can view own test attempts"
  ON public.test_attempts FOR SELECT
  USING (auth.uid()::text = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own test attempts" ON public.test_attempts;
CREATE POLICY "Users can insert own test attempts"
  ON public.test_attempts FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can update own active test attempts" ON public.test_attempts;
CREATE POLICY "Users can update own active test attempts"
  ON public.test_attempts FOR UPDATE
  USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can manage own test responses" ON public.test_responses;
CREATE POLICY "Users can manage own test responses"
  ON public.test_responses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.test_attempts ta
      WHERE ta.id = test_responses.attempt_id
        AND (ta.user_id = auth.uid()::text OR public.is_admin())
    )
  );

-- ===========================================================================
-- 9. POLICIES: SELECTION BOARD VIVAS & ENGLISH VOICE SESSIONS
-- ===========================================================================
DROP POLICY IF EXISTS "Users manage own interview sessions" ON public.interview_sessions;
CREATE POLICY "Users manage own interview sessions"
  ON public.interview_sessions FOR ALL
  USING (auth.uid()::text = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users manage own voice sessions" ON public.voice_sessions;
CREATE POLICY "Users manage own voice sessions"
  ON public.voice_sessions FOR ALL
  USING (auth.uid()::text = user_id OR public.is_admin());

-- ===========================================================================
-- 10. POLICIES: BOOKMARKS & NOTIFICATIONS
-- ===========================================================================
DROP POLICY IF EXISTS "Users manage own bookmarks" ON public.bookmarks;
CREATE POLICY "Users manage own bookmarks"
  ON public.bookmarks FOR ALL
  USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users manage own notifications" ON public.notifications;
CREATE POLICY "Users manage own notifications"
  ON public.notifications FOR ALL
  USING (auth.uid()::text = user_id);

-- ===========================================================================
-- 11. POLICIES: SUBSCRIPTIONS & AUDIT LOGS
-- ===========================================================================
DROP POLICY IF EXISTS "Users view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid()::text = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Admins view audit logs" ON public.audit_logs;
CREATE POLICY "Admins view audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin());
