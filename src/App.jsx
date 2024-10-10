import Header from './Header.jsx'
import Input from './Input.jsx'
import TaskBoard from './TaskBoard.jsx'
import { useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd';
import AddButton from './AddButton.jsx';


function App() {
  const [boardTasks, setBoardTasks] = useState({
    1: [{name: 'Your first task', note:'Notes go here'}],
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

  const addBoard = () => {
    const newBoardId = Object.keys(boardTasks).length + 1;
    setBoardTasks({
      ...boardTasks,
      [newBoardId]: []
    });
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Header />
      <Input tasks={boardTasks} setTasks={setBoardTasks} />
      <div className='flex'> 
        {Object.keys(boardTasks).map((board, index) => (
          <TaskBoard key={index} tasks={boardTasks[board]} boardId={board} deleteTask={deleteTask} />

        ))}
        <AddButton addBoard={addBoard}/>
      </div>
    </DragDropContext>
  );
}

export default App;
