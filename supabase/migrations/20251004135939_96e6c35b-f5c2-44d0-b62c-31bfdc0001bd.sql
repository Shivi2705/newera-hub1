-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  avatar_url text,
  bio text,
  points integer DEFAULT 0,
  streak_days integer DEFAULT 0,
  last_activity timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date timestamp with time zone NOT NULL,
  location text,
  max_participants integer,
  image_url text,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  category text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create assignments table
CREATE TABLE public.assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  deadline timestamp with time zone NOT NULL,
  points integer DEFAULT 0,
  difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create event registrations table
CREATE TABLE public.event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
  registered_at timestamp with time zone DEFAULT now(),
  attended boolean DEFAULT false,
  UNIQUE(user_id, event_id)
);

-- Create assignment submissions table
CREATE TABLE public.assignment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  assignment_id uuid REFERENCES public.assignments(id) ON DELETE CASCADE,
  submission_url text,
  submitted_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  grade integer,
  feedback text,
  UNIQUE(user_id, assignment_id)
);

-- Create achievements table
CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  badge_color text,
  points integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Create user achievements table
CREATE TABLE public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id uuid REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for events (public read)
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);

-- RLS Policies for assignments (public read)
CREATE POLICY "Anyone can view assignments" ON public.assignments FOR SELECT USING (true);

-- RLS Policies for event registrations
CREATE POLICY "Users can view all registrations" ON public.event_registrations FOR SELECT USING (true);
CREATE POLICY "Users can register for events" ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own registrations" ON public.event_registrations FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for assignment submissions
CREATE POLICY "Users can view all submissions" ON public.assignment_submissions FOR SELECT USING (true);
CREATE POLICY "Users can submit assignments" ON public.assignment_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own submissions" ON public.assignment_submissions FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for achievements
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (true);

-- RLS Policies for user achievements
CREATE POLICY "Users can view all user achievements" ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY "System can insert user achievements" ON public.user_achievements FOR INSERT WITH CHECK (true);

-- RLS Policies for testimonials
CREATE POLICY "Anyone can view featured testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Users can create testimonials" ON public.testimonials FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();