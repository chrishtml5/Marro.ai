-- Security Test Script
-- Run this to verify that Row Level Security is working properly

-- Test 1: Check if RLS is enabled on all tables
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'clients', 'projects', 'documents', 'timelines', 'timeline_phases', 'timeline_tasks', 'messages', 'analytics');

-- Test 2: Check current user's data isolation
-- (This should only show YOUR data, not other users' data)
SELECT 
  'clients' as table_name,
  count(*) as my_records,
  auth.uid() as my_user_id
FROM public.clients

UNION ALL

SELECT 
  'projects' as table_name,
  count(*) as my_records,
  auth.uid() as my_user_id
FROM public.projects

UNION ALL

SELECT 
  'documents' as table_name,
  count(*) as my_records,
  auth.uid() as my_user_id
FROM public.documents;

-- Test 3: Try to access specific client data
-- (This should only return clients you own)
SELECT 
  id,
  name,
  company,
  user_id,
  CASE 
    WHEN user_id = auth.uid() THEN 'YOUR DATA ✓'
    ELSE 'OTHER USER DATA ✗ (THIS IS BAD!)'
  END as ownership_status
FROM public.clients
LIMIT 10;

-- Test 4: Verify policies exist
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('clients', 'projects', 'documents')
ORDER BY tablename, policyname;
