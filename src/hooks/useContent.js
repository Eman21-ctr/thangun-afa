import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export const useContent = () => {
    const queryClient = useQueryClient()

    // SITE SETTINGS
    const settingsQuery = useQuery({
        queryKey: ['site_settings'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('site_settings')
                .select('*')
                .eq('id', 'main')
                .single()
            if (error) throw error
            return data
        }
    })

    const updateSettings = useMutation({
        mutationFn: async (newSettings) => {
            const { data, error } = await supabase
                .from('site_settings')
                .update(newSettings)
                .eq('id', 'main')
            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['site_settings'] })
        }
    })

    // GALLERY
    const galleryQuery = useQuery({
        queryKey: ['gallery'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('gallery_photos')
                .select('*')
                .order('created_at', { ascending: false })
            if (error) throw error
            return data
        }
    })

    const addGallery = useMutation({
        mutationFn: async (photo) => {
            const { data, error } = await supabase.from('gallery_photos').insert(photo)
            if (error) throw error
            return data
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gallery'] })
    })

    const deleteGallery = useMutation({
        mutationFn: async (id) => {
            const { error } = await supabase.from('gallery_photos').delete().eq('id', id)
            if (error) throw error
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gallery'] })
    })

    // TEAM
    const teamQuery = useQuery({
        queryKey: ['team'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('team_members')
                .select('*')
                .order('order_priority', { ascending: true })
            if (error) throw error
            return data
        }
    })

    const addTeamMember = useMutation({
        mutationFn: async (member) => {
            const { data, error } = await supabase.from('team_members').insert(member)
            if (error) throw error
            return data
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team'] })
    })

    const deleteTeamMember = useMutation({
        mutationFn: async (id) => {
            const { error } = await supabase.from('team_members').delete().eq('id', id)
            if (error) throw error
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team'] })
    })

    // NEWS
    const newsQuery = useQuery({
        queryKey: ['news'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('news_articles')
                .select('*')
                .order('published_at', { ascending: false })
            if (error) throw error
            return data
        }
    })

    const addNews = useMutation({
        mutationFn: async (article) => {
            const { data, error } = await supabase
                .from('news_articles')
                .insert({ ...article, slug: article.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''), published_at: new Date() })
            if (error) throw error
            return data
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['news'] })
    })

    const useNewsArticle = (slug) => useQuery({
        queryKey: ['news', slug],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('news_articles')
                .select('*')
                .eq('slug', slug)
                .single()
            if (error) throw error
            return data
        },
        enabled: !!slug
    })

    const deleteNews = useMutation({
        mutationFn: async (id) => {
            const { error } = await supabase.from('news_articles').delete().eq('id', id)
            if (error) throw error
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['news'] })
    })

    return {
        settings: settingsQuery.data,
        isLoading: settingsQuery.isLoading,
        updateSettings,
        gallery: galleryQuery.data || [],
        isLoadingGallery: galleryQuery.isLoading,
        addGallery,
        deleteGallery,
        team: teamQuery.data || [],
        isLoadingTeam: teamQuery.isLoading,
        addTeamMember,
        deleteTeamMember,
        news: newsQuery.data || [],
        isLoadingNews: newsQuery.isLoading,
        addNews,
        deleteNews,
        useNewsArticle
    }
}
