import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mogmbfavudzuhryoxrhb.supabase.co/'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZ21iZmF2dWR6dWhyeW94cmhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4Nzk0MDksImV4cCI6MjA2MDQ1NTQwOX0.9Sot_cO8ckX0IcO_spCjmjtfLAvySsFI5si9Wfhy65I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)