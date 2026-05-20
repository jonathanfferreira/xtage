import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    // Get logged in user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado. Faça login como produtor.' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, start_date, end_date, registration_deadline, payment_cutoff_date, categories } = body;

    // 1. Insert Festival
    const { data: festival, error: festivalError } = await supabase
      .from('festivals')
      .insert({
        organizer_id: user.id,
        name,
        description,
        start_date,
        end_date,
        registration_deadline,
        payment_cutoff_date
      })
      .select('id')
      .single();

    if (festivalError) {
      console.error('Error inserting festival:', festivalError);
      return NextResponse.json({ error: 'Erro ao salvar os detalhes do festival.' }, { status: 400 });
    }

    // 2. Insert Categories
    if (categories && categories.length > 0) {
      const categoriesToInsert = categories.map((cat: any) => ({
        festival_id: festival.id,
        name: cat.name,
        max_duration_seconds: cat.max_duration_seconds,
        base_fee: cat.base_fee
      }));

      const { error: catError } = await supabase
        .from('categories')
        .insert(categoriesToInsert);

      if (catError) {
        console.error('Error inserting categories:', catError);
        // We should ideally rollback the festival creation here, but keeping it simple for MVP
        return NextResponse.json({ error: 'Festival criado, mas erro ao salvar as categorias.' }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true, festivalId: festival.id }, { status: 201 });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}
