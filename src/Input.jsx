import React, { useState } from 'react';

function Input({ tasks, setTasks }) {
    const [taskText, setTaskText] = useState("");

    const handleInputChange = (e) => {
        setTaskText(e.target.value);
    };

const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskText) return;

    const newTask = {
        name: taskText,
        note: "",
    };

    console.log(tasks);

    const updatedBoardTasks = [...tasks[1], newTask];


    setTasks({
        ...tasks,
        1: updatedBoardTasks
    });

    setTaskText("");
};


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-center mt-5">
                    <input
                        placeholder="Enter your task"
                        type="text"
                        className="border-2 border-gray-200 p-2 w-1/3 text-center"
                        value={taskText}
                        onChange={handleInputChange}
                        id='userInput'
                        autoComplete='off'
                    />
                </div>
                <div className="flex items-center justify-center">
                    <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm mt-1">
                        Add Task
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Input;
