-- BTG College Initial Schema Migration
-- This creates all tables required for the BTG College application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Programs table
CREATE TABLE IF NOT EXISTS programs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    weeks_total INTEGER NOT NULL DEFAULT 10,
    target_audience TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert College program
INSERT INTO programs (id, title, description, weeks_total, target_audience)
VALUES ('COLLEGE', 'BTG College Program', 'A comprehensive 10-week financial literacy course designed for college students.', 10, 'College Students')
ON CONFLICT (id) DO NOTHING;

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak_days INTEGER DEFAULT 0,
    last_active TIMESTAMPTZ DEFAULT NOW(),
    show_level_on_profile BOOLEAN DEFAULT true,
    notification_push BOOLEAN DEFAULT true,
    notification_course_reminders BOOLEAN DEFAULT true,
    notification_streak_reminders BOOLEAN DEFAULT true,
    notification_achievement_alerts BOOLEAN DEFAULT true,
    notification_product_updates BOOLEAN DEFAULT false,
    notification_quiet_start TIME,
    notification_quiet_end TIME,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table (for additional profile data like XP)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    program_id TEXT NOT NULL REFERENCES programs(id),
    track_level TEXT DEFAULT 'beginner',
    language TEXT DEFAULT 'en',
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, program_id)
);

-- Course progress table
CREATE TABLE IF NOT EXISTS course_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    completed BOOLEAN DEFAULT false,
    lesson_completed BOOLEAN DEFAULT false,
    quiz_completed BOOLEAN DEFAULT false,
    quiz_attempts INTEGER DEFAULT 0,
    best_quiz_score INTEGER,
    score INTEGER,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, week_number)
);

-- Lesson progress table
CREATE TABLE IF NOT EXISTS lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    section_index INTEGER NOT NULL,
    completed BOOLEAN DEFAULT false,
    time_spent_seconds INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, enrollment_id, week_number, section_index)
);

-- Quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    passed BOOLEAN NOT NULL,
    time_taken_seconds INTEGER,
    answers JSONB,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz progress (for saving partial progress)
CREATE TABLE IF NOT EXISTS quiz_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    current_question_index INTEGER DEFAULT 0,
    answers JSONB DEFAULT '{}',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    time_spent_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, week_number)
);

-- Game scores table
CREATE TABLE IF NOT EXISTS game_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
    game_type TEXT NOT NULL,
    score INTEGER NOT NULL,
    completed BOOLEAN DEFAULT false,
    session_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game progress table
CREATE TABLE IF NOT EXISTS game_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    game_id TEXT NOT NULL,
    game_data JSONB,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    last_played_at TIMESTAMPTZ DEFAULT NOW(),
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, game_id)
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL,
    progress_data JSONB,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_type)
);

-- Weekly goals table
CREATE TABLE IF NOT EXISTS weekly_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    goal_type TEXT NOT NULL,
    target_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    week_start_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bitcoin simulator table
CREATE TABLE IF NOT EXISTS bitcoin_simulator (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    balance DECIMAL(15, 2) DEFAULT 10000.00,
    btc_holdings DECIMAL(10, 8) DEFAULT 0,
    starting_balance DECIMAL(15, 2) DEFAULT 10000.00,
    total_profit DECIMAL(15, 2) DEFAULT 0,
    total_loss DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Bitcoin trades table
CREATE TABLE IF NOT EXISTS bitcoin_trades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    simulator_id UUID REFERENCES bitcoin_simulator(id) ON DELETE CASCADE,
    trade_type TEXT NOT NULL CHECK (trade_type IN ('buy', 'sell')),
    btc_amount DECIMAL(10, 8) NOT NULL,
    price_per_btc DECIMAL(15, 2) NOT NULL,
    total_usd DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity grades table (for teacher grading)
CREATE TABLE IF NOT EXISTS activity_grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    activity_type TEXT NOT NULL,
    response_text TEXT,
    grade INTEGER,
    feedback TEXT,
    graded_by UUID REFERENCES auth.users(id),
    graded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    school_name TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE bitcoin_simulator ENABLE ROW LEVEL SECURITY;
ALTER TABLE bitcoin_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for profiles
CREATE POLICY "Profiles viewable by owner" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Profiles updatable by owner" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Profiles insertable by owner" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for enrollments
CREATE POLICY "Enrollments viewable by owner" ON enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enrollments insertable by owner" ON enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enrollments updatable by owner" ON enrollments FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for course_progress
CREATE POLICY "Course progress viewable by owner" ON course_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Course progress insertable by owner" ON course_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Course progress updatable by owner" ON course_progress FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for lesson_progress
CREATE POLICY "Lesson progress viewable by owner" ON lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Lesson progress insertable by owner" ON lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Lesson progress updatable by owner" ON lesson_progress FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for quiz_attempts
CREATE POLICY "Quiz attempts viewable by owner" ON quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Quiz attempts insertable by owner" ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for quiz_progress
CREATE POLICY "Quiz progress viewable by owner" ON quiz_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Quiz progress insertable by owner" ON quiz_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Quiz progress updatable by owner" ON quiz_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Quiz progress deletable by owner" ON quiz_progress FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for game_scores
CREATE POLICY "Game scores viewable by owner" ON game_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Game scores insertable by owner" ON game_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Game scores updatable by owner" ON game_scores FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for game_progress
CREATE POLICY "Game progress viewable by owner" ON game_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Game progress insertable by owner" ON game_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Game progress updatable by owner" ON game_progress FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for achievements
CREATE POLICY "Achievements viewable by owner" ON achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Achievements insertable by owner" ON achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for weekly_goals
CREATE POLICY "Weekly goals viewable by owner" ON weekly_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Weekly goals insertable by owner" ON weekly_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Weekly goals updatable by owner" ON weekly_goals FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for bitcoin_simulator
CREATE POLICY "Bitcoin simulator viewable by owner" ON bitcoin_simulator FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Bitcoin simulator insertable by owner" ON bitcoin_simulator FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Bitcoin simulator updatable by owner" ON bitcoin_simulator FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for bitcoin_trades
CREATE POLICY "Bitcoin trades viewable by owner" ON bitcoin_trades FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Bitcoin trades insertable by owner" ON bitcoin_trades FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for activity_grades
CREATE POLICY "Activity grades viewable by owner" ON activity_grades FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Activity grades insertable by owner" ON activity_grades FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Activity grades updatable by owner" ON activity_grades FOR UPDATE USING (auth.uid() = user_id);

-- Programs are publicly readable
CREATE POLICY "Programs are publicly readable" ON programs FOR SELECT TO PUBLIC USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_user_id ON course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_game_scores_user_id ON game_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_progress_updated_at BEFORE UPDATE ON course_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lesson_progress_updated_at BEFORE UPDATE ON lesson_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quiz_progress_updated_at BEFORE UPDATE ON quiz_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_game_scores_updated_at BEFORE UPDATE ON game_scores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_game_progress_updated_at BEFORE UPDATE ON game_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_weekly_goals_updated_at BEFORE UPDATE ON weekly_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bitcoin_simulator_updated_at BEFORE UPDATE ON bitcoin_simulator FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_activity_grades_updated_at BEFORE UPDATE ON activity_grades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
