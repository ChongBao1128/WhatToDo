import { signup } from '@/actions/auth/actions'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default async function SignUpPage() {
  // Create a Supabase client and get the current user's session.
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  // If a user is already signed in, redirect to the home page.
  if (data?.user) {
    redirect('/')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold">Sign Up</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your email below to create a new account.
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form action={signup} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="m@example.com"
                required
                type="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" required type="password" />
            </div>

            <Button type="submit" className="w-full cursor-pointer">
              Sign Up
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <Link className="text-sm underline" href="/signin">
            Already have an account? Sign In
          </Link>
        </CardFooter>
      </Card>
    </main>
  )
}
