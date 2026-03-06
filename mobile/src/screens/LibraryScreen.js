import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { PlayCircle, ShieldCheck, Clock } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function LibraryScreen({ navigation }) {
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        async function fetchEnrollments() {
            try {
                // Busca matrículas com dados do curso e lista de aulas para calcular progresso
                const { data, error } = await supabase
                    .from('enrollments')
                    .select(`
                        id,
                        status,
                        enrolled_at,
                        courses (
                            id,
                            title,
                            pricing_type,
                            lessons ( id )
                        )
                    `)
                    .eq('user_id', user.id)
                    .eq('status', 'active')
                    .order('enrolled_at', { ascending: false });

                if (error || !data) {
                    setEnrollments([]);
                    return;
                }

                // Calcula progresso real para cada matrícula
                const withProgress = await Promise.all(
                    data.map(async (enrollment) => {
                        const totalLessons = enrollment.courses?.lessons?.length || 0;

                        if (totalLessons === 0) {
                            return { ...enrollment, progressPct: 0, completedLessons: 0, totalLessons: 0 };
                        }

                        const lessonIds = enrollment.courses.lessons.map(l => l.id);
                        const { count: completedCount } = await supabase
                            .from('progress')
                            .select('id', { count: 'exact', head: true })
                            .eq('user_id', user.id)
                            .eq('completed', true)
                            .in('lesson_id', lessonIds);

                        const completed = completedCount || 0;
                        const pct = Math.round((completed / totalLessons) * 100);
                        return { ...enrollment, progressPct: pct, completedLessons: completed, totalLessons };
                    })
                );

                setEnrollments(withProgress);
            } catch {
                setEnrollments([]);
            } finally {
                setLoading(false);
            }
        }

        fetchEnrollments();
    }, [user]);

    function getTypeLabel(enrollment) {
        const pricing = enrollment.courses?.pricing_type;
        if (pricing === 'subscription') return 'Assinatura';
        if (pricing === 'free') return 'Gratuito';
        return 'Curso Avulso';
    }

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color="#6324b2" size="large" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-black">

            {/* Topbar */}
            <View className="px-6 pt-16 pb-4 bg-[#050505] border-b border-[#222]">
                <Text className="text-white font-bold text-2xl uppercase tracking-widest">Biblioteca</Text>
                <Text className="text-[#888] text-xs uppercase tracking-widest mt-1">
                    {enrollments.length > 0
                        ? `${enrollments.length} curso${enrollments.length > 1 ? 's' : ''} ativo${enrollments.length > 1 ? 's' : ''}`
                        : 'Meus Cursos e Assinaturas'}
                </Text>
            </View>

            <ScrollView className="flex-1 px-4 pt-6 pb-20" showsVerticalScrollIndicator={false}>

                {enrollments.length === 0 ? (
                    <View className="items-center justify-center py-20">
                        <PlayCircle color="#333" size={48} />
                        <Text className="text-[#555] text-sm uppercase tracking-widest mt-4 text-center">
                            Nenhum curso ativo
                        </Text>
                        <Text className="text-[#444] text-xs mt-2 text-center">
                            Explore o catálogo e matricule-se em um curso.
                        </Text>
                    </View>
                ) : (
                    enrollments.map(enrollment => {
                        const isDone = enrollment.progressPct === 100;
                        const progressStr = `${enrollment.progressPct}%`;
                        const typeLabel = getTypeLabel(enrollment);

                        return (
                            <TouchableOpacity
                                key={enrollment.id}
                                className="w-full bg-[#0A0A0A] border border-[#222] rounded-md p-4 mb-4 relative overflow-hidden"
                                activeOpacity={0.8}
                                onPress={() => navigation.navigate('Class', { courseId: enrollment.courses?.id })}
                            >
                                {/* Badge de Tipo/Status */}
                                <View className={`absolute top-0 right-0 px-3 py-1 rounded-bl-md ${isDone ? 'bg-secondary' : 'bg-[#111]'}`}>
                                    <Text className={`text-[10px] font-bold uppercase tracking-widest ${isDone ? 'text-white' : 'text-[#888]'}`}>
                                        {isDone ? 'Concluído' : typeLabel}
                                    </Text>
                                </View>

                                <View className="flex-row items-center gap-4">
                                    <View className="w-16 h-16 bg-[#111] border border-[#333] rounded-md items-center justify-center">
                                        <ShieldCheck color="#6324b2" size={24} />
                                    </View>

                                    <View className="flex-1 pr-4">
                                        <Text className="text-white font-bold text-lg uppercase leading-tight mb-2 pr-12">
                                            {enrollment.courses?.title || 'Curso'}
                                        </Text>
                                        <View className="flex-row items-center gap-2">
                                            <Clock color="#666" size={12} />
                                            <Text className="text-[#666] text-xs font-mono uppercase">
                                                {isDone ? 'Concluído' : 'Ativo'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Barra de Progresso Real */}
                                <View className="mt-6 flex-row items-center justify-between">
                                    <View className="flex-1 h-1.5 bg-[#222] rounded-full overflow-hidden mr-4">
                                        <View
                                            style={{ width: progressStr }}
                                            className={`h-full ${isDone ? 'bg-secondary' : 'bg-primary'}`}
                                        />
                                    </View>
                                    <Text className="text-white text-xs font-bold font-mono">{progressStr}</Text>
                                </View>

                                {enrollment.totalLessons > 0 && (
                                    <Text className="text-[#444] text-[10px] uppercase tracking-wider mt-2">
                                        {enrollment.completedLessons}/{enrollment.totalLessons} aulas concluídas
                                    </Text>
                                )}
                            </TouchableOpacity>
                        );
                    })
                )}

            </ScrollView>
        </View>
    );
}
