import Header from './Header.jsx'
import Input from './Input.jsx'
import TaskBoard from './TaskBoard.jsx'
import { useEffect, useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd';
import AddButton from './AddButton.jsx';
import Details from './Details.jsx';

function App() {
  const [boardTasks, setBoardTasks] = useState({
    1: [{
      name: 'Your first task',
      note: 'Welcome to your first ever task! This task is designed to help you get familiar with how our task management system works. You’ll be able to add new tasks, move them between boards, and delete them when completed. Think of this task as your initiation into a more organized workflow. If at any point you have questions or need assistance, don’t hesitate to seek help or refer to the guidance provided. Our aim is to make your task management experience as smooth and efficient as possible. Dive in, experiment, and don’t be afraid to explore all the features available. Enjoy your journey to becoming a productivity master!'}],
  });
  const [showDetails, setShowDetails] = useState({
    show: false,
    taskObj: null
  });

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // If the task is dropped in the same spot, no need to do anything
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Get the source and destination board IDs
    const sourceBoardId = source.droppableId.split('-')[1];
    const destinationBoardId = destination.droppableId.split('-')[1];

    // Copy the tasks from the source board
    const sourceBoardTasks = Array.from(boardTasks[sourceBoardId]);
    const [movedTask] = sourceBoardTasks.splice(source.index, 1);

    // If moving within the same board
    if (sourceBoardId === destinationBoardId) {
      sourceBoardTasks.splice(destination.index, 0, movedTask);
      setBoardTasks({
        ...boardTasks,
        [sourceBoardId]: sourceBoardTasks
      });
    } else {
      // Move task to a different board
      const destinationBoardTasks = Array.from(boardTasks[destinationBoardId]);
      destinationBoardTasks.splice(destination.index, 0, movedTask);

      setBoardTasks({
        ...boardTasks,
        [sourceBoardId]: sourceBoardTasks,
        [destinationBoardId]: destinationBoardTasks
      });
    }
  };
  const deleteTask = (boardId, index) => {
    const updatedTasks = [...boardTasks[boardId]];
    updatedTasks.splice(index, 1); // Remove the task at the specified index

    setBoardTasks({
      ...boardTasks,
      [boardId]: updatedTasks
    });
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
  };

  const setDetailsVisbility = (taskObj,detailStatus) => {
    
    if (taskObj && detailStatus) {
      console.log(taskObj,detailStatus);
      setShowDetails({
        show: true,
        taskObj: taskObj
      });
      
    }

    if (!detailStatus) {
      setShowDetails({
        show: false,
        taskObj: null
      });
    }

  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
       {showDetails.show && <Details setDetailsVisbility={setDetailsVisbility} taskObj={showDetails.taskObj} updateTask={updateTask} />}
      <Header />
      <Input tasks={boardTasks} setTasks={setBoardTasks} />
      <div className='flex'> 
        {Object.keys(boardTasks).map((board, index) => (
          <TaskBoard key={index} tasks={boardTasks[board]} boardId={[board]} deleteTask={deleteTask} setDetailsVisbility={setDetailsVisbility}/>
        ))}
        <AddButton addBoard={addBoard}/>
      </div>
       
    </DragDropContext>
  );
}

export default App;
