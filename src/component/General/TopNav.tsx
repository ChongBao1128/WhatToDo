'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface TopNavProps {
  userEmail: string
}

export default function TopNav({ userEmail }: TopNavProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout failed:', error.message)
    } else {
      console.log('User logged out successfully')
      router.push('/signin')
    }
  }

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-md">
      <div className="text-lg font-bold">MyApp</div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300">{userEmail}</span>
        <Button
          variant="ghost"
          className="text-white cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </nav>
  )
}
