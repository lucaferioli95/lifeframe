import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://xriefqceuirdujtoxkuc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyaWVmcWNldWlyZHVqdG94a3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyOTc5NTQsImV4cCI6MjA5Mjg3Mzk1NH0.BI08ssRqsQfG5fcFHRq2nf_lOtThzvVSncJ7oYo0K9g'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)