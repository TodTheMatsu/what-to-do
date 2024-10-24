import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token); // Store token securely
            navigate('/what-to-do/'); // Redirect to dashboard on success
        } catch (error) {
            setError(error.message);
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center"> 
            <div className="w-[400px] h-[400px] bg-gray-100 shadow-2xl border-2 border-gray-400 rounded-md">
                <h1 className="text-3xl font-bold select-none tracking-tight text-gray-900 text-center">Sign in</h1>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form className="flex flex-col items-center justify-center h-[250px]" onSubmit={handleSubmit}>
                    <input 
                        placeholder="Email address" 
                        type="email" 
                        required 
                        className="w-[300px] h-[50px] rounded-md border-2 mt-5" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        placeholder="Password" 
                        type="password" 
                        required 
                        className="w-[300px] h-[50px] rounded-md border-2 mt-5" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="w-[300px] h-[50px] rounded-md border-2 mt-5 bg-gray-900 text-white font-bold hover:bg-gray-700">Login</button>
                </form>
                <Link to="/what-to-do/" className="text-center text-gray-400 underline"><p>Continue as guest</p></Link>
            </div>
        </div>
    );
}

export default Login;