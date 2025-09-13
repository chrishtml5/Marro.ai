import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: NextRequest) {
  try {
    // Create anonymous Supabase client for portal access
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get all clients (now allowed by updated RLS policies)
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching clients:', error)
      return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 })
    }

    return NextResponse.json(clients || [])
  } catch (error) {
    console.error('Portal API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
