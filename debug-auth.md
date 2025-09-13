# Debug Login Issues

## Steps to Debug Login Problem

### 1. Check Environment Variables
Make sure your `.env.local` file has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Test Basic Auth
1. Go to `/test-auth` page I just created
2. Check if you can see current user status
3. Try the "Test Login" button with your credentials
4. Check browser console for errors

### 3. Check Browser Console
When trying to login, open browser dev tools (F12) and look for:
- Network errors (failed requests)
- JavaScript errors
- Console log messages I added

### 4. Common Issues & Solutions

**Issue: "Invalid login credentials"**
- Make sure the user exists in Supabase Auth
- Check if password is correct
- Verify email is confirmed

**Issue: "Email not confirmed"**
- User needs to click email confirmation link
- Check spam folder for confirmation email
- Try resending confirmation from `/confirm-email`

**Issue: Stuck loading or no response**
- Check network tab for failed requests
- Verify environment variables are set
- Check if Supabase project is active

**Issue: Middleware redirects**
- Check console for middleware logs
- Verify user auth state

### 5. Quick Test Commands

In browser console, test Supabase connection:
```javascript
// Test if Supabase is configured
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

// Test auth state
const { createClient } = await import('/utils/supabase/client')
const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()
console.log('Current user:', user)
```

### 6. What to Check in Supabase Dashboard

1. **Authentication > Users**: Is your user listed?
2. **Authentication > Settings**: Is email confirmation enabled?
3. **Logs**: Any error messages when trying to login?

### 7. If Login Still Fails

Try this minimal test:
1. Go to `/test-auth`
2. Open browser console
3. Try login and share any error messages you see
