import Calendar from '@/component/Calendar/Calendar'
import ClientTopNav from '@/component/General/TopNav'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

const Home = async () => {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/signin')
  }

  return (
    <>
      <ClientTopNav userEmail={data.user.email as unknown as string} />
      <Calendar />
    </>
  )
}

export default Home
