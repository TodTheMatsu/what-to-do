import Header from './Header.jsx';
import Input from './Input.jsx';
import TaskBoard from './TaskBoard.jsx';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AddButton from './AddButton.jsx';
import Details from './Details.jsx';

function App() {
  const [boardOrder, setBoardOrder] = useState([1]); // Keeps track of the order of boards
  const [boardTasks, setBoardTasks] = useState({
    1: [{
      name: 'Click on me!',
      note: 'Welcome to your first ever task! This task is designed to help you get familiar with how our task management system works. You’ll be able to add new tasks, move them between boards, and delete them when completed.'
    }],
  });
  const [showDetails, setShowDetails] = useState({
    show: false,
    taskObj: null
  });

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, type } = result;

    // Handle dragging of boards
    if (type === 'board') {
      const newBoardOrder = Array.from(boardOrder);
      const [movedBoardId] = newBoardOrder.splice(source.index, 1);
      newBoardOrder.splice(destination.index, 0, movedBoardId);
      setBoardOrder(newBoardOrder);
      return;
    }

    // Handle dragging of tasks
    const sourceBoardId = source.droppableId.split('-')[1];
    const destinationBoardId = destination.droppableId.split('-')[1];
    const sourceBoardTasks = Array.from(boardTasks[sourceBoardId]);
    const [movedTask] = sourceBoardTasks.splice(source.index, 1);
    let updatedBoardTasks;

    if (sourceBoardId === destinationBoardId) {
      // Moving within the same board
      sourceBoardTasks.splice(destination.index, 0, movedTask);
      updatedBoardTasks = {
        ...boardTasks,
        [sourceBoardId]: sourceBoardTasks,
      };
    } else {
      // Moving to a different board
      const destinationBoardTasks = Array.from(boardTasks[destinationBoardId]);
      destinationBoardTasks.splice(destination.index, 0, movedTask);
      updatedBoardTasks = {
        ...boardTasks,
        [sourceBoardId]: sourceBoardTasks,
        [destinationBoardId]: destinationBoardTasks,
      };
    }

    setBoardTasks(updatedBoardTasks);
  };

  const deleteTask = (boardId, index) => {
    const updatedTasks = [...boardTasks[boardId]];
    updatedTasks.splice(index, 1);
    setBoardTasks({
      ...boardTasks,
      [boardId]: updatedTasks
    });
  };

  const deleteBoard = (boardId) => {
    // Get the index of the board in boardOrder
    const boardIndex = boardOrder.indexOf(boardId);
  
    // Check if the board exists
    if (boardIndex === -1) return;
  
    // Remove the board from the boardOrder array
    const updatedBoardOrder = [...boardOrder];
    updatedBoardOrder.splice(boardIndex, 1);
  
    // Remove the board from boardTasks
    const updatedBoardTasks = { ...boardTasks };
    delete updatedBoardTasks[boardId];
  
    // Update state
    setBoardOrder(updatedBoardOrder);
    setBoardTasks(updatedBoardTasks);
  };
  

  const updateTask = (updatedTask) => {
    const updatedBoardTasks = { ...boardTasks };
    for (const boardId in updatedBoardTasks) {
      const taskIndex = updatedBoardTasks[boardId].findIndex(task => task.name === showDetails.taskObj.name);
      if (taskIndex !== -1) {
        updatedBoardTasks[boardId][taskIndex] = updatedTask;
        break;
      }
    }
    setBoardTasks(updatedBoardTasks);
    setShowDetails({ ...showDetails, taskObj: updatedTask });
  };

  const addBoard = () => {
    const newBoardId = Object.keys(boardTasks).length + 1;
    setBoardTasks({
      ...boardTasks,
      [newBoardId]: []
    });
    setBoardOrder([...boardOrder, newBoardId]);
  };

  const setDetailsVisbility = (taskObj, detailStatus) => {
    if (taskObj && detailStatus) {
      setShowDetails({
        show: true,
        taskObj: taskObj
      });
    } else {
      setShowDetails({
        show: false,
        taskObj: null
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {showDetails.show && <Details setDetailsVisbility={setDetailsVisbility} taskObj={showDetails.taskObj} updateTask={updateTask} />}
      <Header />
      <Droppable droppableId="board-container" direction="horizontal" type='board'>
        {(provided) => (
          <div className='flex' ref={provided.innerRef} {...provided.droppableProps}>
            {boardOrder.map((boardId, index) => (
             <Draggable key={boardId} draggableId={`board-${boardId}`} index={index}>
             {(provided, snapshot) => (
               <div ref={provided.innerRef} {...provided.draggableProps} className="mx-2">
                 <div {...provided.dragHandleProps}>
                   <TaskBoard
                     tasks={boardTasks[boardId]}
                     boardId={boardId}
                     deleteTask={deleteTask}
                     setDetailsVisbility={setDetailsVisbility}
                     setTasks={setBoardTasks}
                     boards={boardTasks}
                     deleteBoard={deleteBoard}
                     isDragging={snapshot.isDragging} // Make sure this prop is being passed here
                   />
                 </div>
               </div>
             )}
           </Draggable>
           
            ))}
            {provided.placeholder}
            <AddButton addBoard={addBoard} />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default App;
