import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  // Get authenticated user
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = userData.user.id

  // Fetch todos for the logged-in user
  const { data: todos, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', userId) // Only return tasks for this user

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 },
    )
  }

  return NextResponse.json(todos)
}
