import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Trophy, Flame, Star, BookOpen, Calendar, ArrowUpRight, Play, CheckCircle2, Lock, FileText, Repeat } from 'lucide-react';
import { FollowButton } from '@/components/community/follow-button';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const supabaseAnon = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- GET CURRENT USER + FOLLOW STATE ---

async function getCurrentUserAndFollow(targetUserId: string) {
    const cookieStore = await cookies();
    const supabaseUser = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => cookieStore.getAll() } }
    );
    const { data: { user } } = await supabaseUser.auth.getUser();
    if (!user || user.id === targetUserId) return { currentUserId: null, isFollowing: false };

    const { data } = await supabaseAdmin
        .from('follows')
        .select('follower_id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .maybeSingle();

    return { currentUserId: user.id, isFollowing: !!data };
}

// --- ALUNO PROFILE LOGIC ---

async function getStudentProfile(username: string) {
    const { data: user } = await supabaseAdmin
        .from('users')
        .select('id, username, full_name, avatar_url, bio, created_at, is_profile_public')
        .eq('username', username)
        .maybeSingle();

    if (!user || !user.is_profile_public) return null;

    const { data: xpData } = await supabaseAdmin
        .from('progress')
        .select('xp_awarded')
        .eq('user_id', user.id);

    const totalXp = (xpData || []).reduce((sum, r) => sum + (r.xp_awarded || 0), 0);

    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(user.id);
    const achievementsCount = authUser?.user?.user_metadata?.achievements_claimed?.length || 0;

    const { data: enrollments } = await supabaseAdmin
        .from('enrollments')
        .select(`
            courses(id, title, thumbnail_url,
                tenants(name, slug)
            )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .limit(6);

    return {
        ...user,
        totalXp,
        achievementsCount: achievementsCount || 0,
        enrollments: enrollments || [],
    };
}

// --- TENANT (ESCOLA) PROFILE LOGIC ---

async function getTenantProfile(slug: string) {
    const { data: tenant } = await supabaseAnon
        .from('tenants')
        .select('id, name, slug, bio, avatar_url, instagram, owner_id, brand_color, logo_url')
        .eq('slug', slug)
        .single();

    if (!tenant) return null;

    const { data: courses } = await supabaseAnon
        .from('courses')
        .select('id, title, description, price, pricing_type, thumbnail_url, min_price')
        .eq('tenant_id', tenant.id)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

    // Fetch materials count per course
    const courseIds = (courses || []).map(c => c.id);
    const materialsMap: Record<string, number> = {};
    if (courseIds.length > 0) {
        const { data: materials } = await supabaseAnon
            .from('course_materials')
            .select('course_id')
            .in('course_id', courseIds);

        (materials || []).forEach(m => {
            materialsMap[m.course_id] = (materialsMap[m.course_id] || 0) + 1;
        });
    }

    // Fetch lessons count per course
    const lessonsMap: Record<string, number> = {};
    if (courseIds.length > 0) {
        const { data: lessons } = await supabaseAnon
            .from('lessons')
            .select('course_id')
            .in('course_id', courseIds);

        (lessons || []).forEach(l => {
            lessonsMap[l.course_id] = (lessonsMap[l.course_id] || 0) + 1;
        });
    }

    const { data: activePlan } = await supabaseAnon
        .from('subscription_plans')
        .select('id, name, price, billing_cycle')
        .eq('tenant_id', tenant.id)
        .eq('is_active', true)
        .order('price', { ascending: true })
        .limit(1)
        .maybeSingle(); // Better than .single() if it might not exist

    return {
        tenant,
        activePlan: activePlan || null,
        courses: (courses || []).map(c => ({
            ...c,
            materialsCount: materialsMap[c.id] || 0,
            lessonsCount: lessonsMap[c.id] || 0,
        })),
    };
}

// --- METADATA ---

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    if (decodedSlug.startsWith('@')) {
        const username = decodedSlug.replace(/^@/, '');
        const profile = await getStudentProfile(username);
        if (!profile) return { title: 'Perfil não encontrado | XPACE' };

        return {
            title: `@${profile.username} | XPACE`,
            description: profile.bio || `Conheça o perfil de ${profile.full_name} na XPACE — plataforma de dança urbana.`,
            openGraph: {
                title: `@${profile.username} | XPACE`,
                description: profile.bio || `${profile.full_name} está evoluindo na XPACE.`,
                images: profile.avatar_url ? [{ url: profile.avatar_url }] : [],
            },
        };
    } else {
        const data = await getTenantProfile(decodedSlug);
        if (!data) return { title: 'Escola não encontrada | XPACE' };

        return {
            title: `${data.tenant.name} | XPACE`,
            description: data.tenant.bio || `Conheça os treinamentos de ${data.tenant.name} na XPACE.`,
        };
    }
}

// --- PAGE RENDERER ---

export default async function GenericProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    // 1. RENDER STUDENT PROFILE (@username)
    if (decodedSlug.startsWith('@')) {
        const username = decodedSlug.replace(/^@/, '');
        const profile = await getStudentProfile(username);

        if (!profile) notFound();

        const joinedDate = new Date(profile.created_at).toLocaleDateString('pt-BR', {
            month: 'long', year: 'numeric'
        });

        return (
            <div className="min-h-screen bg-[#020202] text-white">
                <header className="border-b border-[#111] bg-[#080808]/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
                        <Link href="/explore" className="flex items-center gap-2">
                            <Image src="/images/xpace-logo-branca.png" alt="XPACE" width={80} height={22} className="object-contain" />
                        </Link>
                        <Link
                            href="/login"
                            className="text-xs font-mono uppercase tracking-widest text-[#666] hover:text-white transition-colors border border-[#222] hover:border-[#444] px-3 py-1.5 rounded"
                        >
                            Entrar
                        </Link>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto px-4 py-12">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12">
                        <div className="relative shrink-0">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/40 bg-[#111] relative">
                                {profile.avatar_url ? (
                                    <Image src={profile.avatar_url} alt={profile.full_name || ''} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-3xl font-heading font-bold text-primary">
                                            {(profile.full_name || 'XP').substring(0, 2).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-0 rounded-full ring-2 ring-primary/20 animate-pulse pointer-events-none" />
                        </div>

                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl font-heading font-bold text-white uppercase tracking-tight">
                                {profile.full_name || profile.username}
                            </h2>
                            <p className="text-primary font-mono text-sm mt-0.5">@{profile.username}</p>
                            {profile.bio && (
                                <p className="text-[#888] text-sm mt-2 max-w-md leading-relaxed">{profile.bio}</p>
                            )}
                            <div className="flex items-center gap-1 mt-3 justify-center sm:justify-start">
                                <Calendar size={12} className="text-[#555]" />
                                <span className="text-[#555] text-xs font-mono">membro desde {joinedDate}</span>
                            </div>

                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
                        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-5 text-center hover:border-primary/30 transition-colors">
                            <Star className="mx-auto text-primary mb-2" size={20} />
                            <p className="text-2xl font-bold font-mono text-white">{profile.totalXp.toLocaleString('pt-BR')}</p>
                            <p className="text-[#555] text-xs font-mono uppercase tracking-widest mt-1">XP Total</p>
                        </div>
                        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-5 text-center hover:border-[#333] transition-colors">
                            <Trophy className="mx-auto text-amber-400 mb-2" size={20} />
                            <p className="text-2xl font-bold font-mono text-white">{profile.achievementsCount}</p>
                            <p className="text-[#555] text-xs font-mono uppercase tracking-widest mt-1">Conquistas</p>
                        </div>
                        <div className="col-span-2 sm:col-span-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-5 text-center hover:border-[#333] transition-colors">
                            <BookOpen className="mx-auto text-blue-400 mb-2" size={20} />
                            <p className="text-2xl font-bold font-mono text-white">{profile.enrollments.length}</p>
                            <p className="text-[#555] text-xs font-mono uppercase tracking-widest mt-1">Cursos</p>
                        </div>
                    </div>

                    {profile.enrollments.length > 0 && (
                        <section>
                            <h2 className="text-xs font-mono uppercase tracking-widest text-[#555] mb-4">
                                Aprendendo agora
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {profile.enrollments.map((enrollment: any) => {
                                    const course = enrollment.courses;
                                    if (!course) return null;
                                    return (
                                        <Link
                                            key={course.id}
                                            href={`/course/${course.id}`}
                                            className="group bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden hover:border-primary/30 transition-all duration-300"
                                        >
                                            <div className="relative aspect-video bg-[#111]">
                                                {course.thumbnail_url ? (
                                                    <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <Image src="/images/xpace-on-branco.png" alt="" width={60} height={18} className="opacity-10" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-3">
                                                <p className="text-white text-sm font-medium line-clamp-1">{course.title}</p>
                                                {course.tenants?.name && (
                                                    <p className="text-primary text-[10px] font-mono uppercase tracking-widest mt-1 flex items-center gap-1">
                                                        {course.tenants.name}
                                                        <ArrowUpRight size={10} />
                                                    </p>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {profile.enrollments.length === 0 && (
                        <div className="text-center py-16 border border-[#111] rounded-xl">
                            <BookOpen className="mx-auto text-[#333] mb-3" size={32} />
                            <p className="text-[#555] text-sm">Nenhum curso público ainda.</p>
                        </div>
                    )}
                </main>
            </div>
        );
    }

    // 2. RENDER TENANT PROFILE (/school-slug)
    const data = await getTenantProfile(decodedSlug);
    if (!data) notFound();

    const { currentUserId: tenantCurrentUserId, isFollowing: tenantIsFollowing } = data.tenant.owner_id
        ? await getCurrentUserAndFollow(data.tenant.owner_id)
        : { currentUserId: null, isFollowing: false };

    const { tenant, courses, activePlan } = data;
    const brandColor = tenant.brand_color || "#6324b2";

    return (
        <div className="min-h-screen bg-[#020202] font-sans selection:bg-primary/30 text-white relative overflow-hidden">
            {/* Immersive Backgrounds */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Primary ambient light */}
                <div 
                    className="absolute top-[-10%] left-[20%] w-[60%] h-[500px] opacity-20 blur-[120px] rounded-full mix-blend-screen"
                    style={{ background: brandColor }}
                />
                <div 
                    className="absolute top-[40%] right-[-10%] w-[40%] h-[400px] opacity-10 blur-[100px] rounded-full mix-blend-screen"
                    style={{ background: brandColor }}
                />
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            {/* Header / Navbar */}
            <header className="border-b border-white/5 bg-[#080808]/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/explore" className="flex items-center gap-2 group">
                        <Image src="/images/xpace-logo-branca.png" alt="XPACE" width={85} height={24} className="object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <Link
                        href="/login"
                        className="text-xs font-mono uppercase tracking-widest text-[#888] hover:text-white transition-all duration-300 border border-white/10 hover:border-white/30 hover:bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm"
                    >
                        Acessar Portal
                    </Link>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-20 relative z-10">
                {/* Profile Hero Section */}
                <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-24 text-center md:text-left relative">
                    <div 
                        className="w-36 h-36 md:w-48 md:h-48 rounded-2xl md:rounded-[32px] bg-[#0a0a0a] border border-white/10 flex items-center justify-center shrink-0 relative overflow-hidden flex-col gap-2 group backdrop-blur-md" 
                        style={{ boxShadow: `0 20px 80px -20px ${brandColor}40` }}
                    >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-10" />
                        
                        {tenant.avatar_url ? (
                            <Image src={tenant.avatar_url} alt={tenant.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized />
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#050505]"></div>
                                <span className="relative z-10 font-heading text-5xl md:text-6xl text-[#333] font-bold group-hover:text-white/40 transition-colors duration-500">
                                    {tenant.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                                </span>
                            </>
                        )}
                        <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                    </div>

                    <div className="flex-1 mt-2 md:mt-4">
                        <div className="inline-flex items-center gap-2 border border-white/10 px-3 py-1.5 mb-6 text-[10px] font-mono tracking-widest uppercase bg-white/5 backdrop-blur-md rounded-full text-white/80 shadow-sm">
                            {tenant.logo_url && (
                                <img src={tenant.logo_url} alt={tenant.name} className="w-4 h-4 rounded-full object-cover" />
                            )}
                            {tenant.logo_url ? "ESCOLA PARCEIRA" : "CRIADOR OFICIAL"}
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter mb-4 leading-[1.1]" 
                            style={{ 
                                color: 'transparent',
                                WebkitTextStroke: '1px rgba(255,255,255,0.8)',
                                textShadow: `0 0 40px ${brandColor}40`
                            }}>
                            {tenant.name}
                        </h1>

                        <div className="h-1 w-20 rounded-full mb-6 opacity-80" style={{ background: `linear-gradient(90deg, ${brandColor}, transparent)` }} />

                        {tenant.bio && (
                            <p className="text-[#a0a0a0] font-sans leading-relaxed text-lg max-w-2xl font-light">
                                {tenant.bio}
                            </p>
                        )}
                        
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mt-8">
                            {tenantCurrentUserId && tenant.owner_id && (
                                <FollowButton targetUserId={tenant.owner_id} initialIsFollowing={tenantIsFollowing} />
                            )}
                            {tenant.instagram && (
                                <a 
                                    href={`https://instagram.com/${tenant.instagram.replace('@', '')}`} 
                                    target="_blank" 
                                    rel="noopener" 
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all duration-300 backdrop-blur-md"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                    @{tenant.instagram.replace('@', '')}
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Subscriptions / All Access Pass */}
                {activePlan && (
                    <div className="mb-20">
                        <div className="flex items-center gap-4 mb-6">
                            <h2 className="text-sm font-mono uppercase tracking-widest text-[#555] flex items-center gap-2">
                                <Star className="w-4 h-4 text-primary" /> Acesso Premium
                            </h2>
                        </div>
                        <div
                            className="group relative overflow-hidden rounded-[24px] border border-primary/20 bg-gradient-to-br from-[#111] to-[#050505] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 transition-transform duration-500 hover:scale-[1.01]"
                            style={{ boxShadow: `0 20px 80px -20px ${brandColor}20` }}
                        >
                            {/* Glassmorphism shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />

                            <div className="relative z-10 w-full md:w-auto text-center md:text-left">
                                <span className="inline-block px-3 py-1 bg-primary/10 border border-primary/30 text-primary text-[10px] font-mono uppercase tracking-widest rounded-full mb-4">
                                    ✦ Assinatura Global da Escola
                                </span>
                                <h3 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2 leading-tight">
                                    {activePlan.name}
                                </h3>
                                <p className="text-[#888] text-base md:text-lg max-w-md">
                                    Desbloqueie acesso instantâneo e ilimitado a <strong className="text-white font-normal">todos os treinamentos</strong> e materiais exclusivos.
                                </p>
                            </div>

                            <div className="relative z-10 flex flex-col items-center md:items-end gap-5 shrink-0 w-full md:w-auto">
                                <div className="text-center md:text-right">
                                    <span className="text-4xl md:text-5xl font-display font-medium text-white tracking-tight">
                                        R$ {activePlan.price.toFixed(2).replace('.', ',')}
                                    </span>
                                    <span className="text-sm text-[#888] font-mono ml-2 uppercase tracking-wider">
                                        /{activePlan.billing_cycle === 'MONTHLY' ? 'mês' : 'ano'}
                                    </span>
                                </div>
                                <Link
                                    href={`/checkout/subscribe/${activePlan.id}`}
                                    className="w-full md:w-auto group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold text-sm uppercase tracking-widest rounded-full overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(99,36,178,0.6)]"
                                >
                                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                    <span className="relative flex items-center gap-2">
                                        <Repeat size={16} className="group-hover:-rotate-90 transition-transform duration-500" /> 
                                        Assinar Agora
                                    </span>
                                </Link>
                                <p className="text-[10px] text-[#555] font-mono uppercase tracking-widest mt-1">
                                    Cancele quando quiser.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Courses Showcase */}
                <div>
                    <div className="flex items-center gap-4 mb-10">
                        <h2 className="text-3xl font-heading font-bold tracking-tight text-white">Treinamentos</h2>
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent"></div>
                    </div>

                    {courses.length === 0 ? (
                        <div className="border border-white/5 bg-white/[0.02] backdrop-blur-md rounded-2xl p-16 text-center shadow-inner">
                            <BookOpen className="w-12 h-12 text-[#333] mx-auto mb-4" />
                            <p className="text-[#666] text-lg font-light">Este criador ainda não publicou treinamentos públicos.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {courses.map((course) => (
                                <Link 
                                    key={course.id} 
                                    href={`/course/${course.id}`}
                                    className="group relative bg-[#0a0a0a] border border-white/5 hover:border-white/20 rounded-[20px] overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 flex flex-col h-full"
                                >
                                    <div className="relative w-full aspect-video bg-[#111] overflow-hidden shrink-0">
                                        {course.thumbnail_url ? (
                                            <Image 
                                                src={course.thumbnail_url} 
                                                alt={course.title} 
                                                fill 
                                                className="object-cover transition-transform duration-700 group-hover:scale-105" 
                                                unoptimized 
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
                                                <Image src="/images/xpace-on-branco.png" alt="" width={80} height={24} className="opacity-[0.05]" />
                                            </div>
                                        )}
                                        {/* Overlay gradient on image */}
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
                                        
                                        {/* Play Button Hover Effect */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 delay-75">
                                                <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                                            </div>
                                        </div>

                                        {/* Badges Overlay */}
                                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                            {course.pricing_type === 'subscription' ? (
                                                <span className="bg-black/60 backdrop-blur-md text-white border border-white/10 text-[10px] font-mono px-3 py-1.5 uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-lg">
                                                    <Repeat size={12} className="text-secondary" /> Incluído na Assinatura
                                                </span>
                                            ) : (
                                                <span className="bg-primary/90 backdrop-blur-md text-white border border-primary text-[10px] font-mono px-3 py-1.5 uppercase tracking-widest rounded-full shadow-lg">
                                                    Compra Avulsa
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-6 sm:p-8 flex flex-col flex-1 relative z-10 bg-[#0a0a0a]">
                                        <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                            {course.title}
                                        </h3>
                                        <p className="text-[#888] text-sm mb-8 line-clamp-3 leading-relaxed flex-1">
                                            {course.description}
                                        </p>

                                        <div className="mt-auto pt-6 border-t border-white/5 flex items-end justify-between gap-4">
                                            <div>
                                                <span className="block text-sm font-mono tracking-widest text-[#555] uppercase mb-1">
                                                    Investimento
                                                </span>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-display font-medium text-white">
                                                        R$ {(course.price || 0).toFixed(2).replace('.', ',')}
                                                    </span>
                                                    {course.pricing_type !== 'subscription' && (
                                                        <span className="text-[10px] font-mono text-[#666] uppercase tracking-widest">
                                                            / 12x
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300">
                                                <ArrowUpRight className="w-5 h-5 text-[#888] group-hover:text-white transition-colors" />
                                            </div>
                                        </div>

                                        {/* Metadata Footer */}
                                        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5 text-[10px] font-mono uppercase tracking-widest text-[#666]">
                                            {course.lessonsCount > 0 && (
                                                <div className="flex items-center gap-1.5">
                                                    <Play size={10} /> {course.lessonsCount} aulas
                                                </div>
                                            )}
                                            {course.materialsCount > 0 && (
                                                <div className="flex items-center gap-1.5">
                                                    <FileText size={10} /> {course.materialsCount} arquivos
                                                </div>
                                            )}
                                            {course.pricing_type !== 'subscription' && (
                                                <div className="flex items-center gap-1.5 ml-auto text-[#444]">
                                                    <Lock size={10} /> Acesso Vitalício
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
