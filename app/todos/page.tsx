import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Todos</h1>
      <ul className="space-y-2">
        {todos?.map((todo) => (
          <li key={todo.id} className="p-4 border rounded shadow-sm flex items-center gap-2">
            <span className="font-medium text-lg">{todo.name}</span>
          </li>
        ))}
      </ul>
      {(!todos || todos.length === 0) && (
        <p className="text-muted-foreground italic">No todos found in the database. Add row in 'todos' table to see it here.</p>
      )}
    </div>
  )
}
