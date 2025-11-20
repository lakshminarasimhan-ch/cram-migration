import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Create a mock client if environment variables are not set
let supabase: any

try {
  if (SUPABASE_URL === 'https://placeholder.supabase.co' || SUPABASE_ANON_KEY === 'placeholder-key') {
    // Create a mock client for development/static builds
    supabase = {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        eq: function() { return this },
        single: function() { return this },
        order: function() { return this }
      })
    }
  } else {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }
} catch (error) {
  // Fallback mock client
  supabase = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      eq: function() { return this },
      single: function() { return this },
      order: function() { return this }
    })
  }
}

export { supabase }
