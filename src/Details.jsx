import { useRef, useEffect } from 'react';

function Details({ setDetailsVisbility, taskObj, updateTask }) {
    const textareaRef = useRef(null); // Create a ref for the textarea

    const handleInputChange = (e) => {
        updateTask({ ...taskObj, name: e.target.value });
    };

    const handleTextareaChange = (e) => {
        updateTask({ ...taskObj, note: e.target.value });
        autoResizeTextarea(); // Call resize on change
    };

    // Function to automatically resize the textarea
    const autoResizeTextarea = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset the height
            textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to match the scroll height
        }
    };

    // Resize textarea on initial render if taskObj.note is already filled
    useEffect(() => {
        autoResizeTextarea();
    }, [taskObj.note]);

    return (
        <>
            <div
                onClick={() => setDetailsVisbility(null, false)}
                className="z-10 w-screen h-screen bg-black bg-opacity-80 pointer-events-auto absolute"
            ></div>
            <div className="z-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-300 h-4/6 w-4/12 rounded-lg shadow-lg border-8 border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 shadow-gray-500">
                {taskObj && (
                    <>
                        <input
                            className="z-20 w-[550px] text-3xl font-bold tracking-tight bg-transparent text-gray-900 text-left mx-10 my-5 focus:outline-none focus:bg-gray-200 hover:bg-gray-200"
                            value={taskObj.name}
                            onChange={handleInputChange}
                            placeholder='Enter a task...'
                        />
                        <div className="z-20 overflow-auto max-h-[85%] bg-slate-200 rounded-sm mx-5 shadow-2xl">
                            <textarea
                                ref={textareaRef} // Attach ref to textarea
                                className="w-full p-5 focus:outline-none text-xl tracking-tight font-sans text-gray-900 bg-transparent resize-none" // Disable manual resizing
                                value={taskObj.note}
                                onChange={handleTextareaChange}
                                style={{ overflow: 'hidden' }} // Prevent scrollbars
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
