import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export const useSettings = () => {
    const queryClient = useQueryClient()

    const categoriesQuery = useQuery({
        queryKey: ['expense_categories'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('expense_categories')
                .select('*')
                .order('name', { ascending: true })
            if (error) throw error
            return data
        }
    })

    const commoditiesQuery = useQuery({
        queryKey: ['commodities'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('commodities')
                .select('*')
                .order('name', { ascending: true })
            if (error) throw error
            return data
        }
    })

    const addCategory = useMutation({
        mutationFn: async (category) => {
            const { data, error } = await supabase
                .from('expense_categories')
                .insert(category)
            if (error) throw error
            return data
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['expense_categories'] })
    })

    const addCommodity = useMutation({
        mutationFn: async (commodity) => {
            const { data, error } = await supabase
                .from('commodities')
                .insert(commodity)
            if (error) throw error
            return data
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['commodities'] })
    })

    const toggleActive = useMutation({
        mutationFn: async ({ table, id, is_active }) => {
            const { data, error } = await supabase
                .from(table)
                .update({ is_active })
                .eq('id', id)
            if (error) throw error
            return data
        },
        onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: [variables.table] })
    })

    return {
        categories: categoriesQuery.data,
        commodities: commoditiesQuery.data,
        isLoading: categoriesQuery.isLoading || commoditiesQuery.isLoading,
        addCategory,
        addCommodity,
        toggleActive
    }
}
