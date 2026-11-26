-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "cnic" TEXT,
    "city" TEXT,
    "domicile_province" TEXT NOT NULL DEFAULT 'Punjab',
    "highest_degree" TEXT NOT NULL DEFAULT 'BS Computer Science',
    "university" TEXT,
    "cgpa" DECIMAL(3,2),
    "graduation_year" INTEGER,
    "thesis_topic" TEXT,
    "target_commission" TEXT NOT NULL DEFAULT 'PPSC',
    "experience_years" TEXT,
    "bio" TEXT,
    "avatar_url" TEXT,
    "cv_url" TEXT,
    "readiness_score" INTEGER NOT NULL DEFAULT 0,
    "streak_days" INTEGER NOT NULL DEFAULT 1,
    "last_active_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "weightage" TEXT NOT NULL DEFAULT '10-15%',
    "frequency" TEXT NOT NULL DEFAULT 'HIGH',
    "icon_name" TEXT NOT NULL DEFAULT 'BookOpen',
    "recommended_books" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "difficulty" TEXT NOT NULL DEFAULT 'MEDIUM',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curriculum_versions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "commission" TEXT NOT NULL,
    "year" INTEGER NOT NULL DEFAULT 2026,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "curriculum_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curriculum_mappings" (
    "id" TEXT NOT NULL,
    "curriculum_version_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "topic_id" TEXT,
    "weightage_percentage" DECIMAL(5,2) NOT NULL,
    "marks_allotted" INTEGER NOT NULL DEFAULT 10,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "curriculum_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "topic_id" TEXT,
    "statement" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'MCQ',
    "difficulty" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_options" (
    "id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "option_key" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_answers" (
    "id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "detailed_explanation" TEXT NOT NULL,
    "key_points" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "reference_citation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_sources" (
    "id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "source_name" TEXT NOT NULL,
    "exam_year" INTEGER,
    "post_title" TEXT,
    "book_title" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_reviews" (
    "id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'APPROVED',
    "comments" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_materials" (
    "id" TEXT NOT NULL,
    "subject_id" TEXT,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "commission" TEXT NOT NULL DEFAULT 'ALL',
    "year" TEXT,
    "file_url" TEXT NOT NULL,
    "file_size" TEXT NOT NULL DEFAULT '2.5 MB',
    "format" TEXT NOT NULL DEFAULT 'PDF',
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "question_id" TEXT,
    "study_material_id" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_templates" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "commission" TEXT NOT NULL DEFAULT 'PPSC',
    "duration_minutes" INTEGER NOT NULL DEFAULT 90,
    "total_marks" INTEGER NOT NULL DEFAULT 100,
    "negative_marking_rate" DECIMAL(3,2) NOT NULL DEFAULT 0.25,
    "subject_ratio_json" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_attempts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "raw_score" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "negative_deductions" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "final_score" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "percentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_responses" (
    "id" TEXT NOT NULL,
    "attempt_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "selected_option_id" TEXT,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "time_spent_seconds" INTEGER NOT NULL DEFAULT 0,
    "is_flagged" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_results" (
    "id" TEXT NOT NULL,
    "attempt_id" TEXT NOT NULL,
    "total_questions" INTEGER NOT NULL DEFAULT 100,
    "answered_count" INTEGER NOT NULL DEFAULT 0,
    "correct_count" INTEGER NOT NULL DEFAULT 0,
    "incorrect_count" INTEGER NOT NULL DEFAULT 0,
    "unattempted_count" INTEGER NOT NULL DEFAULT 0,
    "accuracy_percentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "percentile_rank" DECIMAL(5,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "subject_id" TEXT,
    "mode" TEXT NOT NULL DEFAULT 'FULL_BOARD',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "duration_seconds" INTEGER NOT NULL DEFAULT 0,
    "overall_score" INTEGER,
    "verdict" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_questions" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "panelist_name" TEXT NOT NULL,
    "panelist_role" TEXT NOT NULL,
    "question_text" TEXT NOT NULL,
    "expected_keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_responses" (
    "id" TEXT NOT NULL,
    "interview_question_id" TEXT NOT NULL,
    "transcript_text" TEXT NOT NULL,
    "audio_url" TEXT,
    "duration_seconds" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_evaluations" (
    "id" TEXT NOT NULL,
    "interview_response_id" TEXT NOT NULL,
    "technical_accuracy" INTEGER NOT NULL,
    "conceptual_depth" INTEGER NOT NULL,
    "pedagogical_clarity" INTEGER NOT NULL,
    "fluency_score" INTEGER NOT NULL,
    "verdict" TEXT NOT NULL DEFAULT 'RECOMMENDED',
    "critique" TEXT NOT NULL,
    "follow_up_question" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "topic_title" TEXT NOT NULL,
    "target_cadence_min" INTEGER NOT NULL DEFAULT 120,
    "target_cadence_max" INTEGER NOT NULL DEFAULT 140,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "voice_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_messages" (
    "id" TEXT NOT NULL,
    "voice_session_id" TEXT NOT NULL,
    "audio_url" TEXT,
    "transcript_text" TEXT NOT NULL,
    "wpm" INTEGER NOT NULL DEFAULT 130,
    "duration_seconds" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "voice_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_evaluations" (
    "id" TEXT NOT NULL,
    "voice_message_id" TEXT NOT NULL,
    "words_per_minute" INTEGER NOT NULL,
    "filler_word_count" INTEGER NOT NULL DEFAULT 0,
    "filler_words_json" JSONB,
    "pronunciation_score" INTEGER NOT NULL DEFAULT 90,
    "academic_tone_score" INTEGER NOT NULL DEFAULT 90,
    "feedback_text" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "voice_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price_pkr" INTEGER NOT NULL DEFAULT 0,
    "billing_interval" TEXT NOT NULL DEFAULT 'MONTHLY',
    "features_json" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "payment_method" TEXT,
    "transaction_ref" TEXT,
    "amount_paid_pkr" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_records" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "metric_key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usage_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'SYSTEM',
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actor_id" TEXT,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "ip_address" TEXT,
    "metadata_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE INDEX "profiles_email_idx" ON "profiles"("email");

-- CreateIndex
CREATE INDEX "profiles_target_commission_idx" ON "profiles"("target_commission");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_id_key" ON "user_roles"("user_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_slug_key" ON "subjects"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_code_key" ON "subjects"("code");

-- CreateIndex
CREATE UNIQUE INDEX "topics_subject_id_slug_key" ON "topics"("subject_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "curriculum_versions_code_key" ON "curriculum_versions"("code");

-- CreateIndex
CREATE INDEX "questions_subject_id_idx" ON "questions"("subject_id");

-- CreateIndex
CREATE INDEX "questions_topic_id_idx" ON "questions"("topic_id");

-- CreateIndex
CREATE UNIQUE INDEX "question_options_question_id_option_key_key" ON "question_options"("question_id", "option_key");

-- CreateIndex
CREATE UNIQUE INDEX "question_answers_question_id_key" ON "question_answers"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_user_id_question_id_key" ON "bookmarks"("user_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_user_id_study_material_id_key" ON "bookmarks"("user_id", "study_material_id");

-- CreateIndex
CREATE UNIQUE INDEX "test_templates_slug_key" ON "test_templates"("slug");

-- CreateIndex
CREATE INDEX "test_attempts_user_id_idx" ON "test_attempts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "test_responses_attempt_id_question_id_key" ON "test_responses"("attempt_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "test_results_attempt_id_key" ON "test_results"("attempt_id");

-- CreateIndex
CREATE UNIQUE INDEX "interview_evaluations_interview_response_id_key" ON "interview_evaluations"("interview_response_id");

-- CreateIndex
CREATE UNIQUE INDEX "voice_evaluations_voice_message_id_key" ON "voice_evaluations"("voice_message_id");

-- CreateIndex
CREATE UNIQUE INDEX "plans_code_key" ON "plans"("code");

-- CreateIndex
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "usage_records_user_id_metric_key_date_key" ON "usage_records"("user_id", "metric_key", "date");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_actor_id_idx" ON "audit_logs"("actor_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_mappings" ADD CONSTRAINT "curriculum_mappings_curriculum_version_id_fkey" FOREIGN KEY ("curriculum_version_id") REFERENCES "curriculum_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_mappings" ADD CONSTRAINT "curriculum_mappings_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_mappings" ADD CONSTRAINT "curriculum_mappings_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_options" ADD CONSTRAINT "question_options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_answers" ADD CONSTRAINT "question_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_sources" ADD CONSTRAINT "question_sources_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_reviews" ADD CONSTRAINT "question_reviews_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_reviews" ADD CONSTRAINT "question_reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_materials" ADD CONSTRAINT "study_materials_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_study_material_id_fkey" FOREIGN KEY ("study_material_id") REFERENCES "study_materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_attempts" ADD CONSTRAINT "test_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_attempts" ADD CONSTRAINT "test_attempts_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "test_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_responses" ADD CONSTRAINT "test_responses_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "test_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_responses" ADD CONSTRAINT "test_responses_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_responses" ADD CONSTRAINT "test_responses_selected_option_id_fkey" FOREIGN KEY ("selected_option_id") REFERENCES "question_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_results" ADD CONSTRAINT "test_results_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "test_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_sessions" ADD CONSTRAINT "interview_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_sessions" ADD CONSTRAINT "interview_sessions_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_questions" ADD CONSTRAINT "interview_questions_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "interview_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_responses" ADD CONSTRAINT "interview_responses_interview_question_id_fkey" FOREIGN KEY ("interview_question_id") REFERENCES "interview_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_evaluations" ADD CONSTRAINT "interview_evaluations_interview_response_id_fkey" FOREIGN KEY ("interview_response_id") REFERENCES "interview_responses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_sessions" ADD CONSTRAINT "voice_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_messages" ADD CONSTRAINT "voice_messages_voice_session_id_fkey" FOREIGN KEY ("voice_session_id") REFERENCES "voice_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voice_evaluations" ADD CONSTRAINT "voice_evaluations_voice_message_id_fkey" FOREIGN KEY ("voice_message_id") REFERENCES "voice_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_records" ADD CONSTRAINT "usage_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

