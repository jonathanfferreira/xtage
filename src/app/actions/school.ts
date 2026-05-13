'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function enrollChoreography(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: school } = await supabase.from('schools').select('id').eq('director_id', user.id).single()
  if (!school) redirect('/school?error=Escola%20não%20encontrada')

  const festival_id = formData.get('festival_id') as string
  const name = formData.get('name') as string
  const category_id = formData.get('category_id') as string
  const music_url = formData.get('music_url') as string

  // Busca o nome e duração da categoria selecionada
  const { data: category } = await supabase.from('categories').select('name, max_duration_seconds').eq('id', category_id).single()
  if (!category) redirect(`/school/enroll/${festival_id}?error=Categoria%20inválida`)

  // 1. Criar a coreografia com categoria como texto (schema real do banco)
  const { data: choreo, error: choreoError } = await supabase.from('choreographies').insert({
    festival_id,
    school_id: school.id,
    name,
    category: category.name,
    music_url: music_url || null,
    time_limit_seconds: category.max_duration_seconds,
  }).select('id').single()

  if (choreoError || !choreo) {
    console.error(choreoError)
    redirect(`/school/enroll/${festival_id}?error=Falha%20ao%20cadastrar%20coreografia`)
  }

  // 2. Criar a inscrição vinculando a escola (school_status = 'pending', festival_status = 'pending')
  const { error: insError } = await supabase.from('inscriptions').insert({
    choreography_id: choreo.id,
    school_id: school.id,
    school_status: 'pending',
    festival_status: 'pending',
  })

  if (insError) {
    console.error(insError)
    redirect(`/school/enroll/${festival_id}?error=Falha%20ao%20gerar%20inscrição`)
  }

  revalidatePath('/school')
  redirect('/school?success=Coreografia%20inscrita%20com%20sucesso!')
}

export async function confirmInscription(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: school } = await supabase.from('schools').select('id').eq('director_id', user.id).single()
  if (!school) redirect('/school')

  const inscription_id = formData.get('inscription_id') as string

  // Verifica que esta inscrição pertence à escola deste diretor
  const { data: ins } = await supabase
    .from('inscriptions')
    .select('id, school_id')
    .eq('id', inscription_id)
    .eq('school_id', school.id)
    .single()

  if (!ins) redirect('/school?error=Inscrição%20não%20encontrada')

  await supabase.from('inscriptions').update({ school_status: 'approved' }).eq('id', inscription_id)

  revalidatePath('/school')
  redirect('/school?success=Inscrição%20confirmada%20e%20enviada%20para%20análise!')
}
