import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export const useMembers = () => {
    const queryClient = useQueryClient()

    const membersQuery = useQuery({
        queryKey: ['members'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('role', { ascending: true })
            if (error) throw error
            return data
        }
    })

    const updateMember = useMutation({
        mutationFn: async ({ id, ...updates }) => {
            const { data, error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', id)
            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members'] })
        }
    })

    const createMember = useMutation({
        mutationFn: async (userData) => {
            const { data, error } = await supabase.rpc('admin_create_member', {
                target_email: userData.email,
                target_password: userData.password,
                target_full_name: userData.full_name,
                target_role: userData.role,
                target_position: userData.position
            })
            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members'] })
        }
    })

    return {
        ...membersQuery,
        updateMember,
        createMember
    }
}
