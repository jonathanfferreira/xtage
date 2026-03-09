/**
 * Rate limiter com suporte a Upstash Redis (recomendado para produção multi-instância)
 * e fallback para in-memory (desenvolvimento / deploy single-instance).
 *
 * Para ativar o Redis global, configure as variáveis:
 *   UPSTASH_REDIS_REST_URL=https://...
 *   UPSTASH_REDIS_REST_TOKEN=AX...
 *
 * Sem essas variáveis, usa sliding window em memória (por instância Vercel).
 */

const windowMs = 60_000; // 1 minuto

// ─── In-memory store (fallback) ──────────────────────────────────────────────
const store = new Map<string, { count: number; resetAt: number }>();

setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
        if (now > entry.resetAt) store.delete(key);
    }
}, 5 * 60_000);

function rateLimitMemory(identifier: string, maxRequests: number) {
    const now = Date.now();
    const entry = store.get(identifier);

    if (!entry || now > entry.resetAt) {
        store.set(identifier, { count: 1, resetAt: now + windowMs });
        return { limited: false, remaining: maxRequests - 1, resetAt: now + windowMs };
    }

    entry.count++;
    const remaining = Math.max(0, maxRequests - entry.count);
    return {
        limited: entry.count > maxRequests,
        remaining,
        resetAt: entry.resetAt,
    };
}

// ─── Upstash Redis store (produção) ──────────────────────────────────────────
async function rateLimitRedis(identifier: string, maxRequests: number) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    const key = `rl:${identifier}`;
    const now = Date.now();
    const windowSec = Math.ceil(windowMs / 1000);

    // INCR + EXPIRE via pipeline
    const res = await fetch(`${url}/pipeline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify([
            ["INCR", key],
            ["EXPIRE", key, windowSec, "NX"],
            ["TTL", key],
        ]),
    });

    if (!res.ok) throw new Error("Upstash Redis pipeline failed");

    const data: Array<{ result: number }> = await res.json();
    const count = data[0].result;
    const ttl = data[2].result;
    const resetAt = now + ttl * 1000;
    const remaining = Math.max(0, maxRequests - count);

    return { limited: count > maxRequests, remaining, resetAt };
}

// ─── Public API ───────────────────────────────────────────────────────────────
export async function rateLimit(
    identifier: string,
    maxRequests: number = 10
): Promise<{ limited: boolean; remaining: number; resetAt: number }> {
    const hasRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

    if (hasRedis) {
        try {
            return await rateLimitRedis(identifier, maxRequests);
        } catch (e) {
            console.warn("[RATE LIMIT] Redis indisponível, usando fallback in-memory:", e);
        }
    }

    return rateLimitMemory(identifier, maxRequests);
}

/**
 * Extrai o IP real do cliente de forma segura.
 * Aceita apenas o primeiro valor de x-forwarded-for e valida o formato IPv4/IPv6.
 */
export function getClientIp(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        const first = forwarded.split(",")[0].trim();
        // Valida formato básico de IPv4 ou IPv6
        if (/^[\d.]+$/.test(first) || /^[0-9a-fA-F:]+$/.test(first)) {
            return first;
        }
    }
    return (
        request.headers.get("x-real-ip") ||
        request.headers.get("cf-connecting-ip") ||
        "unknown"
    );
}
