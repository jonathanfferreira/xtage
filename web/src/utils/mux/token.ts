import Mux from '@mux/mux-node';

export async function generateMuxJwtToken(playbackId: string): Promise<string | null> {
  try {
    const keyId = process.env.MUX_SIGNING_KEY;
    const keySecret = process.env.MUX_PRIVATE_KEY;

    if (!keyId || !keySecret) {
      console.warn("MUX_SIGNING_KEY ou MUX_PRIVATE_KEY ausentes no .env.local");
      return null;
    }

    const mux = new Mux();
    
    // A API .jwt.signPlaybackId aceita o ID, e as configs do token (incluindo expiração)
    const token = await mux.jwt.signPlaybackId(playbackId, {
      keyId,
      keySecret,
      expiration: '6h', // O aluno tem 6 horas de sessão antes de precisar de refresh
    });
    
    return token;
  } catch (error) {
    console.error("Erro ao gerar token JWT do Mux:", error);
    return null;
  }
}
