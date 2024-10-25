import { useRef, useEffect } from 'react';

function Details({ setDetailsVisibility, taskObj, updateTask }) {
    const textareaRef = useRef(null);

    const handleInputChange = (e) => {
        updateTask({ ...taskObj, name: e.target.value });
    };

    const handleTextareaChange = (e) => {
        updateTask({ ...taskObj, note: e.target.value });
        autoResizeTextarea();
    };

    const autoResizeTextarea = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        autoResizeTextarea();
    }, [taskObj.note]);

    return (
        <>
            <div
                onClick={() => setDetailsVisibility(null, false)}
                className="z-20 w-full h-screen bg-black bg-opacity-80 pointer-events-auto absolute"
            ></div>
            <div className="z-30 w-[600px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-300 dark:bg-gray-800 h-4/6 rounded-lg shadow-lg border-8 border-gray-300 dark:border-gray-800 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-900 shadow-gray-500">
                {taskObj && (
                    <>
                        <input
                            className="z-30 w-[500px] text-3xl font-bold tracking-tight bg-transparent text-gray-900 dark:text-gray-100 text-left mx-10 my-5 focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                            value={taskObj.name}
                            onChange={handleInputChange}
                            placeholder='Enter a task...'
                        />
                        <div className="z-30 overflow-auto max-h-[85%] bg-slate-200 dark:bg-slate-800 rounded-sm mx-5 shadow-2xl dark:shadow-gray-700/50">
                            <textarea
                                ref={textareaRef}
                                className="w-full p-5 focus:outline-none text-xl tracking-tight font-sans text-gray-900 dark:text-gray-100 bg-transparent resize-none"
                                value={taskObj.note}
                                onChange={handleTextareaChange}
                                style={{ overflow: 'hidden' }}
                                placeholder='Enter a note...'
                            />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default Details;
