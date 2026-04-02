import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export async function GET(req) {
  try {
    // Get all profiles
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Get auth users to get emails
    const { data: authData } = await supabaseAdmin.auth.admin.listUsers()
    const authUsers = authData?.users || []

    const users = profiles.map(profile => {
      const authUser = authUsers.find(u => u.id === profile.id)
      return { ...profile, email: authUser?.email || '' }
    })

    return NextResponse.json({ users })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
