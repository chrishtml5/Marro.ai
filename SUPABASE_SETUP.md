# Supabase Setup Guide

This guide will help you set up Supabase for your Marro.ai project and migrate from localStorage to Supabase.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Your environment variables ready

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a project name and password
3. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Your Environment Variables

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)

## Step 3: Set Up Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query and copy the contents of `supabase/schema.sql`
3. Run the query to create all tables and types
4. Create another query and copy the contents of `supabase/rls-policies.sql`
5. Run the query to set up Row Level Security policies

## Step 5: Enable Authentication

1. Go to **Authentication** > **Settings** in your Supabase dashboard
2. Configure your authentication providers as needed
3. For development, you can use email/password authentication

## Step 6: Test the Setup

1. Run your Next.js application: `npm run dev`
2. Visit `/supabase-example` to test the connection
3. You should see either your data or setup instructions

## Step 7: Migrate Existing Data (Optional)

If you have existing data in localStorage, you can:

1. Export your localStorage data from the browser console:
   ```javascript
   const data = {
     userProfile: localStorage.getItem('userProfile'),
     clients: localStorage.getItem('clients'),
     projects: localStorage.getItem('projects'),
     timelines: localStorage.getItem('timelines'),
     documents: localStorage.getItem('documents')
   }
   console.log(JSON.stringify(data, null, 2))
   ```

2. Use the sample data in `supabase/sample-data.sql` as a template to insert your data
3. Replace `'your-user-id'` with your actual user ID from the auth.users table

## Step 8: Update Application Code

The application has been updated to use Supabase instead of localStorage. Key changes:

- All data operations now use Supabase instead of localStorage
- Authentication is handled through Supabase Auth
- Row Level Security ensures users can only access their own data

## Troubleshooting

### Common Issues

1. **"Invalid API key"**: Double-check your environment variables
2. **"Row Level Security policy violation"**: Make sure you're authenticated
3. **"Table doesn't exist"**: Run the schema.sql script
4. **"Permission denied"**: Run the rls-policies.sql script

### Database Structure

The database includes these main tables:
- `users` - User profiles
- `clients` - Client information
- `projects` - Project details
- `documents` - File uploads
- `timelines` - Project timelines
- `timeline_phases` - Timeline phases
- `timeline_tasks` - Individual tasks
- `messages` - Client communications
- `analytics` - Usage analytics

### Row Level Security

All tables have RLS enabled, meaning:
- Users can only see their own data
- Authentication is required for all operations
- Data is automatically filtered by user ID

## Next Steps

1. Test all functionality to ensure everything works
2. Set up file storage for documents (Supabase Storage)
3. Configure email templates for authentication
4. Set up real-time subscriptions if needed

## Support

If you encounter issues:
1. Check the Supabase logs in your dashboard
2. Review the browser console for errors
3. Verify your environment variables
4. Ensure all SQL scripts ran successfully
