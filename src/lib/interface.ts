export interface Todo {
  id: string;           // Use string for UUID
  user_id: string;
  task: string;
  description: string;
  date: string;         // Store date as ISO string (or you can parse it as Date when needed)
  is_complete: boolean;
  category: string;
}