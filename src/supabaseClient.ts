import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://qpraoumykzkbfygopggf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwcmFvdW15a3prYmZ5Z29wZ2dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNTg1MjUsImV4cCI6MjA3OTkzNDUyNX0.MfTXva2szbPAkZmMBYkee2_pcPLzDEyYUKjghf45Zdo'
)
