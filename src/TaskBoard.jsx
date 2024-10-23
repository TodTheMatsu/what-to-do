import { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard.jsx';
import './index.css';

console.log('TaskBoard.jsx loaded');

function TaskBoard({ tasks, boardId, deleteTask, setDetailsVisbility, setTasks, boards, isDragging, deleteBoard }) {
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

    // Update the boardTasks state with the new task for board 1
    setTasks({
      ...boards,
      [boardId]: updatedBoardTasks
    });

    setTaskText("");
  };

  return (
    <div className={`rounded-lg ${isDragging ? 'animate-pulse outline-dashed outline-2' : ''}`}>
      <Droppable droppableId={`Board-${boardId}`} type='group'>
        {(provided) => (
          
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="w-60 min-h-[5vh] flex-grow-0 h-min mt-5 border-4 border-gray-300 bg-gray-200 shadow-2xl pt-10 px-3 rounded-lg relative"
          >
            <button onClick={() => deleteBoard(boardId)} className='w-6 h-[2vh] hover:bg-gray-400 bg-gray-200  text-gray-900 font-bold  rounded-full top-0 right-0 absolute'>X</button>
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
                      setDetailsVisbility={setDetailsVisbility} 
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <form onSubmit={handleSubmit} className="w-full">
              <input 
                className='w-full h-[3vh] mb-2 mt-2 border-4 bg-transparent shadow-2xl pt-0.5 rounded-lg text-center font-bold hover:bg-gray-300 hover:placeholder-gray-500 focus:outline-dashed focus:outline-gray-400 focus:placeholder-transparent hover:font-extrabold' 
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
