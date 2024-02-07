import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pfztwnyqwehqljrwfbev.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmenR3bnlxd2VocWxqcndmYmV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDczNDE0NTgsImV4cCI6MjAyMjkxNzQ1OH0.q5vfz8VdSp_-Fcx_mzd9EDWc3MmNtW2J_RJCriwkU4A';
export const supabase = createClient(supabaseUrl, supabaseKey);