
ALTER TABLE public.profiles 
ADD COLUMN late_count integer NOT NULL DEFAULT 0,
ADD COLUMN hold_until timestamp with time zone DEFAULT NULL;
