import { supabase } from '../supabase';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Client } from '../../types/client';

export const useMeQuery = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('name');

      if (error) throw error;
      return data as Client[];
    },
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (credentials: { email: string, password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword(credentials);
      if (error) throw error;
      if (!data.user) throw new Error('No user data returned');
    }
  })
}

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
  })
}

