axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                console.error('Refresh token not available, redirecting to login.');
                // Optionally, add your redirect logic here
                return Promise.reject(error);
            }

            try {
                const { data } = await axios.post('/refresh-token', {
                    refreshToken,
                });

                localStorage.setItem('accessToken', data.accessToken);

                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                console.error('Failed to refresh token:', refreshError);
                // Optionally handle redirect to login on refresh failure
                // Add your redirect logic here
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
