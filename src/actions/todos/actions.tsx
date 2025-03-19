"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Todo } from "@/lib/interface";
import { isValidUUID } from "@/app/helpers/uuid";

export async function addTodo(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Extract the required fields from formData
  const task = formData.get("task") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const category = formData.get("category") as string;
  const is_complete = false; // New todos are added as incomplete by default

  const { error } = await supabase
    .from("todos")
    .insert([{ user_id: user.id, task, description, date, category, is_complete }])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
}

export async function editTodo(todo: Todo) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // 🔥 Ensure `todo.id` is a valid UUID before updating
  if (!todo.id || typeof todo.id !== "string" || !isValidUUID(todo.id)) {
    throw new Error(`Invalid UUID: ${todo.id}`);
  }

  const { error } = await supabase
    .from("todos")
    .update({
      task: todo.task,
      description: todo.description,
      date: todo.date,
      category: todo.category,
      is_complete: todo.is_complete,
    })
    .eq("id", todo.id) // ✅ Ensure ID is a valid UUID
    .eq("user_id", user.id)
    .select();

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteTodo(id: string) { // Changed parameter type to string
  const supabase = await createClient();

  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id);  // Use the id as a string

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
}

export async function deleteCompletedTodos() {
  const supabase = await createClient();

  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("is_complete", true);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
}

export async function deleteAllTodos() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
}

export async function onCheckChange(todo: Todo) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("todos")
    .update({ is_complete: !todo.is_complete })
    .eq("id", todo.id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
}
