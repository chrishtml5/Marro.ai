import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('client_id')

    if (!clientId) {
      return NextResponse.json({ error: 'client_id parameter is required' }, { status: 400 })
    }

    // Create anonymous Supabase client for portal access
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get projects for the specific client (now allowed by updated RLS policies)
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
    }

    return NextResponse.json(projects || [])
  } catch (error) {
    console.error('Portal API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
