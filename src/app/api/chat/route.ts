import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const systemInstruction = `
      Você é a XTAGE AI, a assistente oficial e especializada da plataforma XTAGE, o 'Sistema Operacional para Festivais de Dança'.
      Seu objetivo é ajudar bailarinos e diretores de escola com dúvidas sobre inscrições, pagamentos, envio de música, regulamento dos festivais e informações gerais sobre a plataforma.
      Você deve ser amigável, clara e objetiva.

      Regras da Plataforma XTAGE:
      - XTAGE usa faturamento unificado (Fatura Única). Coreografias de grupo são cobradas de uma vez, mas rateadas entre os alunos na mesma escola, e quem paga é cada bailarino direto pela plataforma.
      - A taxa do XTAGE pode ser repassada (cobrada do bailarino em cima da inscrição) ou absorvida (tirada do valor que o organizador recebe).
      - Para enviar a música, o bailarino deve usar o "Meu Portal", acessou seu ingresso e fez o upload por lá.
      - As notas são exibidas em tempo real logo após a coreografia desocupar o palco (ou depende do organizador).
      - Festivais não precisam usar papel e WhatsApp, tudo é pelo painel.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
