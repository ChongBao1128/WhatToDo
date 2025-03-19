"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/**
 * Signup function: Creates a new user account using Supabase authentication.
 *
 * Steps:
 * 1. Extract email and password from the form data.
 * 2. Validate that both fields are provided.
 * 3. Call Supabase's signUp method.
 * 4. Revalidate the home page layout (to update any cached data).
 * 5. Redirect the user to the signin page.
 */
export async function signup(formData: FormData) {
  const supabase = await createClient();

  // Extract email and password from the form data.
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validate that both email and password are provided.
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  // Attempt to sign up the user.
  const { error } = await supabase.auth.signUp({ email, password });

  // If an error occurs, throw it to be handled by the calling function.
  if (error) {
    throw new Error(error.message);
  }

  // Invalidate the cached layout to ensure up-to-date information.
  revalidatePath("/", "layout");
  // Redirect the user to the signin page after a successful signup.
  redirect("/signin");
}

/**
 * Signin function: Logs in the user with email and password.
 *
 * Steps:
 * 1. Extract and validate the email and password from the form data.
 * 2. Call Supabase's signInWithPassword method.
 * 3. Revalidate the home page layout.
 * 4. Redirect the user to the home page.
 */
export async function signin(formData: FormData) {
  const supabase = await createClient();

  // Extract email and password from the form data.
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validate that both email and password are provided.
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  // Attempt to sign in the user.
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  // If an error occurs during sign in, throw an error.
  if (error) {
    throw new Error(error.message);
  }

  // Revalidate the cached layout for the home page.
  revalidatePath("/", "layout");
  // Redirect the user to the home page after a successful sign in.
  redirect("/");
}

/**
 * Signout function: Logs out the current user.
 *
 * Steps:
 * 1. Call Supabase's signOut method.
 * 2. Redirect the user to the signin page.
 */
export async function signout() {
  const supabase = await createClient();

  // Attempt to sign out the user.
  const { error } = await supabase.auth.signOut();

  // If an error occurs during sign out, throw an error.
  if (error) {
    throw new Error(error.message);
  }

  // Redirect the user to the signin page after a successful sign out.
  redirect("/signin");
}
