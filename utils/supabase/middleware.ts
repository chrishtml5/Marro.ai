import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = (request: NextRequest) => {
  // Check if environment variables are available
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    return { 
      supabase: null, 
      response: NextResponse.next({
        request: {
          headers: request.headers,
        },
      })
    };
  }

  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
              supabaseResponse = NextResponse.next({
                request,
              })
              cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
              )
            } catch (error) {
              console.error('Error setting cookies in middleware:', error);
            }
          },
        },
      },
    );

    return { supabase, response: supabaseResponse };
  } catch (error) {
    console.error('Error creating Supabase client in middleware:', error);
    return { 
      supabase: null, 
      response: NextResponse.next({
        request: {
          headers: request.headers,
        },
      })
    };
  }
};
