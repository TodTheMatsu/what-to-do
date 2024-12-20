import { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard.jsx';
import './index.css';

console.log('TaskBoard.jsx loaded');

function TaskBoard({ tasks, boardId, deleteTask, setDetailsVisibility, setTasks, boards, isDragging, deleteBoard }) {
  const [taskText, setTaskText] = useState("");

  const handleInputChange = (e) => {
    setTaskText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskText) return;

    // Create a new task object
    const newTask = {
      name: taskText,
      note: "",
    };

    const updatedBoardTasks = [...boards[boardId], newTask];
    setTasks({
      ...boards,
      [boardId]: updatedBoardTasks
    });

    setTaskText("");
  };

  return (
    <div className={`rounded-lg ${isDragging ? 'animate-pulse outline-dashed outline-2 dark:outline-white' : ''} dark:bg-gray-800  bg-transparent hover:outline hover:outline-1`}>
      <Droppable droppableId={`Board-${boardId}`} type='group'>
        {(provided) => (
          
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="w-60 min-h-[5vh] flex-grow-0 h-min mt-5 dark:border-gray-700 bg-transparent shadow-2xl dark:from-gray-700/50 pt-10 px-3 rounded-lg relative bg-gradient-to-t from-amber-100 to-100%"
          >
            <button onClick={() => deleteBoard(boardId)} className='w-6 h-[2vh] bg-transparent dark:bg-gray-800  text-gray-900 dark:text-gray-100 font-bold  rounded-full top-0 right-0 absolute'>X</button>
            {tasks && tasks.map((task, index) => (
              <Draggable key={index} draggableId={`draggable-${boardId}-${index}`} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="draggable"
                  >
                    <TaskCard 
                      task={task} 
                      provided={provided} 
                      snapshot={snapshot} 
                      isDragging={snapshot.isDragging} 
                      deleteTask={() => deleteTask(boardId, index)} 
                      setDetailsVisibility={setDetailsVisibility} 
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <form onSubmit={handleSubmit} className="w-full">
              <input 
                className='w-full h-[3vh] mb-2 mt-2 dark:border-gray-700 bg-transparent shadow-2xl
                 dark:shadow-gray-700/50 pt-0.5 rounded-lg text-center  hover:bg-amber-50/50 dark:hover:bg-gray-700 hover:placeholder-gray-500
                  focus:outline-dashed focus:outline-gray-400 focus:placeholder-transparent hover:font-bold dark:text-gray-100' 
                placeholder='+ Add a task'
                type="text"
                value={taskText}
                onChange={handleInputChange}
                id='userInput'
                autoComplete='off'
              />
              <button type="submit" className="hidden"></button>
            </form>
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default TaskBoard;


