'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createFestival(formData: FormData) {
  const supabase = await createClient()

  // Verifica o usuário atual
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Verifica a rule do perfil
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  
  if (profile?.role !== 'organizer') {
    throw new Error('Apenas organizadores podem criar festivais.')
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const start_date = formData.get('start_date') as string
  const end_date = formData.get('end_date') as string

  // Cria o festival na tabela associado a este organizador
  const { error } = await supabase.from('festivals').insert({
    name,
    description,
    start_date,
    end_date,
    status: 'draft',
    organizer_id: user.id
  })

  if (error) {
    console.error('Falha ao criar o festival:', error)
    redirect('/festivals/new?error=Falha%20ao%20criar%20festival')
  }

  // Se sucesso, revalida a listagem e joga o cara pra lista de festivais
  revalidatePath('/festivals')
  redirect('/festivals?success=Festival%20criado%20como%20Rascunho')
}
