import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function SupabaseExamplePage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Example: Fetch todos from Supabase
  const { data: todos, error } = await supabase.from('todos').select('*')

  if (error) {
    console.error('Error fetching todos:', error)
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Supabase Integration Example</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Todos from Supabase</h2>
        
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Error loading todos: {error.message}</p>
            <p className="text-sm mt-2">
              Make sure you have:
              <br />
              1. Set up your Supabase project
              <br />
              2. Added environment variables
              <br />
              3. Created a 'todos' table
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {todos?.map((todo) => (
              <li key={todo.id} className="bg-gray-50 p-3 rounded border">
                {JSON.stringify(todo)}
              </li>
            )) || (
              <li className="text-gray-500 italic">No todos found</li>
            )}
          </ul>
        )}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Setup Instructions</h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-700">
          <li>Create a Supabase project at <a href="https://supabase.com" className="underline">supabase.com</a></li>
          <li>Add your environment variables to <code className="bg-blue-100 px-1 rounded">.env.local</code>:
            <pre className="bg-blue-100 p-2 rounded mt-1 text-sm">
{`NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`}
            </pre>
          </li>
          <li>Create a 'todos' table in your Supabase database</li>
          <li>Refresh this page to see your data</li>
        </ol>
      </div>
    </div>
  )
}
