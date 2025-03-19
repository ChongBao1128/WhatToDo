import { createClient } from '@/utils/supabase/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/verify-otp
 *
 * This endpoint handles email OTP verification.
 * It expects the following query parameters:
 * - token_hash: the token hash received via email.
 * - type: the OTP type (e.g., "signup" or "magiclink").
 * - next: (optional) the path to redirect to upon successful verification.
 *
 * The handler verifies the OTP using Supabase.
 * If verification is successful, it redirects to the provided "next" path.
 * If parameters are missing or verification fails, it redirects with an error message.
 */
export async function GET(request: NextRequest) {
  // Parse query parameters from the request URL.
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  // Prepare a redirect URL based on the 'next' parameter.
  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  // Remove sensitive query parameters.
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')

  // If required parameters are missing, set an error and redirect.
  if (!token_hash || !type) {
    redirectTo.searchParams.set('error', 'missing_parameters')
    return NextResponse.redirect(redirectTo)
  }

  // Create a Supabase client instance.
  const supabase = await createClient()

  // Attempt to verify the OTP using the provided token hash and type.
  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  })

  // If OTP verification fails, redirect with an error indicator.
  if (error) {
    redirectTo.searchParams.set('error', 'invalid_or_expired_token')
    return NextResponse.redirect(redirectTo)
  }

  // On successful verification, clean up the redirect parameters and redirect.
  redirectTo.searchParams.delete('next')
  return NextResponse.redirect(redirectTo)
}
