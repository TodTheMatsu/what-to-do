import React, { useEffect, useState } from 'react';

function Header() {
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
    
    const [displayText, setDisplayText] = useState('');
    const [index, setIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(200);
    const [pauseDuration, setPauseDuration] = useState(2000);
    const [isBlinking, setIsBlinking] = useState(false); // New state for blinking

    useEffect(() => {
        const handleTyping = () => {
            const currentPhrase = phrases[index];
            const updatedText = isDeleting 
                ? currentPhrase.slice(0, displayText.length - 1) 
                : currentPhrase.slice(0, displayText.length + 1);
                
            setDisplayText(updatedText);
            
            if (!isDeleting && updatedText === currentPhrase) {
                setIsBlinking(true); // Start blinking after typing is done
                setIsDeleting(true);
                setTypingSpeed(pauseDuration);
            } else if (isDeleting && updatedText === '') {
                setIsBlinking(false); // Stop blinking when deleting starts
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

    return (
        <header className="bg-white shadow-lg min-h-24 fixed w-full z-10">
            <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center ">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 text-center mr-2 outline-dashed rounded-2xl px-2 py-2">
                    {displayText}
                    <span className={`cursor ${isBlinking ? 'blinking' : ''}`}>|</span> {/* Cursor element with conditional class */}
                </h1>
            </div>
        </header>
    );
}

export default Header;
