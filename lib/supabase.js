import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mugzzeulgpvqraatyyww.supabase.co', // Project URL
  'YOUR_ANON_PUBLIC_KEY'                      // anon key
)
fetch('https://mugzzeulgpvqraatyyww.supabase.co/rest/v1/items', {
  method: 'POST',
  headers: {
    apikey: 'YOUR_ANON_PUBLIC_KEY',
    Authorization: 'Bearer YOUR_ANON_PUBLIC_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    type: 'Wallet',
    description: 'Black leather wallet',
    location: 'Library',
    contact: 'john@example.com',
    date: '2026-03-12',
    status: 'Lost'
  })
})
