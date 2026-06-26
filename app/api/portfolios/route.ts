import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createPortfolioSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Middleware refreshing user sessions
            }
          },
        },
      }
    );

    const url = new URL(request.url);
    const architectId = url.searchParams.get('architect_id');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let query = supabase.from('portfolios').select('*', { count: 'exact' });

    if (architectId) {
      query = query.eq('architect_id', architectId);
    }

    const { data, error, count } = await query
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch portfolios' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      total: count || 0,
      page: Math.floor(offset / limit),
      per_page: limit,
      total_pages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Middleware refreshing user sessions
            }
          },
        },
      }
    );

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();

    // Validate input
    const validation = createPortfolioSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    // Get architect profile
    const { data: architectProfile, error: architectError } = await supabase
      .from('architect_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (architectError || !architectProfile) {
      return NextResponse.json(
        { error: 'Architect profile not found' },
        { status: 404 }
      );
    }

    // Create portfolio item
    const { data, error } = await supabase
      .from('portfolios')
      .insert({
        architect_id: architectProfile.id,
        title: validation.data.title,
        description: validation.data.description,
        category: validation.data.category,
        images: validation.data.images,
        tags: validation.data.tags || [],
        project_duration: validation.data.project_duration,
        budget_range: validation.data.budget_range,
        location: validation.data.location,
        featured: validation.data.featured || false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create portfolio item' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Portfolio creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
