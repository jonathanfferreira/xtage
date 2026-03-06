import React, { useRef, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { ArrowLeft, Heart, Star, Share2, MoreHorizontal } from 'lucide-react-native';
import { Video, ResizeMode } from 'expo-av';
import { usePreventScreenCapture } from 'expo-screen-capture';
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');

export default function ClassScreen({ navigation, route }) {
    // Anti-pirataria: bloqueia PrintScreen e gravadores nativos de tela
    usePreventScreenCapture();

    const videoRef = useRef(null);
    const [status, setStatus] = useState({});
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const lessonId = route?.params?.lessonId;

    useEffect(() => {
        if (!lessonId) {
            setError('Aula não encontrada.');
            setLoading(false);
            return;
        }

        async function fetchLesson() {
            try {
                const { data, error: fetchError } = await supabase
                    .from('lessons')
                    .select(`
                        id,
                        title,
                        description,
                        video_url,
                        xp_reward,
                        order_index,
                        courses (
                            id,
                            title,
                            tenants (
                                name,
                                owner_id,
                                users:owner_id ( full_name, avatar_url )
                            )
                        )
                    `)
                    .eq('id', lessonId)
                    .single();

                if (fetchError || !data) {
                    setError('Não foi possível carregar a aula.');
                } else {
                    setLesson(data);
                }
            } catch {
                setError('Erro de conexão. Verifique sua internet.');
            } finally {
                setLoading(false);
            }
        }

        fetchLesson();
    }, [lessonId]);

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color="#6324b2" size="large" />
            </View>
        );
    }

    if (error || !lesson) {
        return (
            <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <TouchableOpacity
                    style={{ position: 'absolute', top: 48, left: 16 }}
                    onPress={() => navigation.goBack()}
                >
                    <ArrowLeft color="white" size={20} />
                </TouchableOpacity>
                <Text style={{ color: '#888', textAlign: 'center' }}>{error || 'Aula não disponível.'}</Text>
            </View>
        );
    }

    const instructor = lesson.courses?.tenants?.users;
    const instructorName = instructor?.full_name || lesson.courses?.tenants?.name || 'Instrutor';
    const moduleLabel = lesson.order_index != null ? `Aula ${lesson.order_index + 1}` : 'Aula';
    const xpReward = lesson.xp_reward || 0;

    return (
        <View className="flex-1 bg-black">

            {/* Topbar Flutuante */}
            <View className="absolute top-12 left-4 z-50">
                <TouchableOpacity
                    className="w-10 h-10 bg-black/60 rounded-full items-center justify-center border border-white/10"
                    onPress={() => navigation.goBack()}
                >
                    <ArrowLeft color="white" size={20} />
                </TouchableOpacity>
            </View>

            {/* Player de Vídeo */}
            <View className="w-full bg-[#050505] relative border-b border-[#222]" style={{ height: width * (9 / 16) }}>
                {lesson.video_url ? (
                    <Video
                        ref={videoRef}
                        style={StyleSheet.absoluteFill}
                        source={{ uri: lesson.video_url }}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        onPlaybackStatusUpdate={s => setStatus(() => s)}
                    />
                ) : (
                    <View style={StyleSheet.absoluteFill} className="items-center justify-center">
                        <Text className="text-[#555] text-xs uppercase tracking-widest">Vídeo indisponível</Text>
                    </View>
                )}
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-6 py-6 pb-20">

                    {/* Meta Info */}
                    <View className="flex-row items-center gap-2 mb-3">
                        {xpReward > 0 && (
                            <View className="bg-[#111] px-2 py-1 rounded border border-[#222]">
                                <Text className="text-secondary text-[10px] font-bold uppercase tracking-widest">+{xpReward} XP</Text>
                            </View>
                        )}
                        <Text className="text-[#666] text-xs font-mono uppercase tracking-widest">{moduleLabel}</Text>
                    </View>

                    <Text className="font-bold text-white text-2xl uppercase leading-tight mb-2">{lesson.title}</Text>
                    {lesson.description ? (
                        <Text className="text-[#888] text-sm leading-relaxed mb-6">{lesson.description}</Text>
                    ) : null}

                    {/* Ações Rápidas */}
                    <View className="flex-row items-center justify-between border-y border-[#1a1a1a] py-4 mb-8">
                        <TouchableOpacity className="items-center">
                            <Heart color="#eb00bc" size={20} />
                            <Text className="text-[#888] text-[10px] rounded mt-2 uppercase tracking-widest">Curtir</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="items-center">
                            <Star color="#ffbd2e" size={20} />
                            <Text className="text-[#888] text-[10px] rounded mt-2 uppercase tracking-widest">Avaliar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="items-center">
                            <Share2 color="white" size={20} />
                            <Text className="text-[#888] text-[10px] rounded mt-2 uppercase tracking-widest">Link</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="items-center">
                            <MoreHorizontal color="#888" size={20} />
                            <Text className="text-[#888] text-[10px] rounded mt-2 uppercase tracking-widest">Mais</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Informações do Instrutor */}
                    <Text className="text-white font-bold uppercase tracking-widest mb-4">Instrutor</Text>
                    <View className="flex-row items-center bg-[#050505] border border-[#222] p-4 rounded-md">
                        <View className="w-12 h-12 rounded-full bg-[#111] border border-[#333] items-center justify-center mr-4">
                            <Star color="#ffbd2e" size={16} />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-bold">{instructorName}</Text>
                            <Text className="text-[#666] text-xs mt-1">{lesson.courses?.tenants?.name || ''}</Text>
                        </View>
                        <TouchableOpacity className="bg-[#111] px-4 py-2 border border-[#222] rounded-sm">
                            <Text className="text-white text-[10px] uppercase tracking-widest font-bold">Seguir</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </View>
    );
}
