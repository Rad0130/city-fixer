import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ['userRole', user?.email],
    enabled: !!user?.email && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role/${user.email}`);
      return res.data; // { role, isBlocked, isPremium }
    },
  });

  return {
    role: data?.role || 'citizen',
    isBlocked: data?.isBlocked || false,
    isPremium: data?.isPremium || false,
    isAdmin: data?.role === 'admin',
    isStaff: data?.role === 'staff',
    isCitizen: data?.role === 'citizen',
    roleLoading: isLoading || authLoading,
  };
};

export default useRole;