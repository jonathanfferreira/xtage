import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carrega as variaveis do arquivo .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing SUPABASE env vars!")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testTrigger() {
  console.log("-> 1. Testando Auth Sign Up...")
  const emailTest = `test_trigger_${Date.now()}@wing.com`
  
  const { data, error } = await supabase.auth.signUp({
    email: emailTest,
    password: 'password123',
    options: {
      data: {
        full_name: 'Test Trigger Organizador',
        role: 'organizer'
      }
    }
  })
  
  if (error) {
    console.error("ERRO NO SIGNUP:", error)
    return
  }
  
  const userId = data.user.id
  console.log(`-> 2. Usuario criado na auth.users [ID: ${userId}]`)
  
  console.log("-> 3. Checando public.profiles para ver se o trigger disparou...")
  
  // O trigger de banco roda sincronamente no insert da tabela auth, mas a API retorna rapido.
  const { data: profile, error: pError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
    
  if (pError) {
    console.error("ERRO: Profile não encontrado. O trigger não funcionou ou os dados vieram vazios.", pError)
  } else {
    console.log("✅ SUCESSO! O profile foi criado automaticamente pelo Trigger!")
    console.log(profile)
  }
}

testTrigger()
