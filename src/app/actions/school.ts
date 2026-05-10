'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function enrollChoreography(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Obtem a escola deste diretor
  const { data: school } = await supabase.from('schools').select('id').eq('director_id', user.id).single()
  if (!school) {
    throw new Error('Escola não encontrada para este diretor.')
  }

  const festival_id = formData.get('festival_id') as string
  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const music_url = formData.get('music_url') as string

  // 1. Criar a Coreografia
  const { data: choreo, error: choreoError } = await supabase.from('choreographies').insert({
    festival_id,
    name,
    category,
    music_url,
    time_limit_seconds: 300 // Exemplo default
  }).select('id').single()

  if (choreoError || !choreo) {
    console.error(choreoError)
    redirect(`/school/enroll/${festival_id}?error=Falha%20ao%20cadastrar%20coreografia`)
  }

  // 2. Criar a Inscrição vinculando a escola
  const { error: insError } = await supabase.from('inscriptions').insert({
    choreography_id: choreo.id,
    school_id: school.id,
    status: 'pending_school_approval'
  })

  if (insError) {
    console.error(insError)
    redirect(`/school/enroll/${festival_id}?error=Falha%20ao%20gerar%20inscrição`)
  }

  revalidatePath('/school')
  redirect('/school?success=Coreografia%20inscrita%20com%20sucesso!')
}
