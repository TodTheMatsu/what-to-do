import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        // Retrieve dark mode setting from localStorage on component mount
        const savedDarkMode = JSON.parse(localStorage.getItem('darkMode'));
        if (savedDarkMode) {
          document.documentElement.classList.add('dark'); // Apply dark mode class if saved
        }
      }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simple email validation
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address.');
            setLoading(false);
            return;
        }

        // Simple password validation
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Signup failed');
            }

            const data = await response.json();
            console.log('Signup successful:', data);
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            setEmail(''); // Reset email field
            setPassword(''); // Reset password field
            navigate('/what-to-do/'); // Redirect to dashboard or another route
        } catch (error) {
            setError(error.message);
            console.error('Error during signup:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"> 
            <div className="w-[400px] h-[400px] bg-white dark:bg-gray-800 shadow-2xl border-2 border-gray-400 dark:border-gray-700 rounded-md">
                <h1 className="text-3xl font-bold select-none tracking-tight text-gray-900 dark:text-gray-100 text-center">Create your account</h1>
                {error && <p className="text-red-500 dark:text-red-400 text-center">{error}</p>}
                <form className="flex flex-col items-center justify-center h-[250px]" onSubmit={handleSubmit}>
                    <input 
                        placeholder="Email address" 
                        type="email" 
                        required 
                        className="w-[300px] h-[50px] rounded-md border-2 mt-5 dark:border-gray-700 dark:bg-gray-700 dark:text-white" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        placeholder="Password" 
                        type="password" 
                        required 
                        className="w-[300px] h-[50px] rounded-md border-2 mt-5 dark:border-gray-700 dark:bg-gray-700 dark:text-white" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                        className={`w-[300px] h-[50px] rounded-md border-2 mt-5 ${loading ? 'bg-gray-400' : 'bg-gray-900 dark:bg-gray-700'} text-white font-bold hover:bg-gray-700 dark:hover:bg-gray-600`}
                        disabled={loading}
                    >
                        {loading ? (
                            <span>Signing up...</span> // You could replace this with a spinner
                        ) : 'Sign up'}
                    </button>
                </form>
                <Link to="/what-to-do/" className="text-center text-gray-400 dark:text-gray-500 underline"><p>Continue as guest</p></Link>
            </div>
        </div>
    );
}

export default Signup;


