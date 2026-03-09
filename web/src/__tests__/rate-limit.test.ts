import { describe, it, expect } from 'vitest';
import { rateLimit, getClientIp } from '@/utils/rate-limit';

describe('Rate Limiter', () => {

    it('should allow requests within the limit', async () => {
        const result = await rateLimit('test-ip-allow', 5);
        expect(result.limited).toBe(false);
        expect(result.remaining).toBe(4);
    });

    it('should block requests over the limit', async () => {
        const ip = `test-ip-block-${Date.now()}`;

        for (let i = 0; i < 5; i++) {
            const result = await rateLimit(ip, 5);
            expect(result.limited).toBe(false);
        }

        const result = await rateLimit(ip, 5);
        expect(result.limited).toBe(true);
        expect(result.remaining).toBe(0);
    });

    it('should correctly count remaining requests', async () => {
        const ip = `test-ip-count-${Date.now()}`;

        expect((await rateLimit(ip, 3)).remaining).toBe(2);
        expect((await rateLimit(ip, 3)).remaining).toBe(1);
        expect((await rateLimit(ip, 3)).remaining).toBe(0);
        expect((await rateLimit(ip, 3)).limited).toBe(true);
    });

    it('should use separate counters for different identifiers', async () => {
        const ip1 = `test-ip-sep1-${Date.now()}`;
        const ip2 = `test-ip-sep2-${Date.now()}`;

        for (let i = 0; i < 3; i++) await rateLimit(ip1, 3);
        expect((await rateLimit(ip1, 3)).limited).toBe(true);
        expect((await rateLimit(ip2, 3)).limited).toBe(false);
    });
});

describe('getClientIp', () => {

    it('should extract IP from x-forwarded-for header', () => {
        const request = new Request('http://localhost', {
            headers: { 'x-forwarded-for': '203.0.113.1, 10.0.0.1' },
        });
        expect(getClientIp(request)).toBe('203.0.113.1');
    });

    it('should extract IP from x-real-ip header', () => {
        const request = new Request('http://localhost', {
            headers: { 'x-real-ip': '203.0.113.2' },
        });
        expect(getClientIp(request)).toBe('203.0.113.2');
    });

    it('should extract IP from cf-connecting-ip header', () => {
        const request = new Request('http://localhost', {
            headers: { 'cf-connecting-ip': '203.0.113.3' },
        });
        expect(getClientIp(request)).toBe('203.0.113.3');
    });

    it('should return "unknown" when no IP headers present', () => {
        const request = new Request('http://localhost');
        expect(getClientIp(request)).toBe('unknown');
    });

    it('should reject spoofed non-IP values in x-forwarded-for', () => {
        const request = new Request('http://localhost', {
            headers: { 'x-forwarded-for': 'not-an-ip, 10.0.0.1' },
        });
        // Primeiro valor inválido → fallback para unknown (sem x-real-ip)
        expect(getClientIp(request)).toBe('unknown');
    });
});
