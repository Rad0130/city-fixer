import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import useAuth from './useAuth';

const axiosSecure = axios.create({
    baseURL: 'http://localhost:3000'
})

const useAxiosSecure = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // intercept request
        const reqInterceptor = axiosSecure.interceptors.request.use(async config => {
            if (user?.accessToken) {
                config.headers.Authorization = `Bearer ${user.accessToken}`;
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });

        // interceptor response
        const resInterceptor = axiosSecure.interceptors.response.use((response) => {
            return response;
        }, async (error) => {
            console.log('Axios error:', error.response?.status, error.response?.data);
            
            const statusCode = error.response?.status;
            if (statusCode === 401 || statusCode === 403) {
                try {
                    await logOut();
                    navigate('/login');
                } catch (logoutError) {
                    console.error('Logout error:', logoutError);
                }
            }
            
            return Promise.reject(error);
        });

        return () => {
            axiosSecure.interceptors.request.eject(reqInterceptor);
            axiosSecure.interceptors.response.eject(resInterceptor);
        };
    }, [user, logOut, navigate]);

    return axiosSecure;
};

export default useAxiosSecure;