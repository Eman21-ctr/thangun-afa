import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export const useTransactions = (filters = {}) => {
    return useQuery({
        queryKey: ['transactions', filters],
        queryFn: async () => {
            let query = supabase
                .from('transactions')
                .select(`
          *,
          users (full_name)
        `)
                .order('date', { ascending: false })

            if (filters.type && filters.type !== 'all') {
                query = query.eq('type', filters.type)
            }

            if (filters.userId) {
                query = query.eq('user_id', filters.userId)
            }

            const { data, error } = await query
            if (error) throw error
            return data
        }
    })
}

export const useDashboardStats = (userId = null) => {
    return useQuery({
        queryKey: ['dashboard-stats', userId],
        queryFn: async () => {
            let query = supabase.from('transactions').select('type, total_amount')

            if (userId) {
                query = query.eq('user_id', userId)
            }

            const { data, error } = await query
            if (error) throw error

            const income = data
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + Number(t.total_amount), 0)

            const expense = data
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + Number(t.total_amount), 0)

            return {
                income,
                expense,
                balance: income - expense
            }
        }
    })
}

export const useTransactionMutations = () => {
    const queryClient = useQueryClient()

    const updateTransaction = useMutation({
        mutationFn: async ({ id, ...updates }) => {
            const { data, error } = await supabase
                .from('transactions')
                .update(updates)
                .eq('id', id)
            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
        }
    })

    const deleteTransaction = useMutation({
        mutationFn: async (id) => {
            const { error } = await supabase
                .from('transactions')
                .delete()
                .eq('id', id)
            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
        }
    })

    return { updateTransaction, deleteTransaction }
}
