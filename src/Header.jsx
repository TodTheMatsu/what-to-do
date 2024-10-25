import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Header({toggleDarkMode}) {
    const phrases = [
        "what",
        "What to do?",
        "What to eat?",
        "What to listen?",
        "What to play?",
        "What to read?",
        "What to watch?",
        "What to learn?",
        "What to cook?",
        "What to explore?",
        "What to try?",
        "What to make?",
        "What to buy?",
        "What to write?",
        "What to visit?",
        "What to enjoy?",
        "What to discuss?",
        "What to discover?",
        "What to create?",
        "What to experience?"
    ];
    const navigate = useNavigate();
    const [displayText, setDisplayText] = useState('');
    const [index, setIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(200);
    const [pauseDuration, setPauseDuration] = useState(2000);
    const [isBlinking, setIsBlinking] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status

    useEffect(() => {
        const token = localStorage.getItem('token'); // Check for token in local storage
        setIsLoggedIn(!!token); // Set logged-in status based on token presence
    }, []);

    useEffect(() => {
        const handleTyping = () => {
            const currentPhrase = phrases[index];
            const updatedText = isDeleting 
                ? currentPhrase.slice(0, displayText.length - 1) 
                : currentPhrase.slice(0, displayText.length + 1);
                
            setDisplayText(updatedText);
            
            if (!isDeleting && updatedText === currentPhrase) {
                setIsBlinking(true);
                setIsDeleting(true);
                setTypingSpeed(pauseDuration);
            } else if (isDeleting && updatedText === '') {
                setIsBlinking(false);
                setIsDeleting(false);
                setIndex((prevIndex) => (prevIndex + 1) % phrases.length);
                setTypingSpeed(200);
            } else {
                setTypingSpeed(isDeleting ? 100 : 200);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);

        return () => clearTimeout(timer);
    }, [displayText, isDeleting, index, phrases, typingSpeed, pauseDuration]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        window.location.reload();
    };
    


    return (
        <header className="bg-white shadow-lg dark:shadow-gray-700/50 min-h-24 fixed w-full z-10 dark:bg-gray-800">
            <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white text-center mr-2 outline-dashed rounded-2xl px-2 py-2">
                    {displayText}
                    <span className={`cursor ${isBlinking ? 'blinking' : ''}`}>|</span>
                </h1>
            </div>
            {!isLoggedIn && ( // Render buttons only if user is not logged in
                <>
                    <button 
                        className='bg-gray-100 dark:bg-gray-800 dark:text-white text-black p-2 rounded-full shadow-xl dark:shadow-gray-700/50 border-2 fixed top-7 right-4'
                        onClick={() => window.location.href='/what-to-do/login/'}>
                        Sign in
                    </button>
                    <button 
                        className='bg-gray-900 text-white dark:bg-gray-100 dark:text-black p-2 rounded-full shadow-xl dark:shadow-gray-700/50 border-2 fixed top-7 right-24' 
                        onClick={() => window.location.href='/what-to-do/signup/'}>
                        Sign up
                    </button>
                </>
            )}
            {isLoggedIn && ( // Render logout button only if user is logged in
                <button 
                    className='bg-red-500 text-white p-2 rounded-full shadow-xl dark:shadow-gray-700/50 border-2 fixed top-7 right-4' 
                    onClick={handleLogout}>
                    Log out
                </button>
            )}
                <button 
                    className='bg-gray-900 text-white dark:bg-gray-100 dark:text-black p-2 rounded-full shadow-xl dark:shadow-gray-700/50 border-2 fixed top-7 left-4' 
                    onClick={toggleDarkMode}>
                    Toggle dark mode
                </button>
        </header>
    );
} 

export default Header;
