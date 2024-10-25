import Header from './Header.jsx';
import Input from './Input.jsx';
import TaskBoard from './TaskBoard.jsx';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AddButton from './AddButton.jsx';
import Details from './Details.jsx';
import axios from 'axios';

function App() {
  const [boardOrder, setBoardOrder] = useState([1]);
  const [boardTasks, setBoardTasks] = useState({
    1: [{
      name: 'Click on me!',
      note: 'Welcome to your first ever task! This task is designed to help you get familiar with how our task management system works. You’ll be able to add new tasks, move them between boards, and delete them when completed. You can press enter after typing in the task name in the input field to create a new task.',
    }],
  });
  const [darkMode, setDarkMode] = useState(false);
  const [showDetails, setShowDetails] = useState({ show: false, taskObj: null });
  const [isDataFetched, setIsDataFetched] = useState(false); // Track if data has been fetched
  const [isSaving, setIsSaving] = useState(false); // Track if data is being saved
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
};
  useEffect(() => {
    const fetchBoards = async () => {
      const token = localStorage.getItem('token');
      if (!token) return; // Return early if not logged in

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/get-boards`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          setBoardOrder(response.data.boardOrder);
          setBoardTasks(response.data.boardTasks);
          setIsDataFetched(true); // Set flag to indicate data has been fetched
        }
      } catch (error) {
        console.error('Error fetching boards:', error);
      }
    };

    fetchBoards();
  }, []);

  const saveBoards = async () => {
    if (isSaving || !isDataFetched) return; // Prevent saving if already saving or data not fetched

    const token = localStorage.getItem('token');
    if (!token) return;

    setIsSaving(true); // Set saving flag
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/save-boards`, {
        boardOrder,
        boardTasks,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Error saving boards:', error);
    } finally {
      setIsSaving(false); // Reset saving flag
    }
  };

  useEffect(() => {
    if (isDataFetched) {
      saveBoards(); // Call save only if data has been fetched
    }
  }, [boardOrder, boardTasks, isDataFetched]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, type } = result;

    if (type === 'board') {
      const newBoardOrder = Array.from(boardOrder);
      const [movedBoardId] = newBoardOrder.splice(source.index, 1);
      newBoardOrder.splice(destination.index, 0, movedBoardId);
      setBoardOrder(newBoardOrder);
      return;
    }

    const sourceBoardId = source.droppableId.split('-')[1];
    const destinationBoardId = destination.droppableId.split('-')[1];
    const sourceBoardTasks = Array.from(boardTasks[sourceBoardId]);
    const [movedTask] = sourceBoardTasks.splice(source.index, 1);
    let updatedBoardTasks;

    if (sourceBoardId === destinationBoardId) {
      sourceBoardTasks.splice(destination.index, 0, movedTask);
      updatedBoardTasks = {
        ...boardTasks,
        [sourceBoardId]: sourceBoardTasks,
      };
    } else {
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
      [boardId]: updatedTasks,
    });
  };

  const deleteBoard = (boardId) => {
    const boardIndex = boardOrder.indexOf(boardId);
    if (boardIndex === -1) return;

    const updatedBoardOrder = [...boardOrder];
    updatedBoardOrder.splice(boardIndex, 1);

    const updatedBoardTasks = { ...boardTasks };
    delete updatedBoardTasks[boardId];

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
      [newBoardId]: [],
    });
    setBoardOrder([...boardOrder, newBoardId]);
  };

  const setDetailsVisibility = (taskObj, detailStatus) => {
    if (taskObj && detailStatus) {
      setShowDetails({
        show: true,
        taskObj: taskObj,
      });
    } else {
      setShowDetails({
        show: false,
        taskObj: null,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {showDetails.show && <Details setDetailsVisibility={setDetailsVisibility} taskObj={showDetails.taskObj} updateTask={updateTask} />}
      <Header toggleDarkMode={toggleDarkMode} />
      <div className="pt-24">
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
                          setDetailsVisibility={setDetailsVisibility}
                          setTasks={setBoardTasks}
                          boards={boardTasks}
                          deleteBoard={deleteBoard}
                          isDragging={snapshot.isDragging}
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
      </div>
    </DragDropContext>
  );
}

export default App;
